import Puer       from './class.Puer.js'
import PuerObject from './class.PuerObject.js'


class Puer$$$Chain extends PuerObject {
	constructor(component) {
		super()

		return new Proxy(component, {
			get(component, prop) {
				parent = component.parent
				let prototype
				while (parent) {
					prototype = Object.getPrototypeOf(parent);
					while (prototype !== null) {
						if (prototype.constructor.name === prop) {
							return parent
						}
						prototype = Object.getPrototypeOf(prototype);
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

export default Puer$$$Chain