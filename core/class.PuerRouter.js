import Puer            from './class.Puer.js'
import PuerRouteParser from './class.PuerRouteParser.js'

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

	_encode(path) {
        return path.map(obj => {
            let routesString = obj.routes && obj.routes.length > 0
                ? `[${this._encode(obj.routes)}]`
                : ''
            return `${obj.name}:${obj.value}${routesString}`
        }).join(',')
    }

	_decode(s) {
		const parser = new PuerRouteParser()
		return parser.parse(s)
	}

	_init(config) {
		this.routes = new Puer.Route(null, null, true, null, this.getConfig())
		this.routes.display()
	}

	_getHash() {
		let hash = window.location.hash.split('#')[1]
		return hash ? decodeURIComponent(hash) : hash
	}

	_route(hash) {
		const path = this._decode(hash)
		this.path = path

		this.app.__route(path)
		this.app.__routeChange()
	}
	/*********************** PUBLIC ***********************/

	getConfig() {
		return this.app.getRouteConfig()
	}

	navigate(hash) {
		let path = this._decode(hash)
		this.routes.setActivePath(path)
		window.location.hash = '#' + this.routes.getHash()
	}

	start() {
		this._init()
		this.navigate(this.initialHash)
		window.addEventListener('hashchange', (event) => {
			let hash = this._getHash(event.newURL)
			this._setActiveRoute(this._decode(hash))
			hash1 = this.routes.getHash()
			console.log(hash1)
			this._route(hash)
			window.location.hash = '#' + hash
		})
		this._route(this.initialHash)
	}
}

export default PuerRouter