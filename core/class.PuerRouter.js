import Puer from './class.Puer.js'


class PuerRouter {
	static instance = null

	constructor(app) {
		if (!PuerRouter.instance) {
			this.app            = app
			this._init()
			PuerRouter.instance = this
		}
		return PuerRouter.instance
	}

	/********************** PRIVATE ***********************/

	_init() {
		window.addEventListener('hashchange', (event) => {
			const hash = this._getHash(event.newURL)
			this._route(hash)
		})
		this._route()
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
		let path = this._getPath(hash)
		console.log(Puer.String.titleDivider(path.join('/'), 50, '-'))
		this.app.__route(path)
	}

	/*********************** PUBLIC ***********************/

	navigate(path) {
		window.location.hash = '#' + path
		this.app.__update()
	}

	default(path) {
		if (!this._getHash()) {
			this.navigate(path)
		}
	}
}

export default PuerRouter