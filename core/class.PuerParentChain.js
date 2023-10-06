import Puer       from './class.Puer.js'
import PuerObject from './class.PuerObject.js'


class PuerParentChain extends PuerObject {
	constructor(component) {
		super()

		return new Proxy(component, {
			get(component, prop) {
				parent = component.parent
				while (parent) {
					console.log(parent)
					if (parent.chainName === prop) {
						return parent
					}
					parent = parent.parent
				}
				return null
			},
			set(component, prop, value) {
				console.warn('Setter is not defined for PuerParentChain')
			}
		})
	}
}

export default PuerParentChain