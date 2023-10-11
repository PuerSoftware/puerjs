class PuerProxyPlugin {
	constructor() {
		targetClass = null
		proxyClass  = null
	}

	engage(target, proxy, handler) {
		this.target  = target
		this.proxy   = proxy
		this.handler = handler
	}

	get() { return undefined }
	set() { return false     }
}


class ChainPlugin extends PuerProxyPlugin {
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
			let   newInastance = new targetClass()
			const method       = this.operators[this.operator]

			for (const item of this.target) {
				newInastance = newInastance.concat(item[method](prop))
				this.operator = null
				return newInastance
			}
		} else {
			if (prop in this.operators) {
				target._operator = prop
				return new Proxy(this.target, this.handler)
			}
		}
		return undefined
	}

}


class MethodDecoratorPlugin extends PuerProxyPlugin {
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
					return f()
				}
			})
		}
	}
}


class IndexAccessorPluin extends PuerProxyPlugin {
	constructor(getter, setter) {
		super()
		this.getter = getter
		this.setter = setter
	}

	get(index) {
		if (Number.isInteger(Number(index))) {
			const f = () => this.target[index]
			this.getter(f, index)
		}
	}

	set(index, value) {
		if (Number.isInteger(Number(index))) {
			const f = (value) => { this.target[index] = value }
			this.setter(f, index, value)
		}
	}
}


class PuerArray extends Array {
	constructor(items, plugins) {
		super(... items)
		this.plugins = plugins

		this.handler = {
			get: function(target, prop, receiver) {
				let result = null
				for (const plugin of plugins) {
					result = plugin.get(prop)
					if (result !== undefined) { return result }
				}
				return Reflect.get(target, prop, receiver)
			},

			set: function(target, prop, value receiver) {
				for (const plugin of plugins) {
					if (plugin.set(prop, value)) {
						return true
					}
				}
				return Reflect.set(target, prop, value, receiver)
			}
		}

		this.proxy = new Proxy(this, this.handler)

		for (const plugin of plugins) {
			plugin.engage(this, this.proxy, this.handler)
		}

		return this.proxy
	}
}