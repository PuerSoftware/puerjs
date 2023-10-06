import PuerError from './class.PuerError.js'


class PuerProps {
	constructor(props) {
		props = props || {}
		this.props = props

		return new Proxy(this, {
			get(self, prop) {
				if (typeof self[prop] === 'function') {
					return self[prop].bind(self)
				}
				if (self.props.hasOwnProperty(prop)) {
					console.log('RETURN FROM PROPS', prop, self.props, 'RETURN VALUE:', self.props[prop])
					return self.props[prop]
				} else {
					console.log('NOT DEFINED', prop)
				}
			},
			set(self, prop, value) {
				self.props[prop] = value
				return true
			}
		})
	}

	default(prop, defaultValue) {
		if (!this.props.hasOwnProperty(prop)) {
			this.props[prop] = defaultValue;
		}
		return this.props[prop];
	}

	require(prop) {
		if (!this.props.hasOwnProperty(prop)) {
			throw new PuerError(`Property ${prop} is required but not set.`);
		}
		return this.props[prop];
	}

	[Symbol.iterator]() {
		let properties = Object.keys(this.props)
		let count      = 0
		let isDone     = false

		return {
			next: () => {
				if (count >= properties.length) {
					isDone = true
				}
				const value = this.props[properties[count++]]
				return { done: isDone, value }
			}
		}
	}
}

const myProps = new PuerProps({ key1: 'value1', key2: 'value2' })
console.log('TEST----->', myProps.key1)

export default PuerProps