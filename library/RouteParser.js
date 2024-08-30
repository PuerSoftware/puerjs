
export default class RouteParser {
	static ALPHA = 'abcdefghijklmnopqrstuvwxyz0123456789_'
	static META  = '[],'
	static VALID_CHARS = RouteParser.ALPHA + RouteParser.META

	/**
	 * Validate that all characters in the route path are valid.
	 * @param {string} hash - route path
	 * @throws {Error} - if the route path contains any invalid characters
	 */
	static validateChars(hash) {
		for (let char of hash) {
			if (!RouteParser.VALID_CHARS.includes(char)) {
				throw Error(`Invalid char "${char}" in "${hash}"`)
			}
		}
	}
	/**
	 * @param {string} hash - route path
	 * @prop {string} s - route path
	 * @prop {string} c - current char
	 * @prop {number} n - current position
	 * @prop {array} a - parsed routes
	 * @prop {array} routes - parsed routes
	 * @prop {object} route - current route
	 * @prop {number} indent - current indent
	 */
	constructor(hash) {
		this.s = hash
		this.c = this.s[0]
		this.n = 0
		this.a = []

		this.routes = this.a
		this.route  = null
		this.indent = 0
	}
	/********************** PRIVATE ***********************/

	_in(s) {
		this.indent += 1
	}

	_out(s) {
		this.indent -= 1
	}

	_next() {
		this.n ++
		if (this.n < this.s.length) {
			this.c = this.s[this.n]
		} else {
			this.c = null
		}
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
	_parseComma   () { return this._parseChar(',') }


	_parseRoute() {
		const routeName = this._getAlpha()
		const route     = this.route

		this._parseSpace()
		if (routeName) {
			this.route = {
				name   : routeName,
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


	/**
	 * Parse route string.
	 * @param {string} [hash] - Route string.
	 * @returns {array<object>} - Parsed route.
	 */
	parse() {
		if (this.s) {
			// this._reset(hash)
			this._parseRoutes()
			return this.a
		}
		return []
	}
}
