import DataSource from './class.DataSource.js'


export default class DataSourcePlural extends DataSource {
	constructor(url, onLoad) {
		super(url, onLoad)
		this.itemIds = []
	}

	_loadFromUrl(onLoad) {
		DataSource.PUER.Request.get(this.url, (items) => {
			this.addItems(items)
			onLoad()
		})
	}

	_addItemToDb(item) {
		this.db.addItem(item)
	}

	_addItemToStore(item) {
		const itemId = DataSource.PUER.DataStore.set(null, item)
		item.dataId = itemId

		// this.itemIds = [] // TODO
		this.itemIds.push(itemId)
		this.dataId = DataSource.PUER.DataStore.set(this.dataId, this.itemIds)
	}

	/******************************************************************/

}
