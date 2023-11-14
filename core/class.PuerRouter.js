import Puer from './class.Puer.js'

class _PathParser {
	constructor() {
		this._reset()
	}
	/********************** PRIVATE ***********************/
	_next() {
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

		this.currentComponent = this.o
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
	_parseSbOpen() {
		if (this.c === '[') {
			this._next()
			return true
		}
		return false
	}

	_parseComponent() {
		const componentName = this._getAlpha()
		if (componentName) {
			this.currentComponent[componentName] = {}
			// this.currentComponent = this.currentComponent[componentName]

			return true
		}
		return false
	}

	_parseComponents() {
		if (this._parseSbOpen()) {
			return true
		} else if (this._parseComponent) {
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


class PuerRouter {
	static instance = null

	constructor(app) {
		if (!PuerRouter.instance) {
			this.app            = app
			this.initialHash    = this._getHash()

			PuerRouter.instance = this
		}
		return PuerRouter.instance
	}

	/********************** PRIVATE ***********************/
	_pathEncode(o) {

	}

	_pathDecode(path) {
		const parser = new _PathParser()
		console.log(parser.parse(path))
	}

	_getHash() {
		return window.location.hash.split('#')[1]
	}

	_getPath(hash) {
		hash = hash || this._getHash()
		let levels = []
		if (hash) {
			levels = hash.split('/')
		}
		return levels
	}

	_route(hash) {
		this._pathDecode(hash)
		let path = this._getPath(hash)
		console.log(Puer.String.titleDivider(path.join('/'), 50, '-'))
		this.app.__route(path)
	}

	_routeComponent(c, path) {
		// c.__
	}

	/*********************** PUBLIC ***********************/

	navigate(hash) {
		window.location.hash = '#' + hash
		this.app.__update()
	}

	default(hash) {
		this.initialHash = this.initialHash || hash
	}

	start() {
		this.navigate(this.initialHash)
		window.addEventListener('hashchange', (event) => {
			const hash = this._getHash(event.newURL)
			this._route(hash)
		})
		this._route(this.initialHash)
	}
}

export default PuerRouter