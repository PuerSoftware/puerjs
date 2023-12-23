import DataBase from './class.DataBase.js'
import DataSet  from './class.DataSet.js'

export default class DataSource {
	
	/**************************************************************/

	static define(cls, url, isSingular=false, isCacheable=true) {
		if (DataSource.hasOwnProperty(cls.name)) {
			throw `DataSource class already has property "${cls.name}"`
		}

		const dataSource = new cls(url, isSingular, isCacheable)
		Object.defineProperty(DataSource, cls.name, {
			get: function() {
				return dataSource
			}
		})
		return dataSource
	}

	static PUER = null // set in puer

	/**************************************************************/

	constructor(url, isSingular, isCacheable) {
		this.itemIds       = []
		this.url           = url
		this.count         = null
		this.db            = null
		this.dataSets      = {}
		this.listeners     = {}
		this.isSingular    = isSingular
		this.isCacheable   = isCacheable
		this.isInitialized = false
	}

	_onLoad() {
		this._initDataSets()
		this.isInitialized = true
		for (const dataSetName in this.dataSets) {
			this.dataSets[dataSetName].data()
		}
	}

	_initDataSets() {
		if (!this.isInitialized) {
			for (const dataSetName in this.dataSets) {
				this.dataSets[dataSetName].init(this.itemIds)
			}
		}
	}

	_connect(callback) {
		const _this = this
		DataBase.connect(this.constructor.name, db => {
			_this.db = db
			callback(db)
		})
	}

	_loadFromUrl(method='GET', params=null) {
		console.log('loading from URL', this.url, method)
		DataSource.PUER.Request.request(
			this.url,
			method,
			params,
			null,
			(items) => {
				this.isCacheable && this.db.clear()
				this.addItems(items)
				this._onLoad()
			}
		)
	}

	_loadFromDb() {
		console.log('loading from DB')
		const _this = this

		this.db.readItems(0, _this.count, (items) => {
			for (const item of items) {
				_this._addItemToStore(item)
				for (const dataSetName in _this.dataSets) {
					_this.dataSets[dataSetName].addItem(item)
				}
			}
			this._onLoad()
		})
	}

	_addItemToDb(item) {
		this.isCacheable && this.db.addItem(item)
	}
	
	_addItemToStore(item) {
		const itemId = DataSource.PUER.DataStore.set(null, item)
		item.dataId = itemId
		this.itemIds.push(itemId)
	}

	/******************************************************************/

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
		data.targetComponent = this
		$.Events.trigger(name, data)
	}

	/******************************************************************/

	addItem(item) {
		item = this.adaptItem(item)

		this.isCacheable && this._addItemToDb(item)
		this._addItemToStore(item)

		for (const dataSetName in this.dataSets) {
			this.dataSets[dataSetName].addItem(item)
		}
	}

	addItems(items) {
		items = this.adaptItems(items)

		if (this.isSingular) {
			this.addItem(items)
		} else {
			for (const item of items) {
				this.addItem(item)
			}
		}
	}

	removeItem(item) {
		for (const dataSetName in this.dataSets) {
			this.dataSets[dataSetName].removeItem(item.dataId)
		}
	}

	/******************************************************************/

	adaptItems (items) { return items }
	adaptItem  (item)  { return item  }

	load(method=null, params=null) {
		const _this = this

		if (!method && this.isCacheable) {
			this._connect(db => {
				db.getCount(count => {
					if (count > 0) {
						_this.count = count
						_this._loadFromDb()
					} else {
						_this._loadFromUrl(method, params)
					}
				})
			})
		} else {
			this._loadFromUrl(method, params)
		}
	}

	defineDataSet(name) {
		const ds = DataSet.define(name)
		if (this.isInitialized) {
			ds.init(this.itemIds)
		}
		this.dataSets[name] = ds
		return ds
	}
}
