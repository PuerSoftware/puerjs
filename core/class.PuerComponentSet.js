class PuerComponentSet {
	constructor(components = []) {
		this._components = components
		this._operator   = null
		return new Proxy(this, {
			get(target, prop) {
				let newSet = new PuerComponentSet()
				switch (prop) {
					case 'components':
						return target._components
					case 'concat':
						return function(otherSet) {
							let otherComponents = otherSet
							if (otherSet instanceof PuerComponentSet) {
								otherComponents = otherSet._components
							}
							return new PuerComponentSet([...target._components, ...otherComponents])
						}
					case '$'   :
					case '$$'  :
					case '$$$' :
						target._operator = prop
						return new Proxy(target, this)
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

						if (target._operator) {
							switch (target._operator){
								case '$':
									for (const component of target._components) {
										newSet = newSet.concat(component.getImmediateChainDescendants(prop))
									}
									return newSet.components
								case '$$':
									for (const component of target._components) {
										newSet = newSet.concat(component.getChainDescendants(prop))
									}
									return newSet.components
								case '$$$':
									for (const component of target._components) {
									    newSet = newSet.concat(component.getChainAncestor(prop))
									}
									return newSet.components
							}
						}
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