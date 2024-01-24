class Reference {
	static $($) { window.$ = $ }

	constructor(dataId, accessors=null, rootAccessors=null) {
		accessors     = accessors     || []
		rootAccessors = rootAccessors || []

		this.dataId         = dataId
		this.isReference    = true
		this._accessors     = accessors
		this._rootAccessors = rootAccessors

		let reference = $.DataStore.references[dataId][this.accessorKey]
		if (!reference) {
			reference = this._getProxy()
			$.DataStore.references[dataId][this.accessorKey] = reference
		}

		return reference
	}

	_getProxy() {
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
			}
		})
		return proxy
	}

	get rootValue() { // root value
		return $.DataStore.get(this.dataId)
	}

	get accessorKey() {
		return this._rootAccessors.join('.') + '..' + this._accessors.join('.')
	}

	setValue(value) {
		let   object    = this.rootValue
		const accessors = this._rootAccessors.concat(this._accessors)
		if (accessors.length) {
			const almostAllAccessors = accessors.slice()
			const lastAccessor       = almostAllAccessors.pop()
			for (const accessor of almostAllAccessors) {
				if (!object) {
					break
				}
				object = object[accessor]
			}
			object[lastAccessor] = value
		} else {
			$.DataStore.set(this.dataId, value)
		}
	}

	dereference() {
		let   value     = this.rootValue
		const accessors = this._rootAccessors.concat(this._accessors)

		for (const accessor of accessors) {
			if (!value) {
				break
			}
			value = value[accessor]
		}
		return value
	}

	truncate() {
		return new Reference(this.dataId, null, this._rootAccessors.concat(this._accessors))
	}

	clone(extraAccessor) {
		let accessors = null
		if (extraAccessor) {
			accessors = this._accessors.concat([extraAccessor])
		}
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