import DataBase from './class.DataBase.js'


export default class DataSource {
	static DB_NAME = 'DataSource'
	static PUER    = null // set in puer
	
	static define(name, url, adapter, onLoad) {
		const dataSource = new DataSource(name, url, adapter, onLoad)
		Object.defineProperty(DataSource, name, {
			get: function() {
				return dataSource
			}
		})
		return dataSource
	}
	
	constructor(name, url, adapter, onLoad) {
		this.name    = name
		this.id      = null
		this.url     = url

		this.db      = null
		this.adapter = adapter
		this.load(onLoad)
	}

	_adapt(data) {
		data = this.adapter.adapt(data)
		this._storeItems(data)
		this.db.addItems(data)
	}

	_storeItems(items) {
		this.id = DataSource.PUER.DataStore.set(null, items)
	}

	_loadFromUrl(onLoad) {
		DataSource.PUER.Request.get(this.url, (data) => {
			this._adapt(data)
			onLoad && onLoad()
		})
	}

	load(onLoad, invalidate=false) {
		const _this = this

		this.connect(db => {
			db.getCount(count => {
				if (count > 0) {
					db.readItems(0, 1000, (items) => {
						_this._storeItems(items)
						onLoad && onLoad()
					})
				} else {
					_this._loadFromUrl(onLoad)
				}
			})
		})
	}

	connect(callback) {
		const _this = this
		DataBase.connect(this.name, db => {
			_this.db = db
			callback(db)
		})
	}
}
