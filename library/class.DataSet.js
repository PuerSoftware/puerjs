import Request from './class.Request.js'


class DataSet {

	static CACHE_NAME ='dataSetCache'

	constructor() {
		this.data = {}
	}

	async _setData(data, callback) {
		if (Array.isArray(data)) {
			this.data = data
		} else if (data !== null && typeof data === 'object') {
			this.data = data
		} else {
			throw new Error('DataSet: incompatible data type')
		}
		if (callback) callback(this)
	}

	async _load(url, callback, useCache) {
		const _this = this
		if (useCache) {
			const cache = await caches.open(DataSet.CACHE_NAME)
			const cachedResponse = await cache.match(url)

			if (cachedResponse) {
				// console.log('Loading from cache', url)
				const data = await cachedResponse.json()
				_this._setData(data, callback)
			} else {
				// console.log('Loading from URL', url)
				const response = await fetch(url)
				if (response.ok) {
					cache.put(url, response.clone())
					const data = await response.json()
					_this._setData(data, callback)
				}
			}
		} else {
			// console.log('Loading from URL', url)
			const response = await fetch(url)
			if (response.ok) {
				const data = await response.json()
				_this._setData(data, callback)
			}
		}
	}

	filter(f) {
		return this.data.map(f)
	}

	search(f) {
		return this.data.filter(f)
	}

	static async clear(url = null) {
		const cache = await caches.open(DataSet.CACHE_NAME)

		if (url) {
			// Clear cache for specific URL
			const keys = await cache.keys()
			for (const request of keys) {
				if (request.url === url) {
					await cache.delete(request)
					console.log(`Cache for URL '${url}' cleared.`)
					return
				}
			}
			console.log(`No cache found for URL '${url}'.`)
		} else {
			// Clear entire cache
			const cacheExists = await caches.has(DataSet.CACHE_NAME)
			if (cacheExists) {
				await caches.delete(DataSet.CACHE_NAME)
				console.log(`Entire cache '${DataSet.CACHE_NAME}' cleared.`)
			} else {
				console.log(`Cache '${DataSet.CACHE_NAME}' does not exist.`)
			}
		}
	}

	static async keys() {
        const cache = await caches.open(DataSet.CACHE_NAME)
        const requests = await cache.keys()
        return requests.map(request => request.url)
    }

	static load(url, callback = null, useCache = true) {
		const ds = new DataSet()	
		if (typeof url === 'string') {
			ds._load(url, callback, useCache)
		} else {
			ds.data = url
		}
		return ds
	}
}

export default DataSet
