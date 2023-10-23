import Puer             from './class.Puer.js'
import puerProxyHandler from './puerProxyHandler.js'

class PuerProps {
	constructor(props={}, onChange) {
		this.data      = props
		this.ddata     = {}
		this.onChange  = onChange

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

	default(prop, defaultValue) {
		if (!this.data.hasOwnProperty(prop)) {
			this.data[prop] = defaultValue
		}
		return this.data[prop]
	}

	require(prop, owner) {
		if (!this.data.hasOwnProperty(prop)) {
			throw new Puer.Error(`Property ${prop} is required but not set.`, owner || this, 'require')
		}
		return this.data[prop]
	}

	extractEvents(owner) {
		const events = {}
		for (const prop in this.data) {
			let value = this.data[prop]
			if (typeof value === 'function' && prop.startsWith('on')) {
				events[prop.substring(2).toLowerCase()] = value.bind(owner)
				delete this.data[prop]
			}
		}
		return events
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
		while (Puer.isFunction(value) && !prop.startsWith('on')) {
			value = value()
		}
		return value
	}

	touch() {
		let counter = 0
		for (const prop in this.data) {
			const newValue = this.dereference(prop)
			if (newValue !== this.ddata[prop]) {
				counter ++
				this.onChange(prop, this.ddata[prop], newValue)
			}
		}
		// if (counter > 1) {
		// 	throw new Error('changed more than 1 prop, when triggered __update function')
		// }
	}
}

export default PuerProps