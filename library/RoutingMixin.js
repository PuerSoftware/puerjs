export default class RoutingMixin {
	static init(component, data) {
		// initially set to default child routes, than set by child activation
		component._lastActiveChildRoutes = [] // [{name, value}, ...]
		component.props.default('isDefaultRoute', false)
	}

	__route(flatPath, activation) {
		/*
		*  activation can be: -1 0 1
		*  ------ -1  - route parent deactivated
		*  ------- 0  - route parent did not change _isActive
		*  ------- 1  - route parent activated
		*/
		let   hasMatch  = false
		const wasActive = this._isActive

		if (this.props.route) {
			const [routeName, routeValue] = this.props.route.split(':')
			for (const name in flatPath) {
				if (routeName === name) {
					hasMatch = true
					if (routeValue === flatPath[name]) {
						activation = this._isActive ? activation : 1
						this.activate()
						this.onActivate && this.onActivate()
						this._addChildRoutes(this._routingCascade('__route', [flatPath, activation]))
					} else {
						activation = !this._isActive ? 0 : -1
						this.onDeactivate
							? this.onDeactivate()
							: this.deactivate()
						this._addChildRoutes(this._routingCascade('__route', [flatPath, activation]))
					}
				}
			}
		} else {
			if (activation < 0) {
				this.onDeactivate && this.onDeactivate()
			} else if (activation > 0) {
				this.onActivate && this.onActivate()
			}
		}
		if (!hasMatch) {
			this.activate()
			this._addChildRoutes(this._routingCascade('__route', [flatPath, activation]))
		}
		// return last active child if activated
		if (this.props.route) {
			const hasActivated    = this._isActive && this._isActive !== wasActive
			const isActiveDefault = this._isActive && this.props.isDefaultRoute
			if (hasActivated || isActiveDefault) {
				return this.props.route
			}
		}
		return null || this._lastActiveChildRoutes
	}

	/**
	 * Invokes onRoute method with the current path.
	 * Passes the current path to cascade method.
	 */
	__routeChange() {
		this.onRoute && this.onRoute($.Router.path)
		this._cascade('__routeChange', [])
	}

	/**
	 * Completes partial path based on the last active child.
	 *
	 * @param {Array<Object>} paths - Full or partial path.
	 * @param {String} paths[].name - The name of the route.
	 * @param {String} paths[].value - The value of the route.
	 * @param {Array<Object>} paths[].routes - The array of routing paths to traverse.
	 * @param {String} lastActiveChild - The name and value of the last active child route.
	 * @param {String} idnt - The indentation string for the debug console log.
	 * @return {Array<Object>} Full path of the same signature as paths.
	 */
	__getRoutingPath(paths, lastActiveChild, idnt='') {
		// this.props.route && console.log(idnt, this.className, this.props.route, paths)
		let routes = []
		if (this.props.route) {
			if (paths.length) {
				// console.log(idnt, 'if')
				for (const path of paths) {
					const route = `${path.name}:${path.value}`
					if (this.props.route === route) {
						routes.push({
							name   : path.name,
							value  : path.value,
							routes : this._routingCascade('__getRoutingPath', [
								path.routes,
								this._lastActiveChildRoutes,
								idnt + '| '
							]) || []
						})
					}
				}
			} else {
				if (lastActiveChild) {
					const [name, value] = lastActiveChild.split(':')
					routes.push({
						name   : name,
						value  : value,
						routes : this._routingCascade('__getRoutingPath', [
							[{name: name, value: value}],
							lastActiveChild,
							idnt + '| '
						]) || []
					})
				} else {
					// terminal case, last component with route
					const [name, value] = this.props.route.split(':')
					routes.push({
						name   : name,
						value  : value,
						routes : []
					})
				}
			}
		} else {
			routes = this._routingCascade('__getRoutingPath', [
				paths,
				lastActiveChild,
				idnt + '| '
			]) || []
		}
		// this.props.route && console.log(idnt, 'Return:', routes)
		return routes
	}

	__getRelativeRoutingPath(paths, lastActiveChildren, idnt='') {
	}


	_routingCascade(methodName, args=null) {
		args = args || []
		const resultList = []
		for (const child of this._iterChildren()) {
			const result = child[methodName](... args)
			if (Array.isArray(result)) {
				if (result.length) {
					resultList.concat(result)
				}
			} else {
				if (result) {
					resultList.push(result)
				}
			}
		}
		return resultList
	}


	/**
	 * Adds child routes to the last active child routes.
	 *
	 * @param {Array<String>} childRoutes - An array of child routes.
	 * @throws {Error} If a child route is a duplicate.
	 */
	_addChildRoutes(childRoutes) {
		if (childRoutes.length) {
			debugger
		}
		for (const childRoute of childRoutes) {
			const [name, value] = childRoute.split(':')
			if (!this._hasChildRoute(name, value)) {
				this._lastActiveChildRoutes.push({
					name  : name,
					value : value,
				})
			} else {
				throw Error(`Duplicate child route: ${name}:${value} at ${this.className}`)
			}
		}
	}

	/**
	 * Checks if the given route is among the last active routes.
	 *
	 * @param {String} name - The name of the route.
	 * @param {String} value - The value of the route.
	 * @return {Boolean} True if the route is among the last active routes, false otherwise.
	 */
	_hasChildRoute(name, value) {
		for (const route of this._lastActiveChildRoutes) {
			if (route.name === name && route.value === value) {
				return true
			}
		}
		return false
	}

	// getRouteConfig() {
	// 	let config = null
	// 	if (this.props.route) {
	// 		const [name, value] = this.props.route.split(':')
	// 		config = {
	// 			name               : name,
	// 			value              : value,
	// 			className          : this.className,
	// 			isDefault          : this.props.isDefaultRoute,
	// 			isActive           : this.isActive,
	// 			lastActiveChildren : this._lastActiveChildRoutes,
	// 			routes             : []
	// 		}
	// 	}

	// 	const descendants       = this.getDescendants()
	// 	let   descendantConfigs = []

	// 	for (const descendant of descendants) {
	// 		let descendantConfig = descendant.getRouteConfig()
	// 		descendantConfigs = descendantConfigs.concat(descendantConfig)
	// 	}

	// 	if (config) {
	// 		config.routes = descendantConfigs
	// 		descendantConfigs = [config]
	// 	}
	// 	return descendantConfigs
	// }
}
