export default class Route {
	static $($) { window.$ = $ }

	static treeToPaths(root, path=null) {
		path = path || []
		if (Array.isArray(root)) {
			root = {
				name   : '',
				routes : root
			}
		}
		let paths = []

		if (root.routes.length) {
			for (let route of root.routes) {
				paths = paths.concat(Route.treeToPaths(route, path.concat([route.name])))
			}
		} else {
			return [path]
		}
		return paths
	}

	/**
	 * Constructs a new instance of Route.
	 *
	 * @param {BasePuerComponent} component - The component reference associated with the route.
	 */
	constructor(component, parentRoute=null) {
		this.parent    = parentRoute
		this.name      = component.props.route
		this.component = component
		this.routes    = this._getRoutes(component)
	}

	_getRoutes(component, parentRoute=null) {
		let routes = []
		for (const child of component._iterChildren()) {
			if (child.props.route) {
				routes.push(new Route(child, this))
			} else {
				routes = routes.concat(this._getRoutes(child, this))
			}
		}
		return routes
	}

	/**
	 * Returns route node corresponding to path.
	 *
	 * @param {Array<String>} path - array of node names.
	 * @returns {Array<Route>}
	 */
	_getRoutesByPath(path, idx=0, isFound=false) {
		let routes = []
		if (this.name === path[idx]) {
			isFound = true
		}

		if (isFound) {
			idx ++
			const theEnd = idx >= path.length || !this.routes.length
			if (theEnd) {
				return [this]
			}
		}

		for (const route of this.routes) {
			routes = routes.concat(
				route._getRoutesByPath(path, idx, isFound)
			)
		}
		return routes
	}

	/**
	 * Returns array route nodes corresponding to paths.
	 *
	 * @param {Array<Array<String>>} hashPaths - array of arrays of node names.
	 * @returns {Array<Route>}
	 */
	_getRoutesByPaths(hashPaths) {
		let routes = []
		for (const path of hashPaths) {
			const childRoutes = this._getRoutesByPath(path)
			routes = routes.concat(childRoutes)
		}
		return Array.from(new Set(routes))
	}

	activateParents(activatedRoutes=null) {
		activatedRoutes = activatedRoutes || []
		this.component.activate()
		activatedRoutes.push(this)
		if (this.parent) {
			this.parent.activateParents(activatedRoutes)
		}
		return activatedRoutes
	}

	activate(hashPaths) {
		const routes = this._getRoutesByPaths(hashPaths)
		console.log(routes)
		// let activatedRoutes = []
		// for (const route of routes) {
		// 	activatedRoutes = activatedRoutes.concat(
		// 		route.activateParents()
		// 	)
		// }
		// return new Set(activatedRoutes)
	}

	/**
	* Collects array of route names from leaf to root
	*
	* @param {Array<String>} path - Array of route names.
	* @returns {Array<String>}
	*/
	getPath(path=null) {
		path = path || []
		if (this.parent) {
			// not root
			path.unshift(this.name)
			path = this.parent.getPath(path)
		}
		return path
	}

	toObject() {
		return {
			name      : this.name,
			parent    : this.parent ? this.parent.name : '',
			component : this.component.className,
			routes    : this.routes.map(route => route.toObject())
		}
	}

	toString() {
		return JSON.stringify(this.toObject(), null, 4)
	}

	log() {
		console.log(this.toString())
	}

	logPath() {
		console.log(this.getPath().join('/'))
	}
}
