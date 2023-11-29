import StringMethods  from './class.StringMethods.js'
import ReferenceOwner from './class.ReferenceOwner.js'

class Reference {
	constructor(prop, value) {
		this.prop        = prop
		this.value       = value
		this.owners      = []
		this.ownerIds    = new Set()
		this.id          = StringMethods.randomHex(5)
		this.isReference = true
	}

	dereference() {
		return this.value
	}

	toString() {
		return JSON.stringify({
			reference : '#' + this.id,
			prop      : this.prop,
			owners    : this.owners.map(owner => owner.className),
			value     : this.value
		})
	}

	addOwner(owner, prop, updateMethod) {
		if (!this.ownerIds.has(owner.id)) {
			this.owners.push(new ReferenceOwner(owner, prop, updateMethod))
			this.ownerIds.add(owner.id)
		}
	}

	updateOwners() {
		////////
		if (this.prop === 'value' || this.prop === 'stateValue') {
			console.log('updateOwners', this.prop, this.id)
		}
		//////
		this.owners.forEach(owner => {
			owner.update()
		})
	}
}

export default Reference