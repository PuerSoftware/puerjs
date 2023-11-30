import StringMethods  from './class.StringMethods.js'
import ReferenceOwner from './class.ReferenceOwner.js'


class Reference {
	constructor(value) {
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
		this.owners.forEach(owner => {
			owner.update()
		})
	}
}

export default Reference