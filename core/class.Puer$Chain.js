import Puer       from './class.Puer.js'
import PuerObject from './class.PuerObject.js'


class Puer$Chain extends PuerObject {
	constructor(component) {
		super()

		return new Proxy(component, {
			get(component, prop) {
				if (component.isCustom) {
					if (prop === component.root.chainName) {
						return component.root
					}
				} else {
					const items = []
					for (const child of component.children) {
						if (prop === child.instance.chainName) {
							items.push(child.instance)
						}
					}
					return items.length ? items : null
				}
				return null
			},
			set(component, prop, value) {
				console.warn('Setter is not defined for PuerChain')
			}
		})
	}
}

export default Puer$Chain