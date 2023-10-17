
class PuerChainableSet extends Array {
	constructor(items, onChange, operators) {
		super(... items)

		let operator = null
		let _this    = this

		return new Proxy(this, {
			get: function(target, prop, receiver) {
				if (typeof _this[prop] == 'function') {
					return _this[prop].bind(_this)
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
			}
		})
	}

	toArray() {
		return Array.from(this)
	}

	toString() {
		return '[' + this.toArray().join(', ') + ']'
	}
}


export default PuerChainableSet