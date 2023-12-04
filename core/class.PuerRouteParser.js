class PuerRouteParser {
	constructor() {
		// const _this = this
		// Object.getOwnPropertyNames(Object.getPrototypeOf(this))
        //     .filter(method => method.startsWith('_parse'))
        //     .forEach(method => {
        //     	const f = this[method]
        //         this[method] = (...args) => {
        //         	this._in(method + ' [' + args.join(', ') + ']')
        //         	let result = f.bind(_this)(...args)
        //         	this._out(method + (result ? ' TRUE' : ' FALSE'))
        //         	return result
        //         }
        //     })
	}

	/********************** PRIVATE ***********************/

	_in(s) {
		// console.log('+ '.repeat(this.indent), '[', s)
		this.indent += 1
	}

	_out(s) {
		this.indent -= 1
		// console.log('- '.repeat(this.indent), ']', s)
	}

	_next() {
		// console.log(this.c)
		this.n ++
		this.c = this.s[this.n]
	}

	_reset(s=null) {
		if (s) {
			this.c = s[0]
		}
		this.s = s
		this.n = 0
		this.a = []

		this.components = this.a
		this.component  = null
		this.indent     = 0
	}

	_error(s) {
		throw Error(s)
	}

	/********************** GETTER ***********************/

	_getAlpha() {
		let s = ''
		while ('abcdefghijklmnopqrstuvwxyz0123456789'.includes(this.c)) {
			s += this.c
			this._next()
		}
		return s
	}

	/********************** PARSER ***********************/

	_parseChar(c) {
		if (this.c === c) {
			this._next()
			return true
		}
		return false
	}

	_parseSpace() {
		while (this.c == ' ') {
			this._next()
		}
		return true
	}

	_parseSbOpen  () { return this._parseChar('[') }
	_parseSbClose () { return this._parseChar(']') }
	_parseCbOpen  () { return this._parseChar('{') }
	_parseCbClose () { return this._parseChar('}') }
	_parseComma   () { return this._parseChar(',') }
	_parseColon   () { return this._parseChar(':') }
	_parseStar    () { return this._parseChar('*') }

	_parseProps() {
		if (this._parseCbOpen()) {
			return true
		}
		return false
	}

	_parseComponent() {
		const componentName = this._getAlpha()
		const component     = this.component

		if (componentName) {
			if (this._parseColon()) {
				const componentValue = this._getAlpha()
				if (componentValue) {
					this.component = {
						name       : componentName,
						value      : componentValue,
						components : []
					}
					let existingIndex = this.components.findIndex(o => o.name === componentName)
					if (existingIndex != -1) {
						this.components[existingIndex] = this.component
					} else {
						this.components.push(this.component)
					}
					if (this._parseSbOpen()) {
						if (this._parseComponents()) {
							if (!this._parseSbClose()) {
								this._error('Missing "]" at the end of components clause')
							}
						}
					}
					this._parseProps()
				}
			}
			this.component = component
			return true
		}
		return false
	}

	_expectNextComponent() {
		this._parseSpace()
		if (this._parseComma()) {
			this._parseSpace()
			return true
		}
		this._parseSpace()
		return false
	}

	_parseComponents() {
		let   result     = false
		const components = this.components
		this.components  = this.component ? this.component.components : this.a
		this._parseSpace()
		while (true) {
			if (this._parseComponent()) {
				result = true
				if (!this._expectNextComponent()) {
					break
				}
			} else if (this._parseStar()) {
				result = true
				this.components.push('*')
				if (!this._expectNextComponent()) {
					break
				}
			}
		}
		this._parseSpace()
		this.components = components
		return result
	}

	/********************** PUBLIC ***********************/

	parse(path) {
		if (path) {
			this._reset(path.toLowerCase())
			this._parseComponents()
			// console.log(JSON.stringify(this.a, null, 4).split('"').join(''))
			return this.a
		}
		return []
	}
}

export default PuerRouteParser