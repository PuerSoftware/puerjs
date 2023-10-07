import Puer       from './class.Puer.js'
import PuerObject from './class.PuerObject.js'


class Puer$$$Chain extends PuerObject {
	constructor(component) {
		super()

		return new Proxy(component, {
			get(component, prop) {
				return component.findParentByBaseClassName(prop)
			},
			set(component, prop, value) {
				console.warn('Setter is not defined for PuerParentChain')
			}
		})
	}
}

export default Puer$$$Chain