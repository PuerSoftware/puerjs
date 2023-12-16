import DataSource from './class.DataSource.js'


export default class DataSourceSingular extends DataSource {
	constructor(url, onLoad) {
		super(url, onLoad)
	}

	_loadFromUrl(onLoad) {
		DataSource.PUER.Request.get(this.url, (item) => {
			this.addItem(item)
			onLoad()
		})
	}

	_addItemToDb(item) {
		this.db.addItem(item)
	}

	_addItemToStore(item) {
		this.dataId = DataSource.PUER.DataStore.set(null, item)
		item.dataId = this.dataId
	}
}
