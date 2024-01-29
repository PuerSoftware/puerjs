import PuerObject from '../core/class.PuerObject.js'


export default class DataSet extends PuerObject {
	static $($) { window.$ = $ }
	
	/**************************************************************/

	static define(name, searchConfig=null, filter=null) { // TODO: Move searchConfig to setter?
		name = name || $.String.random(10)
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
		super()
		
		this.name           = name
		this.listeners      = {}
		this._itemIds       = []
		this.searchConfig   = searchConfig
		this.isInitialized  = false
		this.index          = new Map()
		this._initialFilter = filter    // To get a subset of datasource data
		this._excluded      = new Set() // To exclude items dynamically
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

	_applyInitialFilter(ids) {
		if (this._initialFilter) {
			const items = $.DataStore.get(ids)
			ids = items.filter(this._initialFilter).map((_, id) => id)
		}
		return ids
	}

	/**************************************************************/

	_onData(e) {
		this.itemIds = e.detail.itemIds
		this.onData(this.items)
	}

	_onItemAdd(e) {
		const item = e.detail.item
		const ids  = this._applyInitialFilter([item.dataId])

		if (ids.length) {
			this._indexItem(item, item.dataId)
			this.onItemAdd(item)
		}
	}

	_onItemChange(e) {
		this._reindexItems()
		this.onItemChange(e.detail.item)
	}

	_onItemRemove (e) {
		this.onItemRemove(e.detail.itemId)
	}

	/**************************************************************/

	get items() {
		return $.DataStore.get(this._itemIds)
	}

	get itemIds() {
		return this._itemIds
	}

	set itemIds(ids) {
		// TODO: _reindexItems?
		this._itemIds      = this._applyInitialFilter(ids)
		this.isInitialized = true

		this._lastFilter && this.filter(this._lastFilter)
		this._lastSort   && this.sort(this._lastSort)
	}

	set dataSource(dataSource) {
		this.on('DATASOURCE_DATA',        this._onData.       bind(this), dataSource.name)
		this.on('DATASOURCE_ITEM_ADD',    this._onItemAdd.    bind(this), dataSource.name)
		this.on('DATASOURCE_ITEM_CHANGE', this._onItemChange. bind(this), dataSource.name)
		this.on('DATASOURCE_ITEM_REMOVE', this._onItemRemove. bind(this), dataSource.name)
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

	onData       (items)  {}
	onItemAdd    (item)   {}
	onItemChange (item)   {}
	onItemRemove (itemId) {}

	onSort       (map)    {} // TODO: Make event?
	onFilter     (map)    {} // TODO: Make event?
}
