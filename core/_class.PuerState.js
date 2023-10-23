import Puer       from './class.Puer.js'
import PuerObject from './class.PuerObject.js'


class PuerState extends PuerObject {
	constructor(onChange) {
		super()
		this.history  = {}
		this.state    = {}
		this.onChange = onChange
		return PuerState._makeObservable(this.data, this.onChange, this)
	}

	static _makeObservable(obj, onChange, context) {
		return new Proxy(obj, {
			get(target, prop) {
				if (Puer.isFunction(context[prop])) {
					return context[prop].bind(context)  // If method exists on the original class, call it
				}

				const value = target[prop]
				if (Puer.isObject(value) && value !== null) {
					return PuerState._makeObservable(value, onChange, context)  // Recursive call for nested object
				}

				let getterFunction = () => {
					return target[prop]
				}
				getterFunction.toString = () => {
					return getterFunction()
				}
				return Puer.deferred ? getterFunction : value
			},
			set(target, prop, value) {
				let isChange   = prop in target
				const oldValue = target[prop]
				target[prop]   = value

				if (Array.isArray(target)) { isChange = true }
				if (isChange)              { onChange(prop, oldValue, value) }
	
				return true
			}
		})
	}

	navigate(hash) {
		if (this.history[hash]) {
			this.data = this.history[hash]
		} else {
			this.history[hash] = Object.assign({}, this.data)  // save shallow copy
		}
	}
}

export default PuerState