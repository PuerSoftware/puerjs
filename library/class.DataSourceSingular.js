import DataSource from './class.DataSource.js'


export default class DataSourceSingular extends DataSource {
	static define(name, url, onLoad) {
		if (DataSource.hasOwnProperty(name)) {
			throw `DataSource class already has property "${name}"`
		}
		const dataSource = new DataSourceSingular(name, url, onLoad)
		Object.defineProperty(DataSource, name, {
			get: function() {
				return dataSource
			}
		})
		return dataSource
	}

	constructor(name, url, onLoad) {
		super(name, url, onLoad)
		this.itemId = null
	}

	_addItemToDb(item) {
		this.db.addItem(item)
	}

	_addItemToStore(item) {
		this.itemId = DataSource.PUER.DataStore.set(null, item)
	}
}
