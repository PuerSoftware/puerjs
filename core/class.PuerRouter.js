import Puer            from './class.Puer.js'
import PuerRouteParser from './class.PuerRouteParser.js'
// #home[cargo{param:value}[mail{id:1321321}].system]


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

	_route(hash) {
		const parser = new PuerRouteParser()
		let path = parser.parse(hash)
		// console.log(Puer.String.titleDivider(path.join('/'), 50, '-'))
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
		this._route(this.initialHash)
	}
}

export default PuerRouter