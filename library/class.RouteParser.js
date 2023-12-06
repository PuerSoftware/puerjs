class RouteParser {
	static ALPHA = 'abcdefghijklmnopqrstuvwxyz0123456789'

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
		if (this.n < this.s.length) {
			this.c = this.s[this.n]
		} else {
			this.c = null
		}
	}

	_reset(s=null) {
		if (s) {
			this.c = s[0]
		}
		this.s = s
		this.n = 0
		this.a = []

		this.routes = this.a
		this.route  = null
		this.indent     = 0
	}

	_error(s) {
		throw Error(s)
	}

	/********************** GETTER ***********************/

	_getAlpha() {
		let s = ''
		while (RouteParser.ALPHA.includes(this.c)) {
			s += this.c
			this._next()
		}
		return s
	}

	_peek() {
		if (this.n + 1 < this.s.length) {
			return this.s[this.n + 1]
		}
		return null
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

	_parseRoute() {
		const routeName = this._getAlpha()
		const route     = this.route

		if (routeName) {
			if (this._parseColon()) {
				const routeValue = this._getAlpha()
				if (routeValue) {
					this.route = {
						name       : routeName,
						value      : routeValue,
						routes : []
					}
					let existingIndex = this.routes.findIndex(o => o.name === routeName)
					if (existingIndex != -1) {
						this.routes[existingIndex] = this.route
					} else {
						this.routes.push(this.route)
					}
					if (this._parseSbOpen()) {
						if (this._parseRoutes()) {
							if (!this._parseSbClose()) {
								this._error('Missing "]" at the end of routes clause')
							}
						}
					}
					this._parseProps()
				}
			}
			this.route = route
			return true
		}
		return false
	}

	_expectNextRoute() {
		this._parseSpace()
		if (this._parseComma()) {
			this._parseSpace()
			if (RouteParser.ALPHA.includes(this._peek())) {
				return true
			}
		}
		this._parseSpace()
		return false
	}

	_parseRoutes() {
		let   result     = false
		const routes = this.routes
		this.routes  = this.route ? this.route.routes : this.a
		this._parseSpace()
		while (true) {
			if (this._parseRoute()) {
				result = true
				if (!this._expectNextRoute()) {
					break
				}
			}
		}
		this._parseSpace()
		this.routes = routes
		return result
	}

	/********************** PUBLIC ***********************/

	parse(path) {
		if (path) {
			this._reset(path.toLowerCase())
			this._parseRoutes()
			// console.log(JSON.stringify(this.a, null, 4).split('"').join(''))
			return this.a
		}
		return []
	}
}

export default RouteParser