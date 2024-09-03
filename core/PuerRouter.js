import $ from './Puer.js'
import {
	Route,
	WaitingQueue
} from '../library/index.js'


/**
 * Routing class.
 */
export default class PuerRouter {
	static instance = null

	/**
	 * @class
	 * @param  {PuerApp}                 app   - Puer application instance
	 * @prop   {PuerApp}                 app   - Puer application instance
	 * @prop   {Route}                   tree  - Route tree
	 * @prop   {Object.<String, Route>}  paths - Lookup object for all routes
	 * @prop   {Object.<String, String>} query - Query parameters
	 * @prop   {WaitingQueue}            queue - Waiting queue
	 * @prop   {Boolean}                 isInitialized - Whether the router is initialized
	 * @return {PuerRouter}  - PuerRouter instance
	 */
	constructor(app) {
		if (!PuerRouter.instance) {
			this.app   = app
			this.tree  = null
			this.paths = null
			this.query = {}
			this.queue = new WaitingQueue(() => { return !$.isRouting })
			this.isInitialized = false
			PuerRouter.instance = this
		}
		return PuerRouter.instance
	}

	/********************** PRIVATE ***********************/

	/**
	 * @private
	 * @param   {Array<String>} paths - Array of paths
	 * @return  {Set<PuerComponent>}  - Set of active components
	 */
	_getActiveComponents(paths) {
		let parents = []
		for (const path of paths) {
			parents = parents.concat(this.paths[path].component.getParents())
		}
		return new Set(parents)
	}

	_getCurrentHash() {
		let hash = window.location.hash.split('#')[1]
		let query = ''
		if (hash) {
			[hash, query] = hash.split('?')
			hash = hash || decodeURIComponent(hash)
			query = $.String.fromQuery(query)
		}
		this.query = query || {}
		return hash || ''
	}

	/**
	 * Updates the current hash of the page.
	 * @private
	 * @param   {String} hash  - The hash value
	 * @param   {Object} query - The query string object
	 */
	_updateHash(hash, query) {
		const queryString = $.String.toQuery(query)
		query = queryString
			? '?' + queryString
			: ''
		window.location.hash = '#' + hash + query
	}

	/**
	 * Get all matching absolute paths for the given hash.
	 * 
	 * @private
	 * @param   {String} hash - The hash to match
	 * @return  {Object}      - The matched route
	 */
	_match(hash) {
		this.tree  = new Route(this.app)
		this.paths = this.tree.getAllPaths()
		this.tree.assertDefaults()
		return this.tree.match(hash, !this.isInitialized)
	}

	/**
	 * @private
	 * @param   {Array<String>} paths - The matched paths
	 */
	_route(paths) {
		console.log('_route', paths)
		$.isRouting = true
		this.app.__route(this._getActiveComponents(paths))
		$.isRouting = false
	}

	_foo(hash) {
		let paths = this._match(hash)
		if (paths.length === 0) {
			console.warn(`No path found for "${hash}"`)
			paths = [this.tree.getDefaultPath()]
		}
		const normalizedHash = Route.toHash(paths)
		if (hash === normalizedHash) {
			this._route(paths)
		} else {
			this._updateHash(normalizedHash, this.query)
		}
	}

	_onHashChange(e) {
		this._foo(this._getCurrentHash())
	}

	/*********************** PUBLIC ***********************/

	navigate(hash, query=null) {
		if (!this.queue.isDone()) {
			this.queue.enqueue(this.navigate, this, [hash, query]).start()
		} else {
			this._foo(hash)
		}
	}

	hasQueryValue(name, value) {
		return this.query[name] === value
	}

	getQueryValue(name) {
		return this.query[name]
	}

	start() {
		window.addEventListener('hashchange', this._onHashChange.bind(this))
		const hash = this._getCurrentHash()
		this.navigate(hash)
		this.isInitialized = true
	}
}
