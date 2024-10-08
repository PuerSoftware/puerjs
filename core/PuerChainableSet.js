import $ from './Puer.js'


class PuerChainableSet extends Array {
	constructor(items, onChange, operators) {
		if ($.isNumber(items)) {
			items = Array(items)
		}
		super(... items)

		let operator = null

		return new Proxy(this, {
			get: function(target, prop, receiver) {
				if ($.isFunction(target[prop])) {
					return target[prop].bind(target)
				}
				if (operators) {
					if (operator) {
						let   newItems   = []
						const methodName = operators[operator]
						for (const item of target) {
							newItems = newItems.concat(item[methodName](prop))
						}
						operator = null
						return new PuerChainableSet(newItems, onChange, operators)
					} else if (operators.hasOwnProperty(prop)) {
						operator = prop
						return receiver
					}
				}
				return target[prop]
			},

			set: function(target, prop, value, receiver) {
				const oldValue = target[prop]
				const result   =  Reflect.set(target, prop, value, receiver)

				if (oldValue !== value) {
					onChange && onChange(prop, oldValue, value)
				}
				return result
			},

			deleteProperty: function(target, prop, receiver) {
				if ($.String.isNumeric(prop)) {
					target.splice(parseInt(prop), 1)
					return true
				}
				return false
			}
		})
	}

	filter(callback) {
		const filteredArray = Array.prototype.filter.call(this, callback)
		return new PuerChainableSet(filteredArray, this.onChange, this.operators)
	}

	map(callback) {
		const mappedArray = Array.prototype.map.call(this, callback)
		return new PuerChainableSet(mappedArray, this.onChange, this.operators)
	}

	remove(index) {
		delete this[index]
	}

	toArray() {
		return Array.from(this)
	}

	toString() {
		return '[' + this.toArray().join(', ') + ']'
	}
}


export default PuerChainableSet
