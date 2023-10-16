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
			console.log('in KAD', key)
			const f = (key) => this.target.get(key)
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

		const _map = this

		const handler = {
			get: function(target, prop, receiver) {
				if (typeof _map[prop] === 'function') {
					return function(...args) {
						return target[prop].apply(target, args)
					}
				}

				let result = null
				for (const plugin of plugins) {
					if (plugin.get) {
						return plugin.get(prop)
					}
				}

				return _map.get(prop)
			},

			set: function(target, prop, value, receiver) {
				for (const plugin of plugins) {
					if (plugin.set) {
						return plugin.set(prop, value)
					}
				}
				return _map.set(prop, value)
			},

			deleteProperty: function(target, prop, receiver) {
				for (const plugin of plugins) {
					if (plugin.delete) {
						return plugin.delete(prop)
					}
				}
				return _map.delete(prop)
			}
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
			.split('","').join('", "')
			.replace(/"([^"]+)":/g, '$1: ')
			.split('"').join("'")
	}
}

export {PuerProxyMapPlugins}
export default PuerProxyMap