import PuerProxyMap from './class.PuerProxyMap.js'
import PuerError    from './class.PuerError.js'

class PuerProps extends PuerProxyMap {
	constructor(props={}, onChange) {
		super(props, [
			{
				set: (f, prop, value) => {
					const oldValue = this[prop]
					let res = f(prop, value)
					if (this[prop] !== oldValue) {
						onChange(prop, this[prop])
					}
					return res
				}
			}
		])
	}

	default(prop, defaultValue) {
		if (!this.hasOwnProperty(prop)) {
			this[prop] = defaultValue
		}
		return this[prop]
	}

	require(prop) {
		if (!this.hasOwnProperty(prop)) {
			throw new PuerError(`Property ${prop} is required but not set.`, this, 'require');
		}
		return this[prop]
	}

	extractEvents(owner) {
		const events = {}
		for (const prop in this) {
			let value = this[prop]
			if (typeof value === 'function' && prop.startsWith('on')) {
				events[prop.substring(2).toLowerCase()] = value.bind(owner)
				delete this[prop]
			}
		}
		return events
	}

	toObject() {
		return super.toObject()
	}
}

export default PuerProps