class Reference {
	static $($) { window.$ = $ }

	constructor(dataId, accessors=null) {
		accessors = accessors || []

		this.dataId      = dataId
		this.isReference = true
		this._accessors  = accessors

		const reference = $.DataStore.references[dataId][this.accessorKey]
		if (reference) {
			return reference
		}

		const proxy = new Proxy(this, {
			get(target, prop) {
				if (target[prop]) {
					return $.isFunction(target[prop])
						? target[prop].bind(target)
						: target[prop]
				} else if ($.isString(prop)) {
					return target.clone(prop)
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

	get accessorKey() {
		return this._accessors.join('.')
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

	clone(extraAccessor) {
		const accessors = this._accessors.concat([extraAccessor])
		return new Reference(this.dataId, accessors)
	}

	toString() {
		return JSON.stringify({
			reference : '#' + this.dataId,
			value     : this.rootValue
		})
	}
}

export default Reference