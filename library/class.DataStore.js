import ReferenceOwner from './class.ReferenceOwner.js'


export default class DataStore {
	static PUER       = null // set in puer
	static values     = {}
	static references = {}
	static owners     = {}
	static _id        = 0

	static _nextId() {
		return DataStore._id ++
	}

	static get size() {
		return Math.round(JSON.stringify(DataStore.values).length / 1024) + ' kb'
	}

	static get(dataId) {
		if (DataStore.PUER.isArray(dataId)) {
			const items = []
			for (const _id of dataId) {
				items.push(DataStore.get(_id))
			}
			return items
		} else {
			if (DataStore.PUER.isReferencing) {
				return DataStore.references[dataId] || null
			}
			return DataStore.values[dataId]
		}
	}

	static set(dataId, value, isChanged=false) {
		if (value && value.isReference) {
			return value.dataId
		}
		isChanged = isChanged || !dataId || (DataStore.values[dataId] !== value)
		dataId = dataId || DataStore._nextId()
		DataStore.values[dataId]     = value
		DataStore.references[dataId] = DataStore.PUER.reference(dataId)
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
			for (const owner of DataStore.owners[dataId]) {
				owner.update()
			}
		}
	}

	static addOwner(dataId, prop, owner, updateMethod) {
		if (!DataStore.owners.hasOwnProperty(dataId)) {
			DataStore.owners[dataId] = []
		}
		const referenceOwner = new ReferenceOwner(owner, prop, updateMethod)
		DataStore.owners[dataId].push(referenceOwner)
		referenceOwner.update()
	}
}