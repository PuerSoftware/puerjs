import $ from './Puer.js'
import {
	// RouteRoot,
	Route,
	RouteParser,
	WaitingQueue
} from '../library/index.js'


export default class PuerRouter {
	static instance = null

	constructor(app) {
		if (!PuerRouter.instance) {
			this.app            = app
			this.query          = {}
			this.queue          = new WaitingQueue(() => { return !$.isRouting})
			// this.initialHash    = this._getHash()
			this.path           = null
			// this.routeRoot      = null
			// this.tree           = null
			PuerRouter.instance = this
		}
		return PuerRouter.instance
	}

	_getMatchingPaths(hashPaths, paths) {
		const matches = {}
		for (const hashPath in hashPaths) {
			for (const path in paths) {
				if (path.includes(hashPath)) {
					matches[path] = paths[path]
				}
			}
		}
		return matches
	}

	_getPathsWithActiveParents(paths) {
		const mathes = {}
		for (const path in paths) {
			if (paths[path].component.isActive) {
				mathes[path] = paths[path]
			}
		}
		return mathes
	}

	_getActivePaths(hashPaths, paths) {
		return this._getPathsWithActiveParents(
			this._getMatchingPaths(hashPaths, paths)
		)
	}

	_activate(paths, activePaths) {
		for (const path in paths) {
			if (activePaths[path]) {
				console.log('activate', path)
				paths[path].component.activate()
			} else {
				console.log('deactivate', path)
				paths[path].component.deactivate()
			}
		}
	}

	navigate(hash, query=null) {
		const hashTree    = new RouteParser(hash).parse()
		const tree        = new Route(this.app)
		const hashPaths   = Route.treeToPaths(hashTree)
		// tree.log()
		// console.log(
		// 	JSON.stringify(hashTree, null, 4)
		// )
		// console.log(
		// 	hashPaths
		// )
		tree._getRoutesByPaths(hashPaths).forEach(route => {
			// console.log(route)
			route.logPath()
		})

		// const paths       = this._treeToPaths(tree)
		// const activePaths = this._getActivePaths(hashPaths, paths)
		// this._activate(paths, activePaths)
		// if (!this.queue.isDone()) {
		// 	this.queue.enqueue(this.navigate, this, [hash, query]).start()
		// } else {

		// 	// hash = this._augmentRoutes(
		// 	// 	this.app.__getRoutingPath(
		// 	// 		new RouteParser().parse(hash)
		// 	// 	)
		// 	// ).toHash()
		// 	const queryString = $.String.toQuery(query)
		// 	query = queryString
		// 		? '?' + queryString
		// 		: ''
		// 	window.location.hash = '#' + hash + query
		// }
	}

// 	/********************** PRIVATE ***********************/

// 	/**
// 	 * Called on hashchange event.
// 	 * @param {HashChangeEvent} e
// 	 * @private
// 	 */
// 	_onHashChange(e) {
// 		let hash = this._getHash(e.newURL)
// 		if (hash) {
// 			// hash = this.routeRoot.updateHash(hash)
// 			// this._route(hash)
// 		} else { // if hash is empty string or undefined /#
// 			// this.navigate(this.routeRoot.getDefaultHash())
// 		}
// 	}

// 	_flattenPath(path, flatPath=null) {
// 		flatPath = flatPath || {}
// 		for (const route of path) {
// 			flatPath[route.name] = route.value
// 			this._flattenPath(route.routes, flatPath)
// 		}
// 		return flatPath
// 	}

// 	_getHash() {
// 		let hash  = window.location.hash.split('#')[1]
// 		let query = ''
// 		if (hash) {
// 			[hash, query] = hash.split('?')
// 			hash          = hash || decodeURIComponent(hash)
// 			query         = $.String.fromQuery(query)
// 		}
// 		this.query = query || {}
// 		return hash
// 	}

// 	_augmentRoutes(routes) {
// 		routes.getRoute = (name, value=null) => {
// 			for (let route of routes) {
// 				if (value) {
// 					if (route.name === name && route.value === value) {
// 						return route
// 					}
// 				} else {
// 					if (route.name === name) {
// 						return route
// 					}
// 				}
// 				route = route.routes.getRoute(name, value)
// 				if (route) {
// 					return route
// 				}
// 			}
// 		}

// 		routes.toHash = () => {
// 			let hashList = []
// 			for (const route of routes) {
// 				let hash = `${route.name}:${route.value}`
// 				let children = route.routes.toHash()
// 				if (children) {
// 					hash += `[${children}]`
// 				}
// 				hashList.push(hash)
// 			}
// 			return hashList.sort().join(',')
// 		}
// 		for (const route of routes) {
// 			this._augmentRoutes(route.routes)
// 		}

// 		return routes
// 	}

// 	_route(hash) {
// 		$.isRouting = true
// 		// this.path = this._augmentRoutes(this.routeRoot.getPath(hash))
// 		this.path = this._augmentRoutes(
// 			this.app.__getRoutingPath(
// 				new RouteParser().parse(hash)
// 			)
// 		)
// 		this.app.__route(this._flattenPath(this.path))
// 		$.isRouting = false
// 		this.app.__routeChange()
// 	}

// 	/*********************** PUBLIC ***********************/

// 	getConfig() {
// 		return this.app.getRouteConfig()
// 	}

// 	hasQueryValue(name, value) {
// 		return this.query[name] === value
// 	}

// 	getQueryValue(name) {
// 		return this.query[name]
// 	}

// 	navigate(hash, query=null) {
// 		if (!this.queue.isDone()) {
// 			this.queue.enqueue(this.navigate, this, [hash, query]).start()
// 		} else {
// 			// hash  = this.routeRoot.updateHash(hash)
// 			// hash = this._augmentRoutes(
// 			// 	this.app.__getRoutingPath(
// 			// 		new RouteParser().parse(hash)
// 			// 	)
// 			// ).toHash()
// 			const queryString = $.String.toQuery(query)
// 			query = queryString
// 				? '?' + queryString
// 				: ''
// 			window.location.hash = '#' + hash + query
// 		}
// 	}

// 	start() {
// 		// this.routeRoot = new RouteRoot(this.getConfig())
// 		this.navigate(this.initialHash || this.routeRoot.getDefaultHash(), this.query)

// 		window.addEventListener('hashchange', this._onHashChange.bind(this))

// 		this._route(this.initialHash || this.routeRoot.getDefaultHash())
// 	}
}
