import PuerObject from '../core/class.PuerObject.js'

import DataBase   from './class.DataBase.js'
import DataSet    from './class.DataSet.js'


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
		this._changeHandlers = []
		this._lastLoad       = null

		if (isPreloadable) {
			$._loadDataSource()
			// console.log($._preloadCount, this.name)
			this.load()
		}
	}

	_recalculate() {
		const items = this.data
		for (const handler of this._changeHandlers) {
			handler(items)
		}
	}

	_onLoad() {
		this.trigger($.Event.DATASOURCE_DATA, { itemIds: this.itemIds })
		if (this.isPreloadable && !this._wasLoaded) {
			this._wasLoaded = true
			$._onDataSourceLoad()
			// console.log($._preloadCount, this.name)
		}
	}

	_connect(callback) {
		const _this = this
		DataBase.connect(this.constructor.name, db => {
			_this.db = db
			callback(db)
		})
	}

	_load(method=null, params=null, headers=null) {
		this._lastLoad = {
			method  : method,
			params  : params,
			headers : headers
		}
		const _this = this

		this.clear(() => {
			if (!method && this.isCacheable) {
				this._connect(db => {
					db.getCount(count => {
						if (count > 0) {
							_this.count = count
							_this._loadFromDb()
						} else {
							_this._loadFromUrl(method, params, headers)
						}
					})
				})
			} else {
				this._loadFromUrl(method, params, headers)
			}
		})
	}

	_loadFromUrl(method=null, params=null, headers=null) {
		method = method || 'GET'
		$.Request.request(
			this.url,
			method,
			params,
			headers,
			(items) => {
				this.isCacheable && this.db.clear()
				this.addItems(items)
				this._onLoad()
			}
		)
	}

	_loadFromDb() {
		const _this = this

		this.db.readItems(0, _this.count, (items) => {
			for (const item of items) {
				_this._addItemToStore(item)
				this.trigger($.Event.DATASOURCE_ITEM_ADD, { item: item })
			}
			this._onLoad()
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

	// onChange(condition, callback) {
	// 	this._changeHandlers.push($.when(
	// 		condition.bind(this),
	// 		callback.bind(this)
	// 	))
	// }

	select(path, data=null) {
		data = data || this.data
		return $.Object.select(data, path)
	}
	

	fill(items, reset=true) {
		$.defer(() => { // TODO: maybe we can remove this
			if (reset) {
				this.clear(() => {
					this.addItems(items)
					this._onLoad()
				})
			} else {
				this.addItems(items)
				this._onLoad()
			}
		})
	}

	load(method=null, params=null, headers=null) {
		$.defer(this._load, arguments, this)
	}

	reload() {
		if (this._lastLoad) {
			this._load(this._lastLoad.method, this._lastLoad.params, this._lastLoad.headers)
		}
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
		this.trigger($.Event.DATASOURCE_ITEM_ADD, { item: item })
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
