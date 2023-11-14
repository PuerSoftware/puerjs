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
		this.o = {}

		this.stack     = []
		this.component = this.o
		this.indent    = 0
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

	_parseSbOpen() {
		return this._parseChar('[')
	}

	_parseSbClose() {
		return this._parseChar(']')
	}

	_parseCbOpen() {
		return this._parseChar('{')
	}

	_parseCbClose() {
		return this._parseChar('}')
	}

	_parseDot() {
		return this._parseChar('.')
	}

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
			this.component[componentName] = {}
			this.component = this.component[componentName]
			this._parseProps()
			this._parseComponents()
			this.component = component
			return true
		}
		return false
	}

	_parseComponents() {
		if (this._parseSbOpen()) {
			while (this._parseComponent() && this._parseDot()) {
				continue
			}
			if (this._parseSbClose()) {
				return true
			} else {
				throw Error('Missing "]" at the end of components clause')
			}
		} else if (this._parseComponent()) {

			return true
		}
		return false
	}

	/********************** PUBLIC ***********************/

	parse(path) {
		this._reset(path.toLowerCase())
		this._parseComponents()
		return this.o
	}
}

export default PuerRouteParser