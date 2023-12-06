import Puer            from './class.Puer.js'

// page:home[ltab:cargo{param:value}[mail{id:1321321}],rtab:system]

// 1. Implement isDefaultRoute on corresponding level.
//	If no corresponding set member is present, default becomes active and hash reflects that.
// 2. Implement implied "*". If in a member of a route set is present in hash, it remains if not overwritten
// if more than one default is present in a route set, error is thrown
// if no default is set in route set, error is thrown


class PuerRouter {
	static instance = null

	constructor(app) {
		if (!PuerRouter.instance) {
			this.app            = app
			this.initialHash    = this._getHash()
			this.path           = null
			this.routeRoot      = null
			PuerRouter.instance = this
		}
		return PuerRouter.instance
	}

	/********************** PRIVATE ***********************/

	_getHash() {
		let hash = window.location.hash.split('#')[1]
		return hash ? decodeURIComponent(hash) : hash
	}

	_route(hash) {
		this.path = this.routeRoot.getPath(hash)
		this.app.__route(this.path)
		this.app.__routeChange()
	}

	/*********************** PUBLIC ***********************/

	getConfig() {
		return this.app.getRouteConfig()
	}

	navigate(hash) {
		hash = this.routeRoot.updateHash(hash)
		window.location.hash = '#' + hash
	}

	start() {
		this.routeRoot = new Puer.RouteRoot(this.getConfig())
		this.navigate(this.initialHash || this.routeRoot.getDefaultHash())

		window.addEventListener('hashchange', (event) => {
			let hash = this._getHash(event.newURL)
			if (!hash) { // if hash is empty string or undefined
				this.navigate(this.routeRoot.getDefaultHash())
				return
			}
			hash = this.routeRoot.updateHash(hash)
			this._route(hash)
		})
		this._route(this.initialHash || this.routeRoot.getDefaultHash())
	}
}

export default PuerRouter