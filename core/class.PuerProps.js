import PuerError from './class.PuerError.js'


class PuerProps extends Object {
	constructor(props={}) {
		super()
		for (const prop in props) {
			if (this.hasOwnProperty(prop)) {
				throw PuerError(`Can not re-define prop "${prop}"`, this, 'constructor')
			} else {
				this[prop] = props[prop]
			}
		}
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

	extractEvents() {
		const events = {}
		for (const prop in this) {
			const value = this[prop]
			if (typeof value === 'function' && !value.isGetterFunction) {
				if (!prop.startsWith('on')) {
					throw PuerError(
						`Event names must start with "on". Found: "${prop}".`,this, 'filterEvents'
					)
				}
				events[prop.substring(2).toLowerCase()] = value
				delete this[prop]
			}
		}
		return events
	}
}

export default PuerProps