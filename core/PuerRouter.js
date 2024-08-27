import $ from './Puer.js'
import {
	RouteRoot,
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
			this.initialHash    = this._getHash()
			this.path           = null
			this.routeRoot      = null
			PuerRouter.instance = this
		}
		return PuerRouter.instance
	}

	/********************** PRIVATE ***********************/

	/**
	 * Called on hashchange event.
	 * @param {HashChangeEvent} e
	 * @private
	 */
	_onHashChange(e) {
		let hash = this._getHash(e.newURL)
		if (hash) {
			hash = this.routeRoot.updateHash(hash)
			this._route(hash)
		} else { // if hash is empty string or undefined /#
			this.navigate(this.routeRoot.getDefaultHash())
		}
	}

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
		$.isRouting = true
		this.path = this.routeRoot.getPath(hash)
		this.app.__route(this._flattenPath(this.path))
		$.isRouting = false
		this.app.__routeChange()
	}

	/*********************** PUBLIC ***********************/

	getConfig() {
		return this.app.getRouteConfig()
	}

	hasQueryValue(name, value) {
		return this.query[name] === value
	}

	getQueryValue(name) {
		return this.query[name]
	}

	navigate(hash, query=null) {
		if (!this.queue.isDone()) {
			this.queue.enqueue(this.navigate, this, [hash, query]).start()
		} else {
			console.log(this.app.__getRoutingPath(
				new RouteParser().parse(hash)
			))
			hash  = this.routeRoot.updateHash(hash)
			const queryString = $.String.toQuery(query)
			query = queryString
				? '?' + queryString
				: ''
			window.location.hash = '#' + hash + query
		}
	}

	start() {
		this.routeRoot = new RouteRoot(this.getConfig())
		this.navigate(this.initialHash || this.routeRoot.getDefaultHash(), this.query)

		window.addEventListener('hashchange', this._onHashChange.bind(this))

		this._route(this.initialHash || this.routeRoot.getDefaultHash())
	}
}
