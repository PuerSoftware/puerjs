export default class DataSet {
	
	/**************************************************************/

	static define(name, searchConfig=null) {
		if (DataSet.hasOwnProperty(name)) {
			throw `DataSet already has property "${name}"`
		}
		const dataSet = new DataSet(name, searchConfig)
		Object.defineProperty(DataSet, name, {
			get: function() {
				return dataSet
			}
		})
		return dataSet
	}

	static PUER = null // set in puer

	/**************************************************************/

	constructor(name, searchConfig=null) {
		this.name          = name
		this.itemIds       = []
		this.searchConfig  = searchConfig
		this.isInitialized = false
	}

	init(ids) {
		console.log('init dataset', this.name, ids)
		this.itemIds = ids

		this._lastFilter && this.filter(this._lastFilter)
		this._lastSort   && this.sort(this._lastSort)
		this.onInit()
	}

	get items() {
		return DataSet.PUER.DataStore.get(this.itemIds)
	}

	filter(f) {
		if (this.isInitialized) {
			const items = this.items
			const map   = {}

			items.forEach((item, index) => {
				map[index] = f(item)
			})

			this._lastFilter = f
			this.onFilter(map)
		}
	}

	sort(f) {
		if (this.isInitialized) {
			const items   = this.items
			const map     = {}
			const indices = items.map((_, index) => index)

			indices.sort((a, b) => f(items[a], items[b]))
			indices.forEach((sortedIndex, originalIndex) => {
				map[sortedIndex] = originalIndex
			})

			this._lastSort = f
			this.onSort(map)
		}
	}

	onInit       ()       {}
	onAddItem    (item)   {}
	onRemoveItem (itemId) {}
	onSort       (map)    {}
	onFilter     (map)    {}

}