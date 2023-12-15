export default class DataSet {

	static PUER = null // set in puer

	static define(name, itemIds) {
		if (DataSet.hasOwnProperty(name)) {
			throw `DataSet already has property "${name}"`
		}
		const dataSet = new DataSet(name, itemIds)
		Object.defineProperty(DataSet, name, {
			get: function() {
				return dataSet
			}
		})
		return dataSet
	}

	constructor(name, itemListId) {
		this.name        = name
		this.itemListId  = itemListId
		this.itemIds     = this._getIds()
		this.filterMapId = null
		this.sortMapId   = null

		this._lastFilter = null
		this._lastSort   = null

		DataSet.PUER.DataStore.addOwner(itemListId, 'itemListId', this, '_onItemsChange')
	}

	_getIds() {
		return DataSet.PUER.DataStore.get(this.itemListId)
	}

	_onItemsChange(prop) {
		const ids = this._getIds()
		if (ids.length > this.itemIds.length) {
			this._lastFilter && this.filter(this._lastFilter)
			this._lastSort   && this.sort(this._lastSort)
		}
	}

	filter(f) {
		const items = DataSet.PUER.DataStore.get(this.itemIds)
		const map   = {}

		this._lastFilter = f
		this.filterMapId && DataSet.PUER.DataStore.unset(this.filterMapId)

		items.forEach((item, index) => {
			map[index] = f(item)
		})
		this.filterMapId = DataSet.PUER.DataStore.set(null, map)
		return map
	}

	sort(f)   {
		const items   = DataSet.PUER.DataStore.get(this.itemIds)
		const map     = {}
		const indices = items.map((_, index) => index)

		this._lastSort = f
		this.sortMapId && DataSet.PUER.DataStore.unset(this.sortMapId)
		// Sort the indices array based on the custom comparison of values in the original array
		indices.sort((a, b) => f(items[a], items[b]))
		indices.forEach((sortedIndex, originalIndex) => {
			map[sortedIndex] = originalIndex
		})
		this.sortMapId = DataSet.PUER.DataStore.set(null, map)
		return map
	}

	get items() {
		if (DataSet.PUER.isReferencing) {
			return DataSet.PUER.reference(this.itemIds)
		}
		return DataSet.PUER.DataStore.get(this.itemIds)
	}

	get itemDisplayMap() {
		if (DataSet.PUER.isReferencing) {

		}
	}

	get itemOrderMap() {
		if (DataSet.PUER.isReferencing) {

		}
	}
}