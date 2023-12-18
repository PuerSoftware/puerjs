import DataBase from './class.DataBase.js'
import DataSet  from './class.DataSet.js'

export default class DataSource {
	
	/**************************************************************/

	static define(cls, url, isSingular=false, onLoad) {
		if (DataSource.hasOwnProperty(cls.name)) {
			throw `DataSource class already has property "${cls.name}"`
		}

		const dataSource = new cls(url, isSingular, onLoad)
		// console.log('define DataSource', cls.name)
		Object.defineProperty(DataSource, cls.name, {
			get: function() {
				return dataSource
			}
		})
		return dataSource
	}

	static PUER = null // set in puer

	/**************************************************************/

	constructor(url, isSingular, onLoad) {
		this.itemIds    = []
		this.url        = url
		this.count      = null
		this.db         = null
		this.dataSets   = {}
		this.isSingular = isSingular
		this.isLoaded   = false

		this.load((itemIds) => {
			// console.log('loading')
			this._initDataSets()
			this.isLoaded = true
			onLoad && onLoad()
		})
	}

	_initDataSets() {
		for (const dataSetName in this.dataSets) {
			this.dataSets[dataSetName].init(this.itemIds)
		}
	}

	_connect(callback) {
		const _this = this
		DataBase.connect(this.constructor.name, db => {
			_this.db = db
			callback(db)
		})
	}

	_loadFromUrl(onLoad) {
		console.log('loading from URL')
		DataSource.PUER.Request.get(this.url, (items) => {
			this.db.clear()
			this.addItems(items)
			onLoad()
		})
	}

	_loadFromDb(onLoad) {
		console.log('loading from DB')
		const _this = this

		this.db.readItems(0, _this.count, (items) => {
			// console.log('items from db', items)
			for (const item of items) {
				_this._addItemToStore(item)
				for (const dataSetName in _this.dataSets) {
					_this.dataSets[dataSetName].addItem(item)
				}
			}
			onLoad()
		})
	}

	_addItemToDb(item) {
		this.db.addItem(item)
	}
	
	_addItemToStore(item) {
		const itemId = DataSource.PUER.DataStore.set(null, item)
		item.dataId = itemId
		this.itemIds.push(itemId)
	}

	/******************************************************************/

	addItem(item) {
		item = this.adaptItem(item)

		this._addItemToDb(item)
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

	load(onLoad, invalidate=false) {
		const _this = this

		this._connect(db => {
			db.getCount(count => {
				// console.log('count', count)
				if (count > 0) {
					_this.count = count
					_this._loadFromDb(onLoad)
				} else {
					_this._loadFromUrl(onLoad)
				}
			})
		})
	}

	defineDataSet(name) {
		const ds = DataSet.define(name)
		// console.log('define DataSet', name)
		if (this.isLoaded) {
			ds.init(this.itemIds)
		}
		this.dataSets[name] = ds
		return ds
	}
}
