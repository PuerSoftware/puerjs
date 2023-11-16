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
		// console.log('fetch', url, conf)
		return fetch(url, conf)
	}

	static get(url, urlParams=null, headers=null) {
		return Request.request(url, 'GET', urlParams, headers)
	}

	static post(url, data=null, headers=null) {
		return Request.request(url, 'POST', data, headers)
	}
}


export default Request