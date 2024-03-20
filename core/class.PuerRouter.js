import $ from './class.Puer.js'

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
			this.query          = {}
			this.initialHash    = this._getHash()
			this.path           = null
			this.routeRoot      = null
			PuerRouter.instance = this
		}
		return PuerRouter.instance
	}

	/********************** PRIVATE ***********************/

	_flattenPath(path, flatPath=null) {
		flatPath = flatPath || {}
		for (const route of path) {
			flatPath[route.name] = route.value
			this._flattenPath(route.routes, flatPath)
		}
		return flatPath
	}

	_getHash() {
		let hash  = window.location.hash.split('#')[1]
		let query = ''
		if (hash) {
			[hash, query] = hash.split('?')
			hash          = hash || decodeURIComponent(hash)
			query         = $.String.fromQuery(query)
		}
		this.query = query || {}
		return hash
	}

	_route(hash) {
		this.path = this.routeRoot.getPath(hash)
		if (this.app.__onBeforeRoute(this.path)) {
			$.isRouting = true
			this.app.__route(this._flattenPath(this.path))
			$.isRouting = false
			this.app.__routeChange()
		} else {
			window.history.back()
		}
	}

	/*********************** PUBLIC ***********************/

	getConfig() {
		return this.app.getRouteConfig()
	}

	hasValue(name, value, routes=null) {
		return this.getValue(name, routes || this.path).includes(value)
	}

	getValue(name, routes=null) {
		routes = routes || this.path
		let values = []
		for (const route of routes) {
			if (route.name === name) {
				values.push(route.value)
			}
			values = values.concat(this.getValue(name, route.routes))
		}
		return values
	}

	hasQueryValue(name, value) {
		return this.query[name] === value
	}

	getQueryValue(name) {
		return this.query[name]	
	}

	navigate(hash, query=null) {
		hash  = this.routeRoot.updateHash(hash)
		query = query
			? '?' + $.String.toQuery(query)
			: ''
		window.location.hash = '#' + hash + query
	}

	start() {
		this.routeRoot = new $.RouteRoot(this.getConfig())
		this.navigate(this.initialHash || this.routeRoot.getDefaultHash(), this.query)

		window.addEventListener('hashchange', (event) => {
			let hash = this._getHash(event.newURL)
			if (hash) {
				hash = this.routeRoot.updateHash(hash)
				this._route(hash)
			} else { // if hash is empty string or undefined /#
				this.navigate(this.routeRoot.getDefaultHash())
			}
		})
		this._route(this.initialHash || this.routeRoot.getDefaultHash())
	}
}

export default PuerRouter