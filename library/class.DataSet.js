import Request from './class.Request.js'


class DataSet {
	constructor() {
		this.data = {}
	}

	_setData(data, callback) {
		if (Array.isArray(data)) {
			this.data = data
		} else if (data !== null && typeof data === 'object') {
			this.data = [data]
		} else {
			throw 'DataSet: incompatible data type'
		}
		callback && callback(this.data)
	}

	_load(url, callback, useCache) {
		const _this = this
		if (useCache) {
			let data = localStorage.getItem(url)
			if (data) {
				console.log('Loading from cache', url)
				_this._setData(JSON.parse(data), callback)
			} else {
				console.log('Loading from url 1', url)
				Request.get(url, (data) => {
					localStorage.setItem(url, JSON.stringify(data))
					_this._setData(data, callback)
				})
			}
		} else {
			console.log('Loading from url 2', url)
			Request.get(url, (data) => {
				_this._setData(data, callback)
			})
		}
	}

	load(url, callback=null, useCache=true) {
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