import PuerObject from '../core/PuerObject.js'

import DataBase   from './DataBase.js'
import DataSet    from './DataSet.js'


export default class DataSource extends PuerObject { // TODO: add ORM
	static $($) { window.$ = $ }

	/**************************************************************/

	static define(name, cls, url, isSingular=false, isCacheable=false, isPreloadable=false) {
		cls = cls || DataSource
		if (DataSource.hasOwnProperty(name)) {
			throw `DataSource class already has property "${name}"`
		}

		const dataSource = new cls(name, url, isSingular, isCacheable, isPreloadable)
		Object.defineProperty(DataSource, name, {
			get: function() {
				return dataSource
			}
		})
		return dataSource
	}

	/**************************************************************/

	constructor(name, url, isSingular, isCacheable, isPreloadable) {
		super()

		this.name          = name
		this.itemIds       = []
		this.url           = url
		this.count         = null
		this.db            = null
		this.isSingular    = isSingular
		this.isCacheable   = isCacheable
		this.isPreloadable = isPreloadable

		this._wasLoaded      = false
		this._isLoading      = false // initial load or reload in progress
		this._changeHandlers = []
		this._lastLoad       = null

		if (isPreloadable) {
			$._loadDataSource()
			this.load()
		}
	}

	_recalculate() {
		const items = this.data
		for (const handler of this._changeHandlers) {
			handler(items)
		}
	}

	_onItemAdd(item) {
		if (!this._isLoading) {
			this.trigger($.Event.DATASOURCE_ITEM_ADD, { item: item })
		}
	}

	_onLoad() {
		this.trigger($.Event.DATASOURCE_DATA, { itemIds: this.itemIds })
		if (this.isPreloadable && !this._wasLoaded) {
			this._wasLoaded = true
			$._onDataSourceLoad()
		}
		this._isLoading = false
	}

	_connect(callback) {
		const _this = this
		DataBase.connect(this.constructor.name, db => {
			_this.db = db
			callback(db)
		})
	}

	_load(method=null, params=null, headers=null, callback=null) {
		this._lastLoad = {
			method  : method,
			params  : params,
			headers : headers
		}
		const _this = this

		this._isLoading = true
		this.clear(() => {
			if (!method && this.isCacheable) {
				this._connect(db => {
					db.getCount(count => {
						if (count > 0) {
							_this.count = count
							_this._loadFromDb(callback)
						} else {
							_this._loadFromUrl(method, params, headers, callback)
						}
					})
				})
			} else {
				this._loadFromUrl(method, params, headers, callback)
			}
		})
	}

	_loadFromUrl(method=null, params=null, headers=null, callback=null) {
		method = method || 'GET'
		$.Request.request(
			this.url,
			method,
			params,
			headers,
			(items, headers) => {
				this.isCacheable && this.db.clear()
				items = this.addItems(items)
				this._onLoad()
				callback && callback(items)
			},
		)
	}

	_loadFromDb(callback) {
		const _this = this

		this.db.readItems(0, _this.count, (items) => {
			for (const item of items) {
				_this._addItemToStore(item)
				this._onItemAdd(item)
			}
			this._onLoad()
			callback && callback(items)
		})
	}

	_addItemToDb(item) {
		this.isCacheable && this.db.addItem(item)
	}

	_changeItemInDb(item) {
		this.isCacheable && this.db.updateItem(item)
	}

	_addItemToStore(item) {
		const dataId = $.DataStore.set(null, item)
		item.dataId  = dataId
		this.itemIds.push(dataId)
	}

	_changeItemInStore(item) {
		$.DataStore.set(item.dataId, item, true)
	}

	/********************************************************/

	get data() {
		return $.DataStore.get(this.itemIds)
	}

	select(path, data=null) {
		data = data || this.data
		return $.Object.select(data, path)
	}


	fill(items, callback=null) {
		this._isLoading = true
		this.clear(() => {
			items = this.addItems(items)
			this._onLoad()
			callback && callback(items)
		})
	}

	load(
		method   = null,
		params   = null,
		headers  = null,
		defer    = true,
		callback = null
	) {
		if (defer) {
			$.defer(this._load, [method, params, headers, callback], this)
		} else {
			this._load(method, params, headers, callback)
		}
	}

	reload(callback=null) {
		if (this._lastLoad) {
			this._load(
				this._lastLoad.method,
				this._lastLoad.params,
				this._lastLoad.headers,
				callback
			)
		}
	}

	update() {
		for (const item of this.data) {
			this.trigger($.Event.DATASOURCE_ITEM_ADD, { item: item })
		}
		this.trigger($.Event.DATASOURCE_DATA, { itemIds: this.itemIds })
	}

	clear(callback) {
		for (const dataId of this.itemIds) {
			$.DataStore.unset(dataId)
		}
		this._recalculate()
		this.itemIds = []
		this.trigger($.Event.DATASOURCE_CLEAR, {})

		if (this.isCacheable && this.db) {
			this.db.clear(() => {
				callback()
			})
		} else {
			callback()
		}
	}

	addItem(item, recalculate=true) {
		item = this.adaptItem(item)
		this.isCacheable && this._addItemToDb(item)
		this._addItemToStore(item)
		recalculate && this._recalculate()
		this._onItemAdd(item)
	}

	addItems(items, headers) {
		items = this.adaptItems(items, headers)
		if (this.isSingular) {
			this.addItem(items, false)
		} else {
			for (const item of items) {
				this.addItem(item, false)
			}
		}
		this._recalculate()
		return items
	}

	changeItem(item) {
		if (!item.dataId) {
			throw `Changed item must have dataId`
		}

		this.isCacheable && this._changeItemInDb(item)
		this._changeItemInStore(item)
		this._recalculate()
		this.trigger($.Event.DATASOURCE_ITEM_CHANGE, { item: item })
	}

	removeItem(item) {
		this._recalculate()
		this.trigger($.Event.DATASOURCE_ITEM_REMOVE, { itemId: item.dataId })
	}

	/******************************************************************/

	adaptItems (items, headers) { return items }
	adaptItem  (item)           { return item  }

	/******************************************************************/

	filter(f) {
		const data = this.isSingular
			? [this.data]
			: this.data
		return data.filter((item, _) => f(item))
	}
}
