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
/**************************************************************/

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
			if (!routeSet.getDefault()) {
				throw `Default is not registered for RouteSet: "${routeSet.name}"`
			}
		}
	}

	addRouteSet(route) {
		if (!this.routeSets[route.name]) {
			this.routeSets[route.name] = new RouteSet(route.name)
		}
		this.routeSets[route.name].addRoute(route)
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

	getDefaultHash() {
		for (const name in this.routeSets) {
			const defaultRoute = this.routeSets[name].getDefault()
		}
	}
}

/**************************************************************/
/**************************************************************/

class RouteRoot extends BaseRoute {
	constructor(routes) {
		super(routes)
		this.isRoot = true
	}

	getDefaultHash() {
		
	}
}

/**************************************************************/
/**************************************************************/

class RouteSet {
	constructor(name) {
		this.name   = name
		this.routes = {}
	}

	getDefault() {
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

	addRoute(route) {
		if (this.routes[route.value]) {
			if (route.isDefault) {
				this.routes[route.value].isDefault = true
			}
		} else {
			this.routes[route.value] = new Route(route)
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
	constructor(route) {
		super(route.routes)
		this.value     = route.value
		this.name      = route.name
		this.isActive  = false
		this.isDefault = route.isDefault
	}

	get id() { return this.name + ':' + this.value }
}

/**************************************************************/
/**************************************************************/

export default RouteRoot
