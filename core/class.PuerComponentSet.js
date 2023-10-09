import Puer       from './class.Puer.js'
import PuerObject from './class.PuerObject.js'


class PuerComponentSet {
	constructor(components = []) {
		this._components = components
		return new Proxy(this, {
			get(target, prop) {
				const newSet = new PuerComponentSet()
				switch (prop) {
					case 'concat':
						return function(otherSet) {
							return new PuerComponentSet([...target._components, ...otherSet._components])
						}
					case '$':
						for (const component of target._components) {
							newSet = newSet.concat(component.getImmediateChildren(prop))
						}
						return newSet
					case '$$':
						for (const component of target._components) {
							newSet = newSet.concat(component.getDescendants(prop))
						}
						return newSet
					case '$$$':
						for (const component of target._components) {
							newSet = newSet.concat(component.getAncestor(prop))
						}
						return newSet
					case 'length':
						return target._components.length
					case Symbol.iterator:
						return function* () {
							for (let item of target._components) {
								yield item
							}
						}
					default:
						if (!isNaN(Number(prop))) {
							return target._components[Number(prop)]
						}
						return target._components.filter(component => component.name === prop)
				}
			},
			ownKeys() {
				return Object.keys(target._components)
			},
			getOwnPropertyDescriptor(target, prop) {
				if (prop in target._components) {
					return {
						enumerable   : true,
						configurable : true
					}
				}
			}
		})
	}
}

export default PuerComponentSet

/*

immediate child 	$c
descendant          $d
ancestor            $a

*/