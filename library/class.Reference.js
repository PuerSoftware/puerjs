class Reference {
	static $($) { window.$ = $ }

	constructor(dataId) {
		this.dataId      = dataId
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
					// console.log('ORIGINAL', prop, target._accessors)
					const refClone = target.clone()
					refClone._accessors.push(prop)
					// console.log('CLONE', prop, refClone._accessors)
					return refClone
				}
				return proxy
			},
			set(target, prop, value) {
				if (!target[prop] && typeof prop == 'string') {
					let _value = target.rootValue
					for (const accessor of target._accessors) {
						_value = _value[accessor]
					}
					_value[prop] = value
					// target._accessors.push(prop)
					// target._accessors = [] TODO
				}
				return true
			}
		})
		return proxy
	}

	get rootValue() { // root value
		return $.DataStore.get(this.dataId)
	}

	set rootValue(value) { // root value
		$.DataStore.set(this.dataId, value)
	}

	reuse(id) {
		this.dataId = id
		this._accessors = []
	}

	dereference() {
		let value = this.rootValue
		for (const accessor of this._accessors) {
			if (!value) {
				break
			}
			value = value[accessor]
		}
		return value
	}

	clone() {
		const ref =  new Reference(this.dataId)
		for (const accessor of this._accessors) {
			ref._accessors.push(accessor)
		}
		return ref
	}

	// merge(reference) { // TODO: use if will implemented proxy Single Source of Truth
	// 	const owners = $.DataStore.owners
	//
	// 	for (const owner of owners[reference.dataId]) {
	// 		if (!owners[this.dataId].includes(owner)) {
	// 			owners[this.dataId].push(owner)
	// 		}
	// 	}
	// 	$.DataStore.unset(reference.dataId)
	// }

	toString() {
		return JSON.stringify({
			reference : '#' + this.dataId,
			value     : this.rootValue
		})
	}
}

export default Reference