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
			this.routes         = null
			PuerRouter.instance = this
		}
		return PuerRouter.instance
	}

	/********************** PRIVATE ***********************/

	_init() {
		this.routes = new Puer.Route(null, null, true, null, this.getConfig())
	}

	_getHash() {
		let hash = window.location.hash.split('#')[1]
		return hash ? decodeURIComponent(hash) : hash
	}

	_route(hash) {
		this.path = this.routes.getPath(hash)
		console.log('_route', this.path)
		this.app.__route(this.path)
		this.app.__routeChange()
	}

	/*********************** PUBLIC ***********************/

	getConfig() {
		return this.app.getRouteConfig()
	}

	navigate(hash) {
		
		hash = this.routes.updateHash(hash)
		window.location.hash = '#' + hash
	}

	start() {
		this._init()
		this.navigate(this.initialHash || this.routes.getInitialHash())
		window.addEventListener('hashchange', (event) => {
			const hash = this.routes.updateHash(this._getHash(event.newURL))
			this._route(hash)
		})
		this._route(this.initialHash)
	}
}

export default PuerRouter