import Request from './class.Request.js'


class DataSet {
	constructor(cacheName=null) {
		this.cacheName = cacheName
		this.data      = {}
	}

	_setData(data) {
		if (Array.isArray(data)) {
			this.data = data
		} else if (myValue !== null && typeof myValue === 'object') {
			this.data = [data]
		} else {
			throw 'DataSet: incompatible data type'
		}
	}

	_load(url, callback, useCache) {
		const _this = this
		if (useCache) {
			if (window.caches) {
				caches.open(this.cacheName).then((cache) => {
					cache.match(url).then((data) => {
						if (data) {
							_this.data = data
						} else {
							Request.get(url, (data) => {
								cache.put(url, Object.assign({}, data))
								_this._setData(data)
								callback && callback(_this)
							})
						}
					})
				})
			}
		} else {
			Request.get(url, (data) => {
				_this._setData(data)
				callback && callback(_this)
			})
		}
	}

	load(url, callback=null, useCache=true) {
		if (typeof url === 'string') {
			this._load(url, useCache, callback)
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