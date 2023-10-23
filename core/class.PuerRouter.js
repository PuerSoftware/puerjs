import Puer from './class.Puer.js'


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

	_route(path) {
		// let path = this._getPath(hash)
		console.log(Puer.String.titleDivider(path.join('/'), 50, '-'))
		this.app.__route(path)
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
		this._route(this._getPath())
	}
}

export default PuerRouter