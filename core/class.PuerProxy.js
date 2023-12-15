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
				if (prop in target.references) {
					return $.isReferencing
						? target.references[prop]
						: target.references[prop].dereference()
				} else if (prop in target) {
					return typeof target[prop] === 'function'
						? target[prop].bind(target)
						: target[prop]
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
		let id
		let reference = this.references[prop]

		if (value && value.isReference) {
			this.references[prop] = value
			id = value.id
		} else {
			id = $.DataStore.set(null, value)
			if (reference) {
				reference.reuse(id)
			} else {
				reference = new Reference(id)
			}

			this.references[prop] = reference
		}

		$.DataStore.addOwner(id, prop, this.owner, this.onChangeMethod)
	}

	forEach(callback) {
		for (const prop in this.references) {
			const value = $.DataStore.values[this.references[prop].id]
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