class PuerObject {
	constructor() {
		this.classProperties = Object.getOwnPropertyNames(this.constructor.prototype)
		this.className       = this.constructor.name
		this.chainName       = this.className
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
			console.log(`${propName}=${propValue}`, 'in', proto.constructor.name, '?', proto[propName])
			if (proto[propName] === propValue) {
				console.log('yes')
				return true
			}
			console.log('no')
			proto = Object.getPrototypeOf(proto)
		} while (proto !== null)
		return false
	}
}

PuerObject.prototype.chainName = 'PuerObject'

export default PuerObject