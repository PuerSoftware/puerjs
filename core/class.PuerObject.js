class PuerObject {
	constructor() {
		this.id              = $.String.randomHex(4)
		this.classProperties = Object.getOwnPropertyNames(this.constructor.prototype)
		this.className       = this.constructor.name
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
		if ($.isString(target)) {
			target = new Set(target)
		} else if ($.isObject(target)) {
			target = new Set(target.id)
		} else if ($.isArray(target)) {
			let newTarget = new Set()
			for (const item of target) {
				newTarget = new Set(... newTarget, ... this._getTargetSet(item))
			}
			target = newTarget
		} else if ($.isSet(target)) {
			return target
		} else {
			target = new Set()
		}
		return target
	}

	on(name, f, matchTarget=null) { // matchTarget can be either target or targetName
		matchTarget = this._getTargetSet(matchTarget)
		this.listeners[name] = (...args) => {
			const d = args[0].detail
			if (this.isActiveEventTarget && d.target.isActiveEventTarget) {
				if (matchTarget) {
					const hasMatchTarget = $.Set.intersection(new Set(d.targetName, d.target), matchTarget).size
					if (hasMatchTarget) {
						f.bind(this)(...args)
					}
				} else {
					f.bind(this)(...args)
				}
			}
		}
		$.Events.on(name, this.listeners[name])
	}

	once(name, f) {
		$.Events.once(name, f.bind(this))
	}

	off(name) {
		this.listeners[name] && $.Events.off(name, this.listeners[name])
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