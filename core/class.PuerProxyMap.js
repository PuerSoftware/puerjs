import PuerProxyPlugin from './class.PuerProxyPlugin.js'


// const PuerProxyMapPlugins = {

// 	TrapDecorator: class TrapDecorator extends PuerProxyPlugin {
// 		/*
// 			methods = {
// 				methodName1 : callback1(),
// 				methodName1 : callback2(),
// 				any         : callbackAny()
// 			}
// 		*/
// 		constructor(methods) {
// 			super()
// 			this.methods = methods
// 		}

// 		get(prop) {
// 			console.log('TrapDecorator apply =>', prop)
// 			if (typeof this.target[prop] === 'function') {
// 				return new Proxy(this.target[prop], {
// 					apply: (target, thisArg, args) => {
// 						let f = (... args) => Reflect.apply(target, this.target, args)
// 						if (this.methods.hasOwnProperty(prop)) {
// 							return this.methods[prop](f, ... args)
// 						} else if (this.methods.any) {
// 							return this.methods.any(f, ... args)
// 						}
// 						return f(...args)
// 					}
// 				})
// 			}
// 			return undefined
// 		}
// 	},

	/*****************************************************************/

	// KeyAccessorDecorator : class KeyAccessorDecorator extends PuerProxyPlugin {
	// 	constructor(getter, setter) {
	// 		super()
	// 		this.getter = getter
	// 		this.setter = setter
	// 	}
	//
	// 	get(key) {
	// 		console.log('in KAD', key)
	// 		const f = (key) => this.target.get(key)
	// 		return this.getter(f, key)
	// 	}
	//
	// 	set(key, value) {
	// 		const f = (key, value) => {
	// 			return this.target.set(key, value)
	// 		}
	// 		return this.setter(f, key, value)
	// 	}
	// }
//}


class PuerProxyMap extends Map {
	/*
	decorators = {
		methodName1 : callback1,
		methodName1 : callback2
	}
	*/	
	constructor(object, decorators) {
		super(Object.entries(object))

		const _map = this

		const handler = {
			get: function(target, prop, receiver) {
				if (typeof _map[prop] === 'function') {
					let f = (...args) => {                        // Methods of not proxied object
						return _map[prop].apply(target, args)
					}
					if (decorators.hasOwnProperty(prop)) {
						// Decorating methods
						return (...args) => {
							return decorators[prop](f, ...args)
						}
					} else {                                       // Not decorating methods
						return f
					}
				}

				if ('get' in decorators) {
					const f = (key) => target.get(key)
					return decorators.get(f, prop)
				}
				return _map.get(prop)                              // All other props
			},

			set: function(target, prop, value, receiver) {
				if ('set' in decorators) {
					const f = (key, value) => target.set(key, value)
					return decorators.set(f, prop, value)
				}
				return _map.set(prop, value)
			},

			deleteProperty: function(target, prop, receiver) {
				if ('delete' in decorators) {
					const f = (key) => target.delete(key)
					return decorators.delete(f, prop)
				}
				return _map.delete(prop)
			}
		}

		return new Proxy(this, handler)
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

// export {PuerProxyMapPlugins}
export default PuerProxyMap