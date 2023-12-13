export default class DataSet {

	static PUER = null // set in puer

	static define(name, dataId) {
		const dataSet = new DataSet(name, dataId)
		Object.defineProperty(DataSet, name, {
			get: function() {
				return dataSet
			}
		})
		return dataSet
	}

	constructor(name, dataId) {
		this.name      = name
		this.id        = dataId
		this.displayId = null
		this.orderId   = null

		this.onFilterListeners = []
		this.onSortListeners   = []
	}

	_updateListeners(data, isOrder) {
		const listeners = isOrder
			? this.onSortListeners
			: this.onFilterListeners

		for (const listener of listeners) {
			listener(data)
		}
	}

	filter(f) {
		const items = DataSet.PUER.DataStore.get(this.id)
		const map   = {}

		this.displayId && DataSet.PUER.DataStore.unset(this.displayId)

		items.forEach((item, index) => {
			map[index] = f(item)
		})
		this.displayId = DataSet.PUER.DataStore.set(null, map)
		this._updateListeners(map, false)
		return map
	}

	sort(f)   {
		const items   = DataSet.PUER.DataStore.get(this.id)
		const map     = {}
		const indices = items.map((_, index) => index)

		this.orderId && DataSet.PUER.DataStore.unset(this.orderId)

		// Sort the indices array based on the custom comparison of values in the original array
		indices.sort((a, b) => f(items[a], items[b]))


		indices.forEach((sortedIndex, originalIndex) => {
			map[sortedIndex] = originalIndex
		})
		this.orderId = DataSet.PUER.DataStore.set(null, map)
		this._updateListeners(map, true)
		return map
	}

	get items() {
		if (DataSet.PUER.isReferencing) {
			return DataSet.PUER.reference(this.id)
		}
		return DataSet.PUER.DataStore.get(this.id)
	}
	get itemDisplayMap() {
		if (DataSet.PUER.isReferencing) {

		}
	}
	get itemOrderMap() {
		if (DataSet.PUER.isReferencing) {

		}
	}

	set onFilter(f) {
		this.onFilterListeners.push(f)
	}

	set onSort(f) {
		this.onSortListeners.push(f)
	}

}