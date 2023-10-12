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
			const f = (value) => { this.target.set(key, value) }
			this.setter(f, key, value)
			return true
		}
	}
}


class PuerProxyMap extends Map {
	constructor(object, plugins) {
		super(Object.entries(object))

		const handler = {
			get: function (target, prop, receiver) {
				if (prop === '__target') { return target }
				if (new Map()[prop]) {
					// console.log('getter of own property', target, prop)
					// console.log('target has?', target['has'])
					return target[prop].bind(target)
				}
				let result = null
				for (const plugin of plugins) {
					result = plugin.get(prop)
					if (result !== undefined) { return result }
				}
				return target.get(prop)
			},
			set: function(target, prop, value, receiver) {
				if (new Map()[prop]) {
					return Reflect.set(target, prop, value, receiver)
				}
				for (const plugin of plugins) {
					if (plugin.set(prop, value)) {
						return true
					}
				}
				return target.set(prop, value)
			}
		}

		let proxy = new Proxy(this, handler)

		for (const plugin of plugins) {
			plugin.engage(this, proxy, handler)
		}

		return proxy
	}

	// get(prop) {
	// 	return this[prop]
	// }
	//
	// set(prop, value) {
	// 	this[prop] = value
	// }

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