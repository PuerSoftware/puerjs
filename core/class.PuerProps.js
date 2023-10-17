import Puer         from './class.Puer.js'
import PuerError    from './class.PuerError.js'

class PuerProps {
	constructor(props={}, onChange) {
		this.data      = props
		this.ddata     = {}
		this.onChange  = onChange

		for (const prop in this.data) {
			this.ddata[prop] = this.dereference(prop)
		}
		console.log('DATA', this.data)
		console.log('DDATA', this.ddata)

	return new Proxy(this, {
		get: (target, prop) => {
			if (prop === Symbol.iterator) {
				return function*() {
					for (let key in target.data) {
						yield [key, target.data[key]]
					}
				}
			}
			if (prop === 'toString') {
				return target[prop]
			}
			if (prop in target.data) {
				if (Puer.deferred) {
					return () => target.data[prop]
				} else {
					return target.data[prop]
				}
			} else if (prop in target) {
				return typeof target[prop] === 'function'
					? target[prop].bind(target)
					: target[prop]
			}
		},
		set: (target, prop, value) => {
			target.onChange(prop, target.data[prop], value)
			target.data[prop]  = value
			target.ddata[prop] = this.dereference(value)
			return true
		},
		has: (target, prop) => {
            return prop in target.data
        },
		deleteProperty: (target, prop) => {
			target.onChange(prop, target.data[prop], undefined)
			delete target.data[prop]
			delete target.ddata[prop]
			return true
		},
		ownKeys: (target) => {
			return Reflect.ownKeys(target.data)
		},
		getOwnPropertyDescriptor: (target, prop) => {
			const descriptor = Object.getOwnPropertyDescriptor(target.data, prop)
			if (descriptor) {
				descriptor.enumerable = true
				return descriptor
			}
			return undefined
		}
	})
	}

	forEach(callback) {
		for (let key in this.data) {
			callback(this.data[key], key, this.data)
		}
	}

	default(prop, defaultValue) {
		if (!this.hasOwnProperty(prop)) {
			this[prop] = defaultValue
		}
		return this[prop]
	}

	require(prop) {
		if (!this.hasOwnProperty(prop)) {
			throw new PuerError(`Property ${prop} is required but not set.`, this, 'require')
		}
		return this[prop]
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
		// console.log(prop, this.data[prop])
		return Puer.isFunction(this.data[prop]) && !prop.startsWith('on')
			? this.data[prop]()
			: this.data[prop]
	}

	touch() {
		for (const prop in this.data) {
			const newValue = this.dereference(prop)
			if (newValue !== this.ddata[prop]) {
				this.onChange(prop, this.ddata[prop], newValue)
			}
		}
	}
}

export default PuerProps