import Puer             from './class.Puer.js'
import puerProxyHandler from './puerProxyHandler.js'


class PuerState {
	constructor(onChange) {
		this.data     = {}
		this.ddata    = {}
		this.onChange = onChange

		for (const prop in this.data) {
			this.ddata[prop] = this.dereference(prop)
		}

		return new Proxy(this, puerProxyHandler)
	}

	forEach(callback) {
		for (let key in this.data) {
			callback(this.data[key], key, this.data)
		}
	}

	toObject() {
		return this.data
	}

	toString() {
		return JSON.stringify(this.toObject())
			.split('","').join('", "')
			.replace(/"([^"]+)":/g, '$1: ')
			.split('"').join("'")
	}

	dereference(prop) {
		let value = this.data[prop]
		while (Puer.isFunction(value)) {
			value = value()
		}
		return value
	}
}

export default PuerState