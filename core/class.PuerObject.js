class PuerObject {
	constructor() {
		this.id              = $.String.randomHex(4)
		this.classProperties = Object.getOwnPropertyNames(this.constructor.prototype)
		this.className       = this.constructor.name
		this.isPuerObject    = true
		this.listeners       = new WeakMap()
	}

	isInstanceProperty(prop) { return Object.prototype.hasOwnProperty.call(this, prop) }
	isClassProperty(prop)    { return this.classProperties.includes(prop.toString()) }
	isComputedProperty(prop) { return !this.isOwnProperty(prop) && !this.isClassProperty(prop) }

	getProperties() {
		let props = new Set()
		let o     = this
		do {
			Object.getOwnPropertyNames(o).map(item => props.add(item))
		} while ((o = Object.getPrototypeOf(o)))
		return [ ... props.keys()]
	}

	getMethods() {
		return this.getProperties().filter(item => typeof this[item] === 'function')
	}

	hasOwnMethod(method) {
		return this.hasOwnProperty(method) && typeof this[method] === 'function'
	}

	hasProto(className) {
		let proto = this
		do {
			if (proto.hasOwnProperty(propName) && proto.constructor.name === className) {
				return true
			}
		} while (proto && (proto = Object.getPrototypeOf(proto)))
		return false
	}

	hasPropInProto(propName, propValue) {
		let proto = this
		do {
			if (proto[propName] === propValue) {
				return true
			}
			proto = Object.getPrototypeOf(proto)
		} while (proto !== null)
		return false
	}

	getPropsInProto(propName, untilValue=null) {
		let props = []
		let proto = this
		do {
			if (proto.hasOwnProperty(propName) && proto[propName]) {
				props.unshift(proto[propName])
			}
			proto = Object.getPrototypeOf(proto)
			if (proto.hasOwnProperty(propName) && proto[propName] && proto[propName] == untilValue) {
				props.unshift(proto[propName])
				break
			}
		} while (proto !== null)
		return props
	}

	/********************************************************/

	_getTargetSet(target) {
		if (target && target.isReference) {
			target = target.dereference()
		}
		if ($.isString(target)) {
			return new Set([target])
		} else if ($.isPuerObject(target)) {
			return new Set([target.id])
		} else if ($.isArray(target)) {
			let newTarget = new Set()
			for (const item of target) {
				newTarget = $.Set.or(newTarget, this._getTargetSet(item))
			}
			return newTarget
		} else if ($.isSet(target)) {
			return target
		} else {
			return new Set()
		}
	}

	on(name, f, validTargets=null) { // matchTarget can be either target or targetName
		const ts = this._getTargetSet(validTargets)
		const _f = (...args) => {
			let validTargetsSet   = new Set([... ts])
			const detail          = args[0].detail
			const canReceiveEvent = this.isActiveEventTarget && detail.target.isActiveEventTarget
			if (canReceiveEvent) {
				if (validTargetsSet.size) {
					const targets = new Set([detail.targetName, detail.target.id])
					validTargetsSet  = $.Set.and(targets, validTargetsSet)
					if (validTargetsSet.size) {
						f.bind(this)(...args)
					}
				} else {
					f.bind(this)(...args)
				}
			}
		}
		$.Events.on(name, _f, f)
	}

	once(name, f) {
		$.Events.once(name, f.bind(this))
	}

	off(name, f) {
		$.Events.off(name, f)
	}

	trigger(name, data) {
		if (this.isActiveEventTarget) {
			data.target     = this
			data.targetName = this.name || null
			$.Events.trigger(name, data)
		}
	}

	/********************************************************/

	get isActiveEventTarget() {
		return true
	}
}

PuerObject.prototype.chainName = 'PuerObject'

export default PuerObject