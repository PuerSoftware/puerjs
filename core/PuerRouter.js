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
	 * For the given paths returns components to activate.
	 * @private
	 * @param   {Array<String>} activePaths - Array of paths
	 * @return  {Set<PuerComponent>}  - Set of active components
	 */
	_getActiveComponents(activePaths) {
		let parents = []
		for (const path of activePaths) {
			parents = parents.concat(this.paths[path].component.getParents())
		}
		return new Set(parents)
	}

	/**
	 * Gets the current hash of the page and parses its query string.
	 * Sets prop query.
	 * @private
	 * @return {String} - The hash value
	 */
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
	 * Updates the current hash and hash query of the page.
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
	 * @private
	 * @param   {String} hash   - The hash to match
	 * @return  {Array<String>} - The matched paths keys
	 */
	_match(hash) {
		this.tree  = new Route(this.app)
		this.paths = this.tree.getAllPaths()
		this.tree.assertDefaults()
		return this.tree.match(hash, !this.isInitialized)
	}

	/**
	 * Activates components of active component set and deactivate others.
	 * Temporarily sets $.isRouting to true.
	 * @private
	 * @param   {Array<String>} paths - The matched paths
	 */
	_route(paths) {
		$.isRouting = true
		this.app.__route(this._getActiveComponents(paths))
		$.isRouting = false
	}

	/**
	 * Tries to route to given hash.
	 * If no route is found, logs a warning and falls back to default route.
	 * If the hash is not normalized, updates the hash.
	 * @private
	 * @param   {String} hash - The hash to route to
	 */
	_engage(hash) {
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

	/**
	 * Listens to hashchange event and routes to the new hash.
	 * @private
	 * @param {Event} e - The hashchange event
	 */
	_onHashChange(e) {
		this._engage(this._getCurrentHash())
	}

	/*********************** PUBLIC ***********************/

	/**
	 * Called from components.
	 * Commands navigation start.
	 * @param {String} hash  - The relative hash to route to
	 * @param {Object} query - The query object to set
	 */
	navigate(hash, query=null) {
		if (!this.queue.isDone()) {
			this.queue.enqueue(this.navigate, this, [hash, query]).start()
		} else {
			this._engage(hash)
		}
	}

	/**
	 * Checks if a query value matches the given value.
	 * @param  {String} name  - The query parameter name
	 * @param  {String} value - The value to check
	 * @return {Boolean}      - True if the value matches
	 */
	hasQueryValue(name, value) {
		return this.query[name] === value
	}

	/**
	 * Returns the value of the given query parameter.
	 * @param  {String} name - The query parameter name
	 * @return {String}      - The value of the query parameter
	 */
	getQueryValue(name) {
		return this.query[name]
	}

	/**
	 * Initializes the router.
	 * Adds the hashchange event listener and navigates to the current hash.
	 * Call this method when application is initialized.
	 */
	start() {
		window.addEventListener('hashchange', this._onHashChange.bind(this))
		const hash = this._getCurrentHash()
		this.navigate(hash)
		this.isInitialized = true
	}
}
