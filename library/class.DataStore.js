

export default class DataStore {
	static values = {}
	static _id    = 0

	static _nextId() {
		return DataStore._id ++
	}

	static get(id) {
		return DataStore.values[id] || null
	}

	static set(id, value) {
		id = id || DataStore._nextId()
		DataStore.values[id] = value
		return id
	}
}