import Puer      from './class.Puer.js'
import PuerProxy from './class.PuerProxy.js'


class PuerState extends PuerProxy {
	constructor(data, onChange) {
		return super(data, onChange, {
			set(target, prop, newValue) {
				const oldValue = target.data[prop]
				target.data[prop] = newValue
				if (oldValue && oldValue !== newValue) { onChange(prop, oldValue, newValue) }
				return true
			}
		})
	}
}

export default PuerState