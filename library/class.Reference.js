import ReferenceOwner from './class.ReferenceOwner.js'


class Reference {
	constructor(id, puer) {
		this.puer        = puer
		this.owners      = []
		this.ownerIds    = new Set()
		this.id          = id
		this.isReference = true
		this._accessors  = []

		const proxy = new Proxy(this, {
			get(target, prop) {
				if (target[prop]) {
					if (typeof target[prop] === 'function') {
						return target[prop].bind(target)
					} else {
						return target[prop]
					}
				} else if (typeof prop == 'string') {
					target._accessors.push(prop)
				}
				return proxy
			}
		})
		return proxy
	}

	get value() {
		return this.puer.DataStore.get(this.id)
	}

	set value(value) {
		this.puer.DataStore.set(this.id, value)
	}

	dereference() {
		let value = this.value
		for (const accessor of this._accessors) {
			console.log('accessor', accessor)
			value = value[accessor]
		}
		return value
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