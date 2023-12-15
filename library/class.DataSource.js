import DataBase from './class.DataBase.js'


export default class DataSource {
	static PUER = null // set in puer

	constructor(name, url, onLoad) {
		this.name    = name
		this.url     = url
		this.count   = null
		this.db      = null
	}

	_connect(callback) {
		const _this = this
		DataBase.connect(this.name, db => {
			_this.db = db
			callback(db)
		})
	}

	_loadFromUrl(onLoad) {
		DataSource.PUER.Request.get(this.url, (items) => {
			if (DataSource.PUER.isArray(items)) {
				this.addItems(items)
			} else {
				this.addItem(items)
			}
			onLoad && onLoad()
		})
	}

	_loadFromDb(onLoad) {
		const _this = this
		this.db.readItems(0, _this.count, (items) => {
			for (const item of items) {
				_this._addItemToStore(item)
			}
			onLoad && onLoad()
		})
	}

	_addItemToDb(item)    {}
	_addItemToStore(item) {}

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
	spawnDataSet ()    { return null }

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
}
