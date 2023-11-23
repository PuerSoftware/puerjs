import Request from './class.Request.js'


class DataSet {
	constructor() {
		this.data = {}
		this.cacheName = 'dataSetCache'
	}

	async _setData(data, callback) {
		if (Array.isArray(data)) {
			this.data = data
		} else if (data !== null && typeof data === 'object') {
			this.data = [data]
		} else {
			throw new Error('DataSet: incompatible data type')
		}
		if (callback) callback(this.data)
	}

	async _load(url, callback, useCache) {
		const _this = this
		if (useCache) {
			const cache = await caches.open(this.cacheName)
			const cachedResponse = await cache.match(url)

			if (cachedResponse) {
				console.log('Loading from cache', url)
				const data = await cachedResponse.json()
				_this._setData(data, callback)
			} else {
				console.log('Loading from URL', url)
				const response = await fetch(url)
				if (response.ok) {
					cache.put(url, response.clone())
					const data = await response.json()
					_this._setData(data, callback)
				}
			}
		} else {
			console.log('Loading from URL', url)
			const response = await fetch(url)
			if (response.ok) {
				const data = await response.json()
				_this._setData(data, callback)
			}
		}
	}

	load(url, callback = null, useCache = true) {
		if (typeof url === 'string') {
			this._load(url, callback, useCache)
		} else {
			this.data = url
		}
	}

	filter(f) {
		return this.data.map(f)
	}

	search(f) {
		return this.data.filter(f)
	}
}

export default DataSet
