import Route from './Route.js'

/**
 * Parse route string and convert it to a tree of routes.
 */
export default class RouteParser {
	static ALPHA = 'abcdefghijklmnopqrstuvwxyz0123456789_'
	static META  = '[],'
	static VALID_CHARS = RouteParser.ALPHA + RouteParser.META

	/**
	 * Validate that all characters in the route path are valid.
	 * @public
	 * @param  {String} hash - route path
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
	 * @class
	 * @param {String} hash   - route path
	 * @prop  {String} s      - route path
	 * @prop  {String} c      - current char
	 * @prop  {Number} n      - current position
	 * @prop  {Array}  a      - parsed routes
	 * @prop  {Array}  routes - parsed routes
	 * @prop  {Object} route  - current route
	 * @prop  {Number} indent - current indent
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

	/**
	 * Increase indent level.
	 * @private
	 */
	_in() {
		this.indent += 1
	}

	/**
	 * Decrease indent level.
	 * @private
	 */
	_out() {
		this.indent -= 1
	}

	/**
	 * Move to next char.
	 * @private
	 */
	_next() {
		this.n ++
		if (this.n < this.s.length) {
			this.c = this.s[this.n]
		} else {
			this.c = null
		}
	}

	/**
	 * Throw an error with given string.
	 * @private
	 * @param  {String} s - Error message
	 * @throws {Error}
	 */
	_error(s) {
		throw Error(s)
	}

	/********************** GETTER ***********************/
	/**
	 * Get all alpha characters from current position and move pointer
	 * to the end of them.
	 * @private
	 * @returns {String} - All alpha characters
	 */
	_getAlpha() {
		let s = ''
		while (RouteParser.ALPHA.includes(this.c)) {
			s += this.c
			this._next()
		}
		return s
	}

	/**
	 * Get next char without moving pointer.
	 * @private
	 * @returns {String|null} - Next char or null if there is no next char.
	 */
	_peek() {
		if (this.n + 1 < this.s.length) {
			return this.s[this.n + 1]
		}
		return null
	}

	/********************** PARSER ***********************/

	/**
	 * Parse given character and move pointer if it matches.
	 * @private
	 * @param   {String} c - Character to parse
	 * @returns {Boolean} - True if character matches, false otherwise
	 */
	_parseChar(c) {
		if (this.c === c) {
			this._next()
			return true
		}
		return false
	}

	/**
	 * Skip space characters and move pointer.
	 * @private
	 * @returns {Boolean} - Always true
	 */
	_parseSpace() {
		while (this.c == ' ') {
			this._next()
		}
		return true
	}

	/**
	 * Parse opening square bracket and move pointer if it matches.
	 * @private
	 * @returns {Boolean} - True if character matches, false otherwise
	 */
	_parseSbOpen  () { return this._parseChar('[') }

	/**
	 * Parse closing square bracket and move pointer if it matches.
	 * @private
	 * @returns {Boolean} - True if character matches, false otherwise
	 */
	_parseSbClose () { return this._parseChar(']') }

	/**
	 * Parse comma and move pointer if it matches.
	 * @private
	 * @returns {Boolean} - True if character matches, false otherwise
	 */
	_parseComma   () { return this._parseChar(',') }

	/**
	 * Parse a route definition.
	 * @private
	 * @returns {Boolean} - True if route definition was parsed, false otherwise
	 */
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

	/**
	 * Check if there is another route definition after the current one.
	 * @private
	 * @returns {Boolean} - True if there is another route definition, false otherwise
	 */
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

	/**
	 * Parse all route definitions.
	 * @private
	 * @returns {Boolean} - True if at least one route definition was parsed, false otherwise
	 */
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
	 * @public
	 * @returns {Array<Object>} - Parsed route.
	 */
	parse() {
		if (this.s) {
			this._parseRoutes()
			return this.a
		}
		return []
	}

	/**
	 * Parse route string and convert it to a tree of routes.
	 * @public
	 * @returns {Route} - Root route of parsed route tree.
	 */
	toTree() {
		return new Route({
			name      : '',
			isActive  : true,
			isDefault : true,
			routes    : this.parse()
		})
	}
}
