import RouteParser from './RouteParser.js'


class BaseRoute {
	/**
	* Constructs a new instance of BaseRoute.
	*
	* @param {Array<Object>} routes - An array of route objects.
	* @param {string}        routes[].name - The name of the route.
	* @param {string}        routes[].className - The className of the component, that has this route.
	* @param {string}        routes[].value - The value of the route.
	* @param {boolean}       routes[].isDefault - Whether the route is default.
	* @param {Array<Object>} routes[].routes - An array of sub-routes.
	* @param {RouteSet}      parentSet - The parent route set.
	*/
	constructor(routes, parentSet) {
		this.parentSet = parentSet
		this.routeSets = {}
		this.addRouteSets(routes)
		this.assertDefaultRoutes()
	}

	/**
	* Retrieves an array of hashes for the current route sets.
	*
	* @param {boolean} active - Whether to retrieve the active route or the default route.
	* @return {Array<string>} An array of hashes for the current route sets.
	*/
	_getHashes(active=false) {
		const hashes = []
		for (const name in this.routeSets) {
			const routeSet = this.routeSets[name]

			const route = active
				? routeSet.getActiveRoute()
				: routeSet.getDefaultRoute()
			route && hashes.push(route.getHash(active))
		}
		return hashes
	}

	/**
	* Adds multiple route sets to the current route sets.
	*
	* @param {Array<Object>} routes - An array of route objects.
	* @param {string}        routes[].name - The name of the route.
	* @param {string}        routes[].className - The className of the component, that has this route.
	* @param {string}        routes[].value - The value of the route.
	* @param {boolean}       routes[].isDefault - Whether the route is default.
	* @param {Array<Object>} routes[].routes - An array of sub-routes.
	*/
	addRouteSets(routes) {
		for (const route of routes) {
			this.addRouteSet(route)
		}	
	}

	/**
	 * Adds a route set to the current route sets.
	 *
	 * @param {Object} route - The route object to add.
	 * @param {string} route.name - The name of the route.
	 * @param {string} route.className - The className of the component, that has this route.
	 * @param {string} route.value - The value of the route.
	 * @param {boolean} route.isDefault - Whether the route is default.
	 * @param {Array<Object>} route.routes - An array of sub-routes.
	 */
	addRouteSet(route) {
		if (!this.routeSets[route.name]) {
			this.routeSets[route.name] = new RouteSet(route.name, this)
		}
		this.routeSets[route.name].addRoute(route)
	}

	/**
	 * Asserts that a default route is registered for each route set.
	 *
	 * @throws {Error} If a default route is not registered for a route set.
	 */
	assertDefaultRoutes() {
		for (const name in this.routeSets) {
			const routeSet = this.routeSets[name]
			if (!routeSet.getDefaultRoute()) {
				throw `Default is not registered for RouteSet: "${routeSet.name}"`
			}
		}
	}

	findAndActivate(path) {
		const name     = path.name
		const value    = path.value
		const routeSet = this.routeSets[name]
		if (routeSet) {
			const route = routeSet.routes[value]
			if (route) {
				if (path.routes && path.routes.length) {
					route.setActivePath(path.routes)
				} else {
					route.activate()
				}
			}
		} else {
			for (const routeSetName in this.routeSets) {
				const routeSet = this.routeSets[routeSetName]
				for (const routeValue in routeSet.routes) {
					routeSet.routes[routeValue].findAndActivate(path)
				}
			}
		}
	}

	setActivePath(paths) {
		for (const path of paths) {
			this.findAndActivate(path)
		}
	}

	activate() {
		this.parentSet.activateRoute(this.value)
		this.parentSet.parentRoute.activate()
	}

	activateDefaultMissingPaths() {
		for (const routeSetName in this.routeSets) {
			const routeSet = this.routeSets[routeSetName]
			const route    = routeSet.getActiveRoute()
			if (!route) {
				routeSet.getDefaultRoute().isActive = true
			}
			for (const routeValue in routeSet.routes) {
				routeSet.routes[routeValue].activateDefaultMissingPaths()
			}
		}
	}

	/**
	 * Converts the BaseRoute object to a plain JavaScript object.
	 *
	 * @return {Object} A plain JavaScript object representation of the BaseRoute.
	 */
	toObject() {
		const result = {}
		if (this.isDefault) { result.isDefault = true }
		if (this.isActive)  { result.isActive  = true }
		result.routes = {}
		for (const name in this.routeSets) {
			const routeSet = this.routeSets[name]
			result.routes[name] = routeSet.toObject()
		}
		return result
	}
}

class Route extends BaseRoute {
	constructor(route, parentSet) {
		super(route.routes)
		this.parentSet = parentSet
		this.value     = route.value
		this.name      = route.name
		this.isActive  = false
		this.isDefault = route.isDefault
	}

	getHash(active=false) {
		const hashes = this._getHashes(active)
		let hash = this.id
		if (hashes.length > 0) {
			hash += `[${hashes.join(',')}]`
		}
		return hash
	}

	get id() { return this.name + ':' + this.value }
}


export default class RouteRoot extends BaseRoute {
	/**
	* Constructs a new instance of RouteRoot.
	*
	* @param {Array<Object>} routes - An array of route objects.
	* @param {string}        routes[].name - The name of the route.
	* @param {string}        routes[].className - The className of the component, that has this route.
	* @param {string}        routes[].value - The value of the route.
	* @param {boolean}       routes[].isDefault - Whether the route is default.
	* @param {Array<Object>} routes[].routes - An array of sub-routes.
	*/
	constructor(routes) {
		super(routes, null)
		this.isRoot = true
	}

	getDefaultHash () { return this._getHashes(false).join(',') }
	getActiveHash  () { return this._getHashes(true).join(',') }

	getPath(hash) { return new RouteParser().parse(hash) }


	updateHash(hash, config) {
		// view:news view:ad_cargo
		RouteParser.validateChars(hash)
		const paths = this.getPath(hash)
		this.setActivePath(paths)
		this.activateDefaultMissingPaths()
		return this.getActiveHash()
	}

	activate() {}
}


class RouteSet {
	constructor(name, parentRoute) {
		this.name        = name
		this.parentRoute = parentRoute
		this.routes      = {}
	}

	addRoute(route) {
		if (this.routes[route.value]) {
			if (route.isDefault) {
				this.routes[route.value].isDefault = true
			}
		} else {
			this.routes[route.value] = new Route(route, this)
		}
	}

	getDefaultRoute() {
		let defaultRoute = null
		for (const value in this.routes) {
			const route = this.routes[value]
			if (route.isDefault) {
				if (defaultRoute === true) {
					throw `More than one default is registered for RouteSet "${this.name}"`
				} else {
					defaultRoute = route
				}
			}
		}
		return defaultRoute
	}

	getActiveRoute() {
		for (const value in this.routes) {
			if (this.routes[value].isActive) {
				return this.routes[value]
			}
		}
		return null
	}

	activateRoute(activeValue) {
		if (activeValue) {
			for (const value in this.routes) {
				this.routes[value].isActive = (value === activeValue)
			}
		}
	}

	toObject() {
		const result = {}
		for (const name in this.routes) {
			const route = this.routes[name]
			result[route.value] = route.toObject()
		}
		return result
	}
}
