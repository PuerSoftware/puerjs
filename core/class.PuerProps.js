import Puer      from './class.Puer.js'
import PuerError from './class.PuerError.js'


class PuerProps {
	constructor(props={}, onChange) {
		this._props    = {}
		this._onChange = onChange

		for (const prop in props) {
			if (this._props.hasOwnProperty(prop)) {
				throw new PuerError(`Can not re-define prop "${prop}"`, this, 'constructor')
			} else {
				this._props[prop] = props[prop]
			}
		}

		return new Proxy(this, {
			get(target, prop) {
				switch(prop) {
					case 'default':
						return target.default
					case 'require':
						return target.require
					case 'extractEvents':
						return target.extractEvents
					case 'toString':
						return target.toString
					default:
						return target._props[prop]
				}
			},
			set(target, prop, value) {
				const oldValue = target._props[prop]
				target._props[prop] = value
				if (oldValue !== value) {
					target._onChange(prop, value)
				}
				return true
			}
		})
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

	toString() {
		// return JSON.stringify(this._props)
	}
}

export default PuerProps