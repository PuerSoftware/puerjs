import DataBase from './class.DataBase.js'
import DataSet  from './class.DataSet.js'

export default class DataSource {
	static define(cls, url, onLoad) {
		if (DataSource.hasOwnProperty(cls.name)) {
			throw `DataSource class already has property "${cls.name}"`
		}

		const dataSource = new cls(url, onLoad)
		Object.defineProperty(DataSource, cls.name, {
			get: function() {
				return dataSource
			}
		})
		return dataSource
	}

	static PUER = null // set in puer

	constructor(url, onLoad) {
		this.dataId   = null
		this.url      = url
		this.count    = null
		this.db       = null
		this.dataSets = {}
		this.load(() => {
			this._initDataSets()
			onLoad && onLoad()
		})
	}

	_connect(callback) {
		const _this = this
		DataBase.connect(this.constructor.name, db => {
			_this.db = db
			callback(db)
		})
	}

	_loadFromUrl(onLoad) {}

	_loadFromDb(onLoad) {
		const _this = this
		this.db.readItems(0, _this.count, (items) => {
			for (const item of items) {
				_this._addItemToStore(item)
			}
			onLoad()
		})
	}

	_addItemToDb    (item) {}
	_addItemToStore (item) {}

	_initDataSets() {
		for (const dataSetName in this.dataSets) {
			this.dataSets[dataSetName] = DataSet.define(dataSetName, this.dataId)
		}
	}

	/******************************************************************/

	addItem(item) {
		item = this.adaptItem(item)
		this._addItemToDb(item)
		this._addItemToStore(item)
	}

	addItems(items) {
		items = this.adaptItems(items)
		for (const item of items) {
			this.addItem(item)
		}
	}

	removeItem(item) {}

	adaptItems (items) { return items }
	adaptItem  (item)  { return item  }

	load(onLoad, invalidate=false) {
		const _this = this

		this._connect(db => {
			db.getCount(count => {
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
		this.dataSets[name] = null
		return this
	}
}
