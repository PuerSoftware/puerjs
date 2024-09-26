class Request {
	static Authorization = Settings 
		? Settings.ACCESS_TOKEN || null
		: null

	static $($) { window.$ = $ }
	static _pollMap = {}
	
	static define(name, url, method) {
		if (Request.hasOwnProperty(name)) {
			throw `Request class already has property "${name}"`
		}

		const request = new Request(url, method)
		Object.defineProperty(Request, name, {
			get: function() {
				return request
			}
		})
		return request
	}

	static request(url,
		method   = null,
		data     = null,
		headers  = null, 
		callback, 
		redirect = 'manual',
	) {

		const conf = {
			method   : method ? method.toUpperCase() : 'GET',
			headers  : headers || {},
			redirect : redirect
		}

		if (Request.Authorization) {
			conf.headers['Authorization'] = 'Bearer ' + Request.Authorization
		}
		conf.headers['Content-Type'] = headers
			? headers['Content-Type'] || 'application/json'
			: 'application/json'
			
		if (data) {
			if (['POST', 'PUT', 'PATCH', 'DELETE'].includes(conf.method)) {
				if (conf.headers['Content-Type'] === 'application/json') {
					conf.body = JSON.stringify(data)
				} else {
					conf.body = data
				}
			} else {
				url = url + '?' + $.String.toQueryString(data)
			}
		}

		fetch(url, conf)
			.then(response => {
				const headers = {}
				response.headers.forEach((value, key) => {
					headers[key] = value
				})
				switch (response.status) {
					case 200:	
						return response.json().then(data => {
							return {data, headers}
						})
					case 422:
						response.text().then(error => {
							console.log(error)
						})
					default: // TODO: Handle other status codes
						return response.text().then(data => {
							return {data: data, headers}
						})
				}
			})
			.then(({data, headers}) => {	
				if (callback && typeof callback === 'function') {
					callback(data, headers)
				}
			})
			.catch(error => {
				console.error('Request failed:', error)
				if (callback && typeof callback === 'function') {
					callback(null, error)
				}
			})
	}
	
	static get(url, callback, urlParams=null, headers=null) {
		Request.request(url, 'GET', urlParams, headers, callback)
	}

	static post(url, callback, data=null, headers=null) {
		Request.request(url, 'POST', data, headers, callback)
	}

	static pollStart(url, callback, urlParams=null, headers=null, interval=1000, id=null) {
		if (!id) {
			id = $.String.randomHex(5)
			Request._pollMap[id] = 1
		}
		setTimeout(() => {
			$.Request.get(
				url,
				(d, h) => {
					callback(d, h)
					Request._pollMap[id] && Request.pollStart(url, callback, urlParams, headers, interval, id)
				},
				urlParams,
				headers
			)
		}, interval)
		return id
	}
	
	static pollStop(id) {
		delete Request._pollMap[id]
	}

	constructor(url, method) {
		this.url        = url
		this.method     = method
		this._listeners = new Set()
	}

	send(data, headers) {
		Request.request(this.url, this.method, data, headers, (data, headers) => {
			for (const f of this._listeners.values()) {
				f(data, headers)
			}
		})
	}

	set onResponse(f) {
		this._listeners.add(f)
	}
}

export default Request