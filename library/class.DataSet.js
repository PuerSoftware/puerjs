import PuerObject from '../core/class.PuerObject.js'


export default class DataSet extends PuerObject {
	static $($) { window.$ = $ }
	
	/**************************************************************/

	static define(name, searchConfig=null, filter=null, adapter=null) { // TODO: Move searchConfig to setter?
		name = name || $.String.random(10)
		if (DataSet.hasOwnProperty(name)) {
			throw `DataSet already has property "${name}"`
		}
		const dataSet = new DataSet(name, searchConfig, filter, adapter)
		Object.defineProperty(DataSet, name, {
			get: function() {
				return dataSet
			}
		})
		return dataSet
	}

	/**************************************************************/

	constructor(name, searchConfig=null, filter=null, adapter=null) {
		super()
		
		this.name           = name
		this.owner          = null // set in DataOwnerMixin
		this._itemIds       = []
		this.searchConfig   = searchConfig
		this.isInitialized  = false
		this.index          = new Map()
		this._filterMap     = {}
		this._itemFilter    = filter    // To get a subset of datasource data
		this._itemAdapter   = adapter
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

	_applyItemFilter(ids) {
		if (this._itemFilter) {
			const items = $.DataStore.get(ids)
			ids = items.filter(this._itemFilter).map((item, _) => item.dataId)
		}
		return ids
	}

	/**************************************************************/
	// Responding on events

	_onData(e) {
		this.itemIds = e.detail.itemIds
		const items  = this.items
		this.onData(items)
		this.trigger($.Event.DATASET_DATA, {items: items})
	}

	_onItemAdd(e) {
		const item = e.detail.item
		const ids  = this._applyItemFilter([item.dataId])

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

	_onClear(e) {
		this.onClear()
	} 	

	/**************************************************************/

	get items() {
		const items = $.DataStore.get(this._itemIds)
		return this._itemAdapter
			? this._itemAdapter(items)
			: items
	}

	get itemIds() {
		return this._itemIds
	}

	trigger(name, data) {
		if (this.owner.isActive) {
			super.trigger(name, data)
		}
	}

	set itemIds(ids) {
		// TODO: _reindexItems?
		this._itemIds      = this._applyItemFilter(ids)
		// console.log('itemIds2', this._itemIds)
		this.isInitialized = true

		this._lastFilter && this.filter(this._lastFilter)
		this._lastSort   && this.sort(this._lastSort)
	}

	set dataSource(dataSource) {
		this.on('DATASOURCE_DATA',        this._onData.       bind(this), dataSource.name)
		this.on('DATASOURCE_ITEM_ADD',    this._onItemAdd.    bind(this), dataSource.name)
		this.on('DATASOURCE_ITEM_CHANGE', this._onItemChange. bind(this), dataSource.name)
		this.on('DATASOURCE_ITEM_REMOVE', this._onItemRemove. bind(this), dataSource.name)
		this.on('DATASOURCE_CLEAR',       this._onClear.      bind(this), dataSource.name)
	}

	reduce(f) {
		return this.items.reduce(f, 0)
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
			this._filterMap  = map 
			this.trigger($.Event.DATASET_FILTER, {map: map})
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

			this.trigger($.Event.DATASET_SORT, {map: map})
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

		this.filter(item => {
			return result.has(item.dataId)// && !this._excluded.has(item.dataId))
		})
	}

	refresh() {
		const items = this.items
		for (const item of items) {
			this.onItemAdd(item)	
		}

		this.onData(items)
		this.trigger($.Event.DATASET_DATA, {items: items})

		this._lastFilter && this.filter(this._lastFilter)
		this._lastSort   && this.sort(this._lastSort)
	}


	exclude(id) { this._excluded.add(id)    }
	include(id) { this._excluded.delete(id) }

	onData       (items)  {}
	onItemAdd    (item)   {}
	onItemChange (item)   {}
	onItemRemove (itemId) {}
	onClear      ()       {}

	onSort       (map)    {} // TODO: Make event?
	onFilter     (map)    {} // TODO: Make event?
}
