import PuerProxyPlugin from './class.PuerProxyPlugin.js'


const PuerObjectProxyPlugins = {
	PropertyDecorator: class PropertyDecorator extends PuerProxyPlugin {
		constructor(getter, setter) {
			super()
			this.getter = getter
			this.setter = setter
		}

		get(prop) {
			console.log('PuerObjectProxy.get()', prop)
			if (this.getter && typeof prop === 'string') {
				const f = () => this.target[prop]
				console.log('PuerObjectProxy.get() const f = ', f)
				return this.getter(f, prop)
			}
			return undefined
		}

		set(prop, value) {
			if (this.setter && typeof prop === 'string') {
				const f = (value) => { this.target[prop] = value }
				this.setter(f, prop, value)
				return true
			}
			return false
		}
	}
}


class PuerObjectProxy extends Object {
	constructor(object, plugins) {
		super(object)
		this.plugins = plugins

		this.handler = {
			get: function (target, prop, receiver) {
				let result = null
				for (const plugin of plugins) {
					result = plugin.get(prop)
					if (result !== undefined) { return result }
				}
				const res = Reflect.get(target, prop, receiver)
				console.log('PuerProxyObject Reflect.get', res)
				return res
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

		this.proxy = new Proxy(this, this.handler)

		for (const plugin of plugins) {
			plugin.engage(this, this.proxy, this.handler)
		}

		return this.proxy
	}

}

export {PuerObjectProxyPlugins}
export default PuerObjectProxy