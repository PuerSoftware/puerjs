import $         from './class.Puer.js'
import Reference from '../library/class.Reference.js'


class PuerProxy {
	constructor(props={}, onChangeMethod, owner, handlerExtension={}) {
		this.references     = {}
		this.owner          = owner
		this.onChangeMethod = onChangeMethod

		for (const prop in props) {
			this.setProp(prop, props[prop])
		}
		
		$.isReferencing = false

		const handler = Object.assign({
			get: (target, prop) => {
				if (prop === Symbol.iterator) {
					return function*() {
						for (let _prop in target.references) {
							yield [_prop, target.references[_prop].dereference()]
						}
					}
				}
				if (prop in target) {
					return typeof target[prop] === 'function'
						? target[prop].bind(target)
						: target[prop]
				}
				if (prop in target.references) {
					return $.isReferencing
						? target.references[prop]
						: target.references[prop].dereference()
				}
			},
			set: (target, prop, value) => {
				target.setProp(prop, value)
				return true
			},
			has: (target, prop) => {
		        return prop in target.references
		    },
			deleteProperty: (target, prop) => {
				delete target.references[prop]
				target.owner[onChangeMethod](prop)
				return true
			},
			ownKeys: (target) => {
				return Reflect.ownKeys(target.references)
			},
			getOwnPropertyDescriptor: (target, prop) => {
				const descriptor = Object.getOwnPropertyDescriptor(target.references, prop)
				if (descriptor) {
					descriptor.enumerable = true
					return descriptor
				}
				return undefined
			}
		}, handlerExtension)
		return new Proxy(this, handler)
	}

	setProp(prop, value) {
		let dataId
		let reference = this.references[prop]

		if (value && value.isReference) {
			this.references[prop] = value
			dataId = value.dataId
		} else {
			if (reference) {
				// if (value && value.dataId) { // TODO: use if will implemented proxy Single Source of Truth
				// 	dataId             = value.dataId
				// 	const newReference = new Reference(dataId)
				// 	newReference.merge(reference)
				// 	$.DataStore.set(dataId, value)
				// 	reference = newReference
				// } else {
					$.DataStore.set(reference.dataId, value)
					dataId = reference.dataId
				// }
			} else {
				// if (value && value.dataId) { // TODO: use if will implemented proxy Single Source of Truth
				// 	dataId = value.dataId
				// 	$.DataStore.set(dataId, value)
				// } else {
					dataId = $.DataStore.set(null, value)
					reference = new Reference(dataId)
				}
				// reference = new Reference(dataId)
			//}

			this.references[prop] = reference
		}

		$.DataStore.addOwner(dataId, prop, this.owner, this.onChangeMethod)
	}

	setById(prop, dataId) {
		this.references[prop] = new Reference(dataId)
	}

	forEach(callback) {
		for (const prop in this.references) {
			const value = $.DataStore.values[this.references[prop].dataId]
			callback(value, prop, this.references)
		}
	}

	toObject() {
		return this.references
	}

	toString() {
		return JSON.stringify(this.toObject(), null, 4)
	}
}

export default PuerProxy