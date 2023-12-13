import $ from './class.Puer.js'


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
						for (let key in target.references) {
							yield [key, target.references[key].dereference()]
						}
					}
				}
				if (prop === 'toString') {
					return target[prop]
				}

				if (prop in target.references) {
					if ($.isReferencing && $.isPrimitive(target.references[prop].dereference())) {
						return target.references[prop]
					} else {
						return target.references[prop].dereference()
					}
				} else if (prop in target) {
					return typeof target[prop] === 'function'
						? target[prop].bind(target)
						: target[prop]
				}
			},
			set: (target, prop, value) => {
				const isChanged = target.setProp(prop, value)
				if (isChanged) {
					target.references[prop].updateOwners()
				}
				return true
			},
			has: (target, prop) => {
		        return prop in target.references
		    },
			deleteProperty: (target, prop) => {
				target.owner[onChangeMethod](prop)
				delete target.references[prop]
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
		const oldValue = this.references[prop]
			? this.references[prop].dereference()
			: null

		if (value && value.isReference) {
			this.references[prop] = value
		} else {
			if (this.references[prop]) {
				this.references[prop].value = value
			} else {
				const id = $.DataStore.set(null, value)
				this.references[prop] = $.reference(id)
			}
		}

		this.references[prop].addOwner(this.owner, prop, this.onChangeMethod)
		return oldValue !== value
	}

	forEach(callback) {
		for (let key in this.references) {
			callback(this.references[key].dereference(), key, this.references)
		}
	}

	toObject() {
		return this.references
	}

	toString() {
		return JSON.stringify(this.toObject())
			.split('","').join('", "')
			.replace(/"([^"]+)":/g, '$1: ')
			.split('"').join("'")
	}
}

export default PuerProxy