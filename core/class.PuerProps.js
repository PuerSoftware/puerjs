import Puer      from './class.Puer.js'
import PuerProxy from './class.PuerProxy.js'

class PuerProps extends PuerProxy {
	constructor(props={}, onChange) {
		return super(props, onChange)
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
				delete this.ddata[prop]
			}
		}
		return events
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
	}

	pop(prop) {
		const value = this.data[prop]
		delete this.data[prop]
		delete this.ddata[prop]
		return value
	}
}

export default PuerProps