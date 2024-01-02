class Request {
	static request(url, method = null, data = null, headers = null, callback) {
		const conf = {
			method  : method ? method.toUpperCase() : 'GET',
			headers : headers || {'Content-Type': 'application/json'}
		}
		if (data) {
			if (conf.method === 'GET') {
				url = url + '?' + new URLSearchParams(data).toString()
			} else {
				conf.body = JSON.stringify(data)
			}
		}
		fetch(url, conf)
			.then(response => {
				const headers = {}
				response.headers.forEach((value, key) => {
                    headers[key] = value;
                })
				return response.json().then(data => {
					return {data, headers}
				})
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
}


export default Request