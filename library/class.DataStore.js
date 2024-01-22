export default class DataStore {
	static values         = {} // { dataId: value }
	static references     = {} // { dataId: { accessorString: Reference }
	static owners         = {} // { dataId: { ownerId: owner } }
	static _id            = 0

	static $($) { window.$ = $ }

	static _nextId() {
		return DataStore._id ++
	}

	static get size() {
		return Math.round(JSON.stringify(DataStore.values).length / 1024) + ' kb'
	}

	static get(dataId) {
		if ($.isArray(dataId)) {
			const items = []
			for (const _id of dataId) {
				items.push(DataStore.get(_id))
			}
			return items
		} else {
			if ($.isReferencing) {
				return DataStore.rootReferences[dataId] || null
			}
			return DataStore.values[dataId]
		}
	}

	// static get(dataId) {
	// 	if ($.isArray(dataId)) {
	// 		const items = []
	// 		for (const _id of dataId) {
	// 			items.push(DataStore.get(_id))
	// 		}
	// 		return items
	// 	} else {
	// 		if ($.isReferencing) {
	// 			return DataStore.references[dataId] || null
	// 		}
	// 		return DataStore.values[dataId]
	// 	}
	// }

	// static set(dataId, value, isChanged=false) {
	// 	if (value && value.isReference) {
	// 		return value.dataId
	// 	}
	// 	isChanged = isChanged || !dataId || (DataStore.values[dataId] !== value)
	// 	dataId = dataId || DataStore._nextId()
	// 	DataStore.values[dataId]     = value
	// 	DataStore.references[dataId] = $.reference(dataId)
	// 	if (isChanged) {
	// 		DataStore.updateOwners(dataId)
	// 	}
	// 	return dataId
	// }

	static set(dataId, value, isChanged=false) {
		if (value && value.isReference) {
			throw 'Reference to reference error'
		}

		isChanged = isChanged || !dataId || (DataStore.values[dataId] !== value)
		dataId = dataId || DataStore._nextId()

		DataStore.values[dataId] = value
		if (!DataStore.references[dataId]) {
			DataStore.references[dataId] = {}
		}
		DataStore.references[dataId][''] = new $.Reference(dataId)

		if (isChanged) {
			DataStore.updateOwners(dataId)
		}
		return dataId
	}

	static unset(dataId) {
 		delete DataStore.values[dataId]
		delete DataStore.references[dataId]
		delete DataStore.owners[dataId]
	}

	static has(dataId) {
		return DataStore.values.hasOwnProperty(dataId)
	}

	static updateOwners(dataId) {
		if (DataStore.owners.hasOwnProperty(dataId)) {
			for (const ownerId in DataStore.owners[dataId]) {
				DataStore.owners[dataId][ownerId].update()
			}
		}
	}

	static addOwner(dataId, prop, owner, updateMethod) {
		if (!DataStore.owners.hasOwnProperty(dataId)) {
			DataStore.owners[dataId] = {}
		}
		const referenceOwner = new $.ReferenceOwner(owner, prop, updateMethod)
		DataStore.owners[dataId][owner.id] = referenceOwner
		referenceOwner.update()
	}

	static mergeOwners(dataId, referenceOwners) {
		for (const ownerId in referenceOwners) {
			const owner = referenceOwners[ownerId]
			DataStore.addOwner(dataId, owner.prop, owner.owner, owner.updateMethod)
		}
	}

	static cloneOwners(dataId) {
		return Object.assign({}, $.DataStore.owners[dataId])
	}
}