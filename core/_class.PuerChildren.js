class PuerChildren {
	constructor(children = [], onChange) {
		this._children = children
		this._onChange = onChange

		return new Proxy(this, {
			get: (target, prop) => {
				console.log('    PuerChildren PROXY 1', target, prop)
				if (typeof prop === 'symbol') {
					return Reflect.get(target, prop) // Handle Symbol prpsSymbol.iterator, etc
				} else if (typeof target[prop] === 'function') {
					return new Proxy(target[prop], {
						apply: (target, thisArg, args) => {
							console.log('        PuerChildren PROXY 2', target, thisArg, args)
							// console.log('target._children', thisArg._children)
							if (!thisArg) {
								console.log('thisArg is undefined', target, args)
							}
							const oldLength = thisArg._children.length
							const result = Reflect.apply(target, thisArg, args)
							if (oldLength !== thisArg._children.length) {
								console.log(`Array changed! New length: ${thisArg._children.length}`)
								thisArg._onChange(null)
							}
							return result
						}
					})
				} else if (prop === 'length') {
					return target._children.length
				} else if (Number.isInteger(Number(prop))) {
					return target._children[prop]
				} else {
					return Reflect.get(target, prop)
				}
			},

			set: (target, prop, value) => {
				if (Number.isInteger(Number(prop))) {
					const oldLength = target._children.length
					target._children[prop] = value
					if (oldLength !== target._children.length) {
						console.log(`Array changed! New length: ${target._children.length}`)
						target._onChange(value)
					}
					return true
				} else {
					return Reflect.set(target, prop, value)
				}
			}
		})
	}

	[Symbol.iterator]() {
		return this._children[Symbol.iterator]()
	}

	push(...args) {
		return this._children.push(...args)
	}

	shift() {
		return this._children.shift()
	}

	unshift(...args) {
		return this._children.unshift(...args)
	}

	forEach(callback) {
		return this._children.forEach(callback)
	}
}

export default PuerChildren
