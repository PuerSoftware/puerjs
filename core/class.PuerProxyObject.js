import PuerProxyPlugin from './class.PuerProxyPlugin.js'


const PuerProxyObjectPlugins = {

	PropertyDecorator: class PropertyDecorator extends PuerProxyPlugin {
		constructor(getter, setter) {
			super()
			this.getter = getter
			this.setter = setter
		}

		get(prop) {
			if (this.getter && typeof prop === 'string') {
				const f = () => this.target[prop]
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


class PuerProxyObject extends Object {
	constructor(object, plugins) {
		super(object)

		const handler = {
			get: function (target, prop, receiver) {
				if (prop === 'toObject') { return () => target }
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

		let proxy = new Proxy(this, handler)

		for (const plugin of plugins) {
			plugin.engage(this, proxy, handler)
		}

		return proxy
	}


	toObject() {
		console.log('ToObject-->', this)
		return {...this}
	}

	toString() {
		return JSON.stringify(this.toObject())
	}

}

export {PuerProxyObjectPlugins}
export default PuerProxyObject