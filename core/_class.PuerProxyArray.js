import PuerProxyPlugin from './class.PuerProxyPlugin.js'


const PuerProxyArrayPlugins = {

	/*****************************************************************/

	ChainOperator: class ChainOperator extends PuerProxyPlugin {
		/*
			operators = {
				operator1 : itemMethodName1,
				operator1 : itemMethodName2,
				...
				operatorN : itemMethodNameN
			}
		*/
		constructor(operators) {
			super()
			this.operators = operators
			this.operator  = null
		}

		get(prop) {
			if (this.operator) {
				let   newInstance  = this.target
				const method       = this.operators[this.operator]

				for (const item of this.target) {
					newInstance = newInstance.concat(item[method](prop))
					this.operator = null
					return newInstance
				}
			} else {
				if (prop in this.operators) {
					this.operator = prop
					return new Proxy(this.target, this.handler)
				}
			}
			return undefined
		}
	},

	/*****************************************************************/

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
						let f = (... args) => Reflect.apply(target, thisArg, args)
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

	IndexAccessorDecorator : class IndexAccessorDecorator extends PuerProxyPlugin {
		constructor(getter, setter) {
			super()
			this.getter = getter
			this.setter = setter
		}

		get(index) {
			if (this.getter && Number.isInteger(Number(index))) {
				const f = () => this.target[index]
				return this.getter(f, index)
			}
			return undefined
		}

		set(index, value) {
			if (this.setter && Number.isInteger(Number(index))) {
				const f = (value) => { this.target[index] = value }
				this.setter(f, index, value)
				return true
			}
			return false
		}
	}
}

/*****************************************************************/
/*****************************************************************/

class PuerProxyArray extends Array {
	constructor(items, plugins) {
		console.log(items)
		super(... items)

		const handler = {
			get: function(target, prop, receiver) {
				if (prop === '__target') { return target }
				
				let result = null
				for (const plugin of plugins) {
					result = plugin.get(prop)
					if (result !== undefined) { return result }
				}
				return Reflect.get(target, prop, receiver)
			},

			set: function(target, prop, value, receiver) {
				for (const plugin of plugins) {
					if (plugin.set(prop, value)) {
						return true
					}
				}
				return Reflect.set(target, prop, value, receiver)
			}
		}

		const proxy = new Proxy(this, handler)

		for (const plugin of plugins) {
			plugin.engage(this, proxy, handler)
		}

		return proxy
	}

	toArray() {
		return Array.from(this)
	}

	toString() {
		return '[' + this.toArray().join(', ') + ']'
	}
}

export {PuerProxyArrayPlugins}
export default PuerProxyArray