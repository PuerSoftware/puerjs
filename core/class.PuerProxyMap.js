import PuerProxyPlugin from './class.PuerProxyPlugin.js'


const PuerProxyMapPlugins = {

	MethodDecorator: class MethodDecorator extends PuerProxyPlugin {
		/*
			methods = {
				methodName1 : callback1(),
				methodName1 : callback2(),
				any         : callbackAny()
			}
		*/
		constructor(methods) {
			super()
			this.methods = methods
		}

		get(prop) {
			if (typeof this.target[prop] === 'function') {
				return new Proxy(this.target[prop], {
					apply: (target, thisArg, args) => {
						let f = (... args) => Reflect.apply(target, this.target, args)
						if (this.methods.hasOwnProperty(prop)) {
							return this.methods[prop](f, ... args)
						} else if (this.methods.any) {
							return this.methods.any(f, ... args)
						}
						return f(...args)
					}
				})
			}
			return undefined
		}
	},

	/*****************************************************************/

	KeyAccessorDecorator : class KeyAccessorDecorator extends PuerProxyPlugin {
		constructor(getter, setter) {
			super()
			this.getter = getter
			this.setter = setter
		}

		get(key) {
			const f = () => this.target.get(key)
			return this.getter(f, key)
		}

		set(key, value) {
			const f = (key, value) => {
				return this.target.set(key, value)
			}
			return this.setter(f, key, value)
		}
	}
}


class PuerProxyMap extends Map {
	constructor(object, plugins) {
		super(Object.entries(object))

		const handler = {
			get: function(target, prop, receiver) {
				if (prop === '__target') { return target }

				let result = null
				for (const plugin of plugins) {
					result = plugin.get(prop)
					if (result !== undefined) { return result }
				}

				if (typeof target[prop] === 'function') {
					return function(...args) {
						return target[prop].apply(target, args)
					}
				}
				console.log('prop', prop, target)
				return Reflect.get(target, prop, receiver)
			},

			set: function(target, prop, value, receiver) {
				for (const plugin of plugins) {
					if (plugin.set(prop, value)) {
						return true
					}
				}
				return Reflect.set(target, prop, value, receiver)
			},

			// apply: function(target, thisArg, args) {
			// 	return target.apply(target, args)
			// }
		}

		const proxy = new Proxy(this, handler)

		for (const plugin of plugins) {
			plugin.engage(this, proxy, handler)
		}

		return proxy
	}

	toMap() {
		return new Map(this.entries())
	}

	toObject() {
		return Object.fromEntries(this.toMap())
	}

	toString() {
		return JSON.stringify(this.toObject())
	}
}

export {PuerProxyMapPlugins}
export default PuerProxyMap