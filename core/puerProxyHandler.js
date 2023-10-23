import Puer from './class.Puer.js'

const puerProxyHandler = {
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
				let getterFunction = () => target.data[prop]
				getterFunction.toString = () => {
					return target.dereference(prop)
				}
				return getterFunction
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
		target.ddata[prop] = target.dereference(value)
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
}

export default puerProxyHandler