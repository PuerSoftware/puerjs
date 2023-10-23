import Puer       from './class.Puer.js'
import PuerObject from './class.PuerObject.js'


class PuerState extends PuerObject {
	constructor(onChange) {
		super()
		this.history  = {}
		this.state    = {}
		this.onChange = onChange

		return new Proxy(this, {
			get(target, prop) {
				const value = target.state[prop]

				if (Puer.isFunction(target[prop])) {
					return target[prop].bind(target)  // If method exists on the original class, call it
				}
				let getterFunction      = () => { return target.state[prop] }
				getterFunction.toString = () => { return getterFunction()   }

				return Puer.deferred ? getterFunction : value
			},
			set(target, prop, newValue) {
				const oldValue = target.state[prop]
				target.state[prop] = newValue
				if (oldValue && oldValue !== newValue) { onChange(prop, oldValue, newValue) }
				return true
			}
		})
	}

	navigate(hash) {
		if (this.history[hash]) {
			this.state = this.history[hash]
		} else {
			this.history[hash] = Object.assign({}, this.state)  // save shallow copy
		}
	}
}

export default PuerState