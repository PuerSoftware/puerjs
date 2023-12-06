/**************************************************************
{[
	{page: {
		mail: {
			isDefault,
			isActive,
			
			routes: [
				{
					ltab: {
						vessel:
						cargo:
					}
					rtab: {}
				}
			]
		},
		vessel: {
			isDefault,
			isActive
		},
	}}
]}

/**************************************************************/
/**************************************************************/

import RouteParser from './class.RouteParser.js'


class BaseRoute {
	constructor(routes) {
		this.routeSets = {}
		this.addRouteSets(routes)
	}

	addRouteSets(routes) {
		for (const route of routes) {
			this.addRouteSet(route)
		}
		// console.log(this.routeSets)
		for (const name in this.routeSets) {
			const routeSet = this.routeSets[name]
			// console.log(routeSet)
			if (!routeSet.getDefaultRoute()) {
				throw `Default is not registered for RouteSet: "${routeSet.name}"`
			}
		}
	}

	getExistingRoute(name, value) {
		if (this.routeSets[name]) {
			if (this.routeSets[name].routes[value]) {
				return this.routeSets[name].routes[value]
			}
		}
		return null
	}

	getRoute(name, value) {
		if (this.routeSets[name]) {
			let route = this.getExistingRoute(name, value)
			if (!route) {
				route = this.routeSets[name].getActiveRoute() || this.routeSets[name].getDefaultRoute()
			}
			return route
		}
		return null
	}

	addRouteSet(route) {
		if (!this.routeSets[route.name]) {
			this.routeSets[route.name] = new RouteSet(route.name)
		}
		this.routeSets[route.name].addRoute(route)
	}

	_getDefaultHashes() {
		const defaultHashes = []
		for (const name in this.routeSets) {
			const routeSet = this.routeSets[name]
			const defaultRoute = routeSet.getDefaultRoute()
			defaultHashes.push(defaultRoute.getDefaultHash())
		}
		return defaultHashes
	}

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

/**************************************************************/
/**************************************************************/

class RouteRoot extends BaseRoute {
	constructor(routes) {
		super(routes)
		this.isRoot = true
	}

	getDefaultHash() { return this._getDefaultHashes().join(',') }

	getActiveHash() {

	}

	setActivePath(paths) {
		Puer.log('received paths in setActivePath', paths)
		for (const path of paths) {

		}
	}

	updateHash(hash) {
		const paths = new RouteParser().parse(hash)
		this.setActivePath(paths)
		return this.getActiveHash()
	}
}

/**************************************************************/
/**************************************************************/

class RouteSet {
	constructor(name) {
		this.name   = name
		this.routes = {}
	}

	_deactivate() {
		for (const value in this.routes) {
			const route = this.routes[value]
			route.isActive = false
		}
	}

	getDefaultRoute() {
		let defaultRoute = null
		for (const value in this.routes) {
			const route = this.routes[value]
			if (route.isDefault) {
				if (defaultRoute) {
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

	setActivePath(path) {
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

	toObject() {
		const result = {}
		for (const name in this.routes) {
			const route = this.routes[name]
			result[route.value] = route.toObject()
		}
		return result
	}
}

/**************************************************************/
/**************************************************************/

class Route extends BaseRoute {
	constructor(route, parent) {
		super(route.routes)
		this.parentSet = parent
		this.value     = route.value
		this.name      = route.name
		this.isActive  = false
		this.isDefault = route.isDefault
	}

	getDefaultHash() {
		const defaultHashes = this._getDefaultHashes()
		let hash = this.id
		if (defaultHashes.length > 0) {
			hash += `[${defaultHashes.join(',')}]`
		}
		return hash
	}

	get id() { return this.name + ':' + this.value }
}

/**************************************************************/
/**************************************************************/

export default RouteRoot
