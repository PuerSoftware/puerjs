import Puer from './class.Puer.js'


class PuerProxy {
	constructor(props={}, onChange, handlerExtension={}) {
		this.data      = props
		this.ddata     = {}
		this.onChange  = onChange

		const handler = Object.assign({
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
					if (Puer.deferred && Puer.isPrimitive(target.data[prop])) {
						return Puer.reference(target.data, prop)
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
				const oldValue = target.data[prop]
				target.data[prop]  = value
				target.ddata[prop] = Puer.dereference(value)
				target.onChange(prop, oldValue, value)
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
		}, handlerExtension)

		for (const prop in this.data) {
			this.ddata[prop] = Puer.dereference(this.data[prop])
		}

		return new Proxy(this, handler)
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
}

export default PuerProxy