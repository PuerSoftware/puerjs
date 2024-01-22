export default class DataSet {
	static $($) { window.$ = $ }
	
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

	/**************************************************************/

	constructor(name, searchConfig=null, filter=null) {
		this.name          = name
		this.itemIds       = []
		this.searchConfig  = searchConfig
		this.isInitialized = false
		this.index         = new Map()
		this._entryFilter  = filter    // To get a subset of datasource data
		this._excluded     = new Set() // To exclude items dynamically
	}

	/**************************************************************/

	_indexItem(item, dataId, prefix='') {
		for (let key in item) {
			if (item.hasOwnProperty(key)) {
				let value = item[key]
				if (value && typeof value === 'object') {
					this._indexItem(value, dataId, prefix + key + '.')
				} else if (!this.searchConfig || this.searchConfig[prefix + key]) {
					if (value) {
						const valueString = value.toString().toLowerCase()
						if (!this.index.has(valueString)) {
							this.index.set(valueString, new Set())
						}
						this.index.get(valueString).add(dataId)
					}
				}
			}
		}
	}

	_reindexItems() {
		 this.index = new Map()

		for (const item of this.items) {
			this._indexItem(item, item.dataId)
		}
	}

	_applyEntryFilter(ids) {
		if (this._entryFilter) {
			const items = $.DataStore.get(ids)
			ids = items.filter(this._entryFilter).map((_, id) => id)
		}
		return ids
	}

	/**************************************************************/

	get items() {
		return $.DataStore.get(this.itemIds)
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
				if (this._excluded.has(item.dataId)) {
					map[item.dataId] = false
				} else {
					map[item.dataId] = f(item)
				}
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

		return this.filter(item => result.has(item.dataId) && !this._excluded.has(item.dataId))
	}

	exclude(id) {
		this._excluded.add(id)
	}

	include(id) {
		this._excluded.delete(id)
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

	changeItem(item) {
		this._reindexItems()
		this.onChangeItem(item)
	}

	removeItem (dataId) {
		this.onRemoveItem(dataId)
	}

	onInit       ()       {}
	onData       (data)   {}
	onAddItem    (item)   {}
	onChangeItem (item)   {}
	onRemoveItem (dataId) {}
	onSort       (map)    {}
	onFilter     (map)    {}

}
