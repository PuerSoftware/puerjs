class Request {
	static request(url, method=null, data=null, headers=null) {
		const conf = {
			method  : method.toUpperCase() || 'GET',
			headers : headers || {'Content-Type': 'application/json'},
		}
		if (data) {
			if (conf.method === 'get') {
				url = url + '?' + new URLSearchParams(data).toString()
			} else {
				conf.body = JSON.stringify(data)
			}
		}
		return fetch(url, conf)
	}

	static aget(url, urlParams=null, headers=null) {
		return Request.request(url, 'GET', urlParams, headers)
	}

	static apost(url, data=null, headers=null) {
		return Request.request(url, 'POST', data, headers)
	}

	static get(url, callback, urlParams=null, headers=null) {
		Request.request(url, 'GET', urlParams, headers)
			.then(request => {
				if (!request.ok) {
					throw new Puer.Error(`Request failed`)
				}
				return request.json()
			})
			.then(callback)
	}

	static post(url, callback, data=null, headers=null) {
		Request.request(url, 'POST', data, headers)
			.then(request => {
				if (!request.ok) {
					throw new Puer.Error(`Request failed`)
				}
				return request.json()
			})
			.then(callback)
	}
}


export default Request