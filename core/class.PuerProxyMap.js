import PuerProxyPlugin from './class.PuerProxyPlugin.js'


const PuerProxyMapPlugins = {

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


class PuerProxyMap extends Map {
	constructor(object, plugins) {
		super(Object.entries(object))
		const handler = {
			get: function (target, prop, receiver) {
				console.log('PuerProxyMap.get', target, prop, receiver)
				if (prop === '__target') { return target }
				let result = null
				for (const plugin of plugins) {
					result = plugin.get(prop)
					if (result !== undefined) { return result }
				}
				const res = Reflect.get(target, prop, receiver)
				console.log('GetRes', res)
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

		let proxy = new Proxy(this, handler)

		for (const plugin of plugins) {
			plugin.engage(this, proxy, handler)
		}

		return proxy
	}

	toMap() {
		return new Map(this.__target.entries())
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