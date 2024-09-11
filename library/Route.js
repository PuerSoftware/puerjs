import RouteParser from './RouteParser.js'


/**
 * Routes manager.
 */
export default class Route {
	static $($) { window.$ = $ }

	/******************************************************************/

	/**
	 * Filter all route paths by given hash path.
	 * @private
	 * @param   {String} hashPath - hash path to filter
	 * @returns {Array<String>} - filtered route paths
	 */
	static _filterPathsByString(hashPath) {
		if (hashPath === '') { return [] }
		const matches = []
		for (const path of Object.keys($.Router.paths)) {
			if (`/${path}`.endsWith(`/${hashPath}`)) {
				matches.push(path)
			}
		}
		return matches
	}

	/**
	 * @private
	 * @param   {Array<String>} paths - route paths to complete with children
	 * @returns {Array<String>}       - complete paths
	 */
	static _getBestChildPaths(paths) {
		let matches = []
		for (const path of paths) {
			const activeChildPaths = $.Router.paths[path]._getActiveAndDefaultChildPaths(true)
			matches = matches.concat(activeChildPaths)
		}
		return [... new Set(matches)]
	}

	/**
	 * @private
	 * @param   {Array<String>} paths             - paths to complete with parents
	 * @param   {Boolean}       [isInitial=false] - whether it is called from the initial hash change
	 * @returns {Array<String>}                   - complete paths
	 */
	static _getBestParentPaths(paths, isInitial=false) {
		let matches = []
		if (!isInitial) {
			for (const path of paths) {
				const route = $.Router.paths[path]
				if (route.parent._isActive) {
					matches.push(path)
				}
			}
		}
		if (matches.length === 0) {
			for (const path of paths) {
				const route = $.Router.paths[path]
				if (route.parent._isDefault) {
					matches = [path]
					break
				}
			}
		}
		return matches
	}

	/**
	 * @private
	 * @param   {String}  hashPath          - singular path from hash
	 * @param   {Boolean} [isInitial=false] - whether it is called from the initial hash change
	 * @returns {Array<String>}             - tree paths that match the hash path
	 */
	static _matchPath(hashPath, isInitial=false) {
		let matches  = Route._filterPathsByString(hashPath)
		$.Router.debugList(`_filterPathsByString("${hashPath}")`, matches)

		if (matches.length > 1) {
			const oldMatches = matches
			matches = Route._getBestParentPaths(matches, isInitial)
			$.Router.debugList(`_getBestParentPaths([${oldMatches.join(', ')}], ${isInitial}) (found more then one path: choosing one by looking at parents)`, matches)
		} else if (matches.length === 1) {
			$.Router.debug(`"${hashPath}" matches has only one path, skipping _getBestParentPaths:\n\t${matches[0]}`)
		} else if (matches.length === 0) {
			return []
		}
		matches = Route._getBestChildPaths(matches)
		$.Router.debugList(`_getBestChildPaths([${matches.join(', ')}]) (Completing paths with children)`, matches)
		return matches
	}

	/**
	 * @private
	 * @param {Array<String>} oldActivePaths - active paths before navigation
	 * @param {Array<String>} newActivePaths - active paths after matching
	 *
	 * @returns {Array<String>} - updated paths to activate
	 */
	static _addPreviouslyActivePaths(oldActivePaths, newActivePaths) {
		const matches = []
		for (const oldActivePath of oldActivePaths) {
			const oldActiveRouteSets = new Set($.Router.paths[oldActivePath]._getRouteSets())
			let   intersects = false
			for (const newActivePath of newActivePaths) {
				const newActiveRouteSets = new Set($.Router.paths[newActivePath]._getRouteSets())
				const commonRouteSets    = newActiveRouteSets.intersection(oldActiveRouteSets)
				if (commonRouteSets.size > 0) {
					intersects = true
					break
				}
			}
			if (!intersects) {
				matches.push(oldActivePath)
			}
		}
		$.Router.debugList('_addPreviouslyActivePaths', matches)
		return newActivePaths.concat(matches)
	}

	/******************************************************************/

	/**
	 * @public
	 * @param   {Array<String>} paths     - route path(s) to generate hash from
	 * @param   {String}        [head=''] - prefix for the generated hash
	 * @returns {String}                  - generated hash string
	 */
	static toHash(paths, head='') {
		if (typeof paths[0] === 'string') {
			paths = paths.map(p => p.replace(/^\/|\/$/g, '').split('/'))
		}

		const tails   = {}
		const results = []

		let tail

		for (const p of paths) {
			if (tail = p.shift()) {
				(tails[tail] = tails[tail] || []).push(p)
			}
		}

		for (const t in tails) {
			results.push(Route.toHash(tails[t], t))
		}
		tail = results.join(',')

		return head
			? head + (
				tail
					? `[${tail}]`
					: ''
				)
			: tail
	}

	/******************************************************************/

	/**
	 * Constructs a new instance of Route.
	 * @class
	 * @param {BasePuerComponent} component  - The component reference associated with the route.
	 * @param {Route}             parentRoute - The parent route.
	 * @prop  {Route}			  parent      - The parent route.
	 * @prop  {BasePuerComponent} component   - The component reference associated with the route.
	 * @prop  {String}            name        - The name of the route.
	 * @prop  {String}            path        - The path of the route.
	 * @prop  {Boolean}           _isDefault  - Whether the route is a default route.
	 * @prop  {Boolean}           _isRouteSet - Whether the route is a route set.
	 * @prop  {Boolean}           _isActive   - Whether the route is an active route.
	 * @prop  {Array<Route>}      routes      - The array of routes.
	 */
	constructor(component, parentRoute=null) {
		this.parent     = parentRoute
		this.component  = component
		this.name       = component.props ? component.props.route : component.name
		this.path       = null

		this._isDefault  = !parentRoute || Boolean(component.props ? component.props.isDefaultRoute : component.isDefault)
		this._isRouteSet = !parentRoute || Boolean(component.props ? component.props.isRouteSet     : component.isRouteSet)
		this._isActive   = !parentRoute || Boolean(component._isActive || component.isActive)

		this.routes     = this._getRoutes(component)
	}

	/******************************************************************/

	/**
	 * Recursively iterates over component tree and/or the routes hash and
	 * constructs a tree of routes.
	 * @private
	 * @param {BasePuerComponent} component - The component to iterate.
	 * @return {Array<Route>}               - The array of routes.
	 */
	_getRoutes(component) {
		let routes = []

		if (component._iterChildren) {  // Iterate component tree
			for (const child of component._iterChildren()) {
				if (child.props.route) {
					routes.push(new Route(child, this))
				} else {
					routes = routes.concat(this._getRoutes(child))
				}
			}
		}
		else if(component.routes) { // Iterate hash paths produced by parser
			for (const child of component.routes) {
				routes.push(new Route(child, this))
			}
		}
		return routes
	}

	/**
	 * @private
	 * @returns {Array<String>} - list of default paths
	*/
	_getDefaultPaths() {
		const paths   = this.getPaths()
		const matches = []

		for (const path of paths) {
			if ($.Router.paths[path].isDefault()) {
				matches.push(path)
			}
		}
		return matches
	}

	/**
	 * @private
	 * @returns {Array<String>} - list of active paths
	*/
	_getActivePaths() {
		const paths   = this.getPaths()
		const matches = []

		for (const path of paths) {
			if ($.Router.paths[path]._isActive) {
				matches.push(path)
			}
		}
		return matches
	}

	/**
	 * @private
	 * @param {Array<String>} [matches=null]- for recursive purposes
	 * @returns {Array<String>} - list of paths for ancestral route sets
	 */
	_getRouteSets(matches = null) {
		matches = matches || []

		if (this.parent) {
			if (this._isRouteSet) {
				matches.push(this.path)
			}
			matches = matches.concat(this.parent._getRouteSets())
		}
		return matches
	}

	/**
	 * Recursively iterates over the routes tree and returns an array of strings
	 * that represent the active and default paths.
	 * @private
	 * @param  {Boolean} [includeSelf=false] - Include the current route into result.
	 * @return {Array<String>}               - The array of active and default paths.
	 */
	_getActiveAndDefaultChildPaths(includeSelf=false) {
		if (this.routes.length === 0) {
			return [this.path]
		}
		let matches = []
		if (this._isActive || includeSelf) {
			for (const route of this.routes) {
				if (route.routes.length) {
					matches = matches.concat(route._getActiveAndDefaultChildPaths())
				} else {
					return [route.path]
				}
			}
		} else if (this._isDefault || this._isRouteSet) {
			for (const route of this.routes) {
				if (route.routes.length) {
					matches = matches.concat(route._getActiveAndDefaultChildPaths())
				} else {
					return [route.path]
				}
			}
		}
		return matches
	}

	/******************************************************************/

	/**
	 * Get the longest paths from hash tree
	 * @public
	 * @param  {?String} path - The base path.
	 * @return {Array<String>} - The array of paths.
	 */
	getPaths(path=null) {
		path = path || ''

		let paths = []

		if (this.routes.length) {
			for (let route of this.routes) {
				const nextPath = path ? `${path}/${route.name}` : route.name
				paths = paths.concat(route.getPaths(nextPath))
			}
		} else {
			return [path]
		}
		return paths
	}

	/**
	 * Get all paths from route tree
	 * @public
	 * @param  {?Array<String>} path  - The base path.
	 * @param  {?Object}        paths - The object of paths.
	 * @return {Object.<String, Route>}
	 */
	getAllPaths(path=null, paths=null) {
		path  = path  || []
		paths = paths || {}
		this.path = path.join('/')

		paths[this.path] = this

		if (this.routes.length) {
			for (let route of this.routes) {
				route.getAllPaths(path.concat([route.name]), paths)
			}
		}
		return paths
	}

	/**
	 * Check if this route is default in the route set.
	 * The route is default if it is default in its own route set and all
	 * its parent routes are default.
	 * @public
	 * @return {Boolean} - True if the route is default, false otherwise.
	 */
	isDefault() {
		if (this.parent) {
			return Boolean((this._isDefault || this._isRouteSet) && this.parent.isDefault())
		}
		return this._isDefault
	}

	/**
	 * Assert that there is only one default route in the route set.
	 * Assert that route set is not set as default.
	 * @public
	 * @throws {Error}
	 */
	assertStructure() {
		const defaults  = []
		const routeSets = []

		for (const route of this.routes) {
			route.assertStructure()
			if (route._isDefault)  { defaults.push(route.name) }
			if (route._isRouteSet) { routeSets.push(route.name) }
			if (route._isDefault && route._isRouteSet) {
				throw Error(`Routing set "${route.name}" can not be set as default.`)
			}
		}
		if (this.routes.length > 0) {
			const defaultsString = defaults.join(', ')
			const routeSetsString = routeSets.join(', ')
			if (defaults.length && routeSets.length) {
				throw Error(`Route sets and defaults can not occupy the same level:
					\n\tDefaults: ${defaultsString}
					\n\tRoute sets: ${routeSetsString}`
				)
			}
			if (!routeSets.length && (defaults.length === 0 || defaults.length > 1)) {
				throw Error(`Routing set must have one and only one default. Found ${defaults.length}:
					\n\t${defaultsString}`
				)
			}
		}
	}

	/**
	 * Match given hash against this route set.
	 * @public
	 * @param  {String}  hash      - The hash to match against.
	 * @param  {Boolean} isInitial - If true, the match is for the initial route.
	 * @return {Array<String>}     - An array of matches.
	 */
	match(hash, isInitial=false) {
		const oldActivePaths = this._getActivePaths()
		$.Router.DEBUG && this.log()
		$.Router.debug(`Matching "${hash}"`)
		const hashTree    = new RouteParser(hash).toTree()
		const hashPaths   = hashTree.getPaths()

		let matches = []

		for (const hashPath of hashPaths) {
			matches = matches.concat(Route._matchPath(hashPath, isInitial))
		}

		if (matches.length === 0) {
			$.Router.debug('No matches found, using default paths')
			matches = this._getDefaultPaths()
			$.Router.debugList('_getDefaultPaths', matches)
		}
		return Route._addPreviouslyActivePaths(oldActivePaths, matches)
	}

	/**
	 * Returns a plain object representation of the route.
	 * @public
	 * @return {Object} - A plain object representation of the route.
	 */
	toObject() {
		return {
			name      : this.name,
			parent    : this.parent ? this.parent.name : '',
			path      : this.path,
			isDefault : this._isDefault,
			isActive  : this._isActive,
			component : this.component.className,
			routes    : this.routes.map(route => route.toObject())
		}
	}

	/**
	 * Returns a string representation of the route.
	 * @public
	 * @return {String} - A string representation of the route.
	 */
	toString() {
		return JSON.stringify(this.toObject(), null, 4)
	}

	/**
	 * Logs a string representation of the route to the console.
	 * @public
	 */
	log(node=null, indent='', last=true) {
		node = node || this

		let style  = node._isDefault  ? 'text-decoration: underline; font-weight:bold;' : ''
		    style += node._isActive   ? 'color: yellow;'                                : ''
		    style += node._isRouteSet ? 'text-decoration: underline; font-weight:bold;' : ''

		let prefix     = indent === '' ? '  ' : last ? '└─ ' : '├─ '
		let name = node.name || 'App'
		let label      = node._isRouteSet ? `[${name}]` : name
		let line       = `%c${indent}${prefix}%c${label}\n`
		let styles     = ['', style]
		let nextIndent = last ? `${indent}    ` : `${indent}│   `
		let newLine, newStyles

		if (node.routes && node.routes.length) {
			node.routes.forEach((child, index, arr) => {
				[newLine, newStyles] = this.log(child, nextIndent, index === arr.length - 1)
				line += newLine
				styles = styles.concat(newStyles)
			})
		}

		if (indent === '') {
			console.log(line, ... styles)
		}
		return [line, styles]
	}
}
