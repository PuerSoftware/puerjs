import PuerObject from '../core/class.PuerObject.js'

import DataBase   from './class.DataBase.js'
import DataSet    from './class.DataSet.js'


export default class DataSource extends PuerObject {
	static $($) { window.$ = $ }
	
	/**************************************************************/

	static define(name, cls, url, isSingular=false, isCacheable=false) {
		cls = cls || DataSource
		if (DataSource.hasOwnProperty(name)) {
			throw `DataSource class already has property "${name}"`
		}

		const dataSource = new cls(name, url, isSingular, isCacheable)
		Object.defineProperty(DataSource, name, {
			get: function() {
				return dataSource
			}
		})
		return dataSource
	}

	/**************************************************************/

	constructor(name, url, isSingular, isCacheable) {
		super()

		this.name          = name
		this.itemIds       = []
		this.url           = url
		this.count         = null
		this.db            = null
		this.dataSets      = {}
		this.listeners     = {}
		this.isSingular    = isSingular
		this.isCacheable   = isCacheable

		this._lastLoad = null

	}

	_onLoad() {
		this.trigger($.Event.DATASOURCE_DATA, { itemIds: this.itemIds })
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
				// for (const dataSetName in _this.dataSets) {
				// 	_this.dataSets[dataSetName].addItem(item)
				// }
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

	/******************************************************************

	on(name, f, options) {
		this.listeners[name] = (...args) => {
			f.bind(this)(...args)
		}
		$.Events.on(name, this.listeners[name], options)
	}

	once(name, f, options) {
		$.Events.once(name, f.bind(this), options)
	}

	off(name) {
		this.listeners[name] && $.Events.off(name, this.listeners[name])
	}

	trigger(name, data) {
		data.target          = this
		data.targetName               = this.name
		data.target.isActive = true
		$.Events.trigger(name, data)
	}

	/******************************************************************/

	get data() {
		return $.DataStore.get(this.itemIds)
	}

	fill(items) {
		$.defer(() => { // TODO: maybe we can remove this 
			this.addItems(items)
			this._onLoad()
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

		this.itemIds       = []
		this.listeners     = {}

		if (this.isCacheable && this.db) {
			this.db.clear(() => {
				callback()
			})
		} else {
			callback()
		}
	}

	addItem(item) {
		item = this.adaptItem(item)

		this.isCacheable && this._addItemToDb(item)
		this._addItemToStore(item)
		this.trigger($.Event.DATASOURCE_ITEM_ADD, { item: item })
	}

	addItems(items, headers) {
		items = this.adaptItems(items, headers)
		if (this.isSingular) {
			this.addItem(items)
		} else {
			for (const item of items) {
				this.addItem(item)
			}
		}
	}

	changeItem(item) {
		if (!item.dataId) {
			throw `Changed item must have dataId`
		}

		this.isCacheable && this._changeItemInDb(item)
		this._changeItemInStore(item)
		this.trigger($.Event.DATASOURCE_ITEM_CHANGE, { item: item })
	}

	removeItem(item) {
		this.trigger($.Event.DATASOURCE_ITEM_REMOVE, { itemId: item.dataId })
		// for (const dataSetName in this.dataSets) {
		// 	this.dataSets[dataSetName].removeItem(item.dataId)
		// }
	}

	/******************************************************************/

	adaptItems (items, headers) { return items }
	adaptItem  (item)           { return item  }
}
