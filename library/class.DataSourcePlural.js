import DataSource from './class.DataSource.js'


export default class DataSourcePlural extends DataSource {
	static define(name, url, onLoad) {
		if (DataSource.hasOwnProperty(name)) {
			throw `DataSource class already has property "${name}"`
		}
		const dataSource = new DataSourcePlural(name, url, onLoad)
		Object.defineProperty(DataSource, name, {
			get: function() {
				return dataSource
			}
		})
		return dataSource
	}

	constructor(name, url, onLoad) {
		super(name, url, onLoad)
		this.itemIds    = []
		this.itemListId = null
	}

	_addItemToDb(item) {
		this.db.addItem(item)
	}

	_addItemToStore(item) {
		const itemId = DataSource.PUER.DataStore.set(null, item)
		item.dataId = itemId

		this.itemIds = []
		this.itemIds.push(itemId)
		this.itemListId = DataSource.PUER.DataStore.set(this.itemListId, this.itemIds)
	}

	/******************************************************************/

	spawnDataSet(name) {
		return new DataSet(name, this.itemListId)
	}

}
