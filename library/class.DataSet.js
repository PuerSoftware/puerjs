export default class DataSet {
	
	/**************************************************************/

	static define(name, searchConfig=null, filter=null) {
		if (DataSet.hasOwnProperty(name)) {
			throw `DataSet already has property "${name}"`
		}
		const dataSet = new DataSet(name, searchConfig, filter)
		Object.defineProperty(DataSet, name, {
			get: function() {
				return dataSet
			}
		})
		return dataSet
	}

	static PUER = null // set in puer

	/**************************************************************/

	constructor(name, searchConfig=null,  filter=null) {
		this.name          = name
		this.itemIds       = []
		this.searchConfig  = searchConfig
		this.isInitialized = false
		this.index         = new Map()
		this._entryFilter  = filter
	}

	/**************************************************************/

	_indexItem(item, id, prefix='') {
		for (let key in item) {
			if (item.hasOwnProperty(key)) {
				let value = item[key]
				if (value && typeof value === 'object') {
					this._indexItem(value, id, prefix + key + '.')
				} else if (!this.searchConfig || this.searchConfig[prefix + key]) {
					if (value) {
						const valueString = value.toString().toLowerCase()
						if (!this.index.has(valueString)) {
							this.index.set(valueString, new Set())
						}
						this.index.get(valueString).add(id)
					}
				}
			}
		}
	}

	_applyEntryFilter(ids) {
		if (this._entryFilter) {
			const items = DataSet.PUER.DataStore.get(ids)
			ids = items.filter(this._entryFilter).map((_, id) => id)
		}
		return ids
	}

	/**************************************************************/

	get items() {
		return DataSet.PUER.DataStore.get(this.itemIds)
	}

	init(ids) {
		this.itemIds       = this._applyEntryFilter(ids)
		this.isInitialized = true

		this._lastFilter && this.filter(this._lastFilter)
		this._lastSort   && this.sort(this._lastSort)

		this.onInit()
	}

	filter(f) {
		if (this.isInitialized) {
			const items = this.items
			const map   = {}

			items.forEach((item, index) => {
				map[item.dataId] = f(item)
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

	search(query) {
		const words  = query.toLowerCase().trim().split(/\s+/g)
		const result = new Set()

		words.forEach((word) => {
			this.index.forEach((indexes, valueString) => {
				if (valueString.includes(word)) {
					indexes.forEach(id => result.add(id))
				}
			})
		})

		return this.filter(item => result.has(item.dataId))
	}

	data() {
		this.onData(this.items)
	}

	addItem(item) {
		const ids = this._applyEntryFilter([item.dataId])
		if (ids.length) {
			this._indexItem(item, item.dataId)
			this.onAddItem(item)
		}
	}
	removeItem (itemId) {
		this.onRemoveItem(itemId)
	}

	onInit       ()       {}
	onData       (data)   {}
	onAddItem    (item)   {}
	onRemoveItem (itemId) {}
	onSort       (map)    {}
	onFilter     (map)    {}

}
