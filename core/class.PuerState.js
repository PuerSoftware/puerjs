import Puer       from './class.Puer.js'
import PuerObject from './class.PuerObject.js'


class PuerState extends PuerObject {
	constructor(onChange) {
		super()
		this.state    = {}
		this.onChange = onChange
		return PuerState._makeObservable(this.state, this.onChange)
	}

	static _makeObservable(obj, onChange) {
		return new Proxy(obj, {
			get(target, prop) {
				const value = target[prop]
				if (typeof value === 'object' && value !== null) {
					return PuerState._makeObservable(value, onChange)  // Recursive call for nested object
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
				target[prop] = value

				if (Array.isArray(target)) { isChange = true }
				if (isChange)              { onChange(prop, oldValue, value) }
	
				return true
			}
		})
	}

	test() {
		return 'test'
	}
}

export default PuerState