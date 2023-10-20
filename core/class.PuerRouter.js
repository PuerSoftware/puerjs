import PuerError from './class.PuerError.js'


class PuerRouter {
	static instance = null

	constructor(app) {
		if (!PuerRouter.instance) {
			this.app            = app
			this.routes         = null
			this.isInitialized  = false
			PuerRouter.instance = this
		}
		return PuerRouter.instance
	}

	getHash(hash=null) {
		hash = hash || window.location.hash
		return hash.split('#')[1] || ''
	}

	setHash(hash) {
		window.location.hash = hash
	}

	getRoutePath(routeName) {
		if (!this.routes) {
			throw new PuerError('Route definition is not provided.', this, 'navigate')
		}
		if (!this.routes[routeName]) {
			throw new PuerError(`Route "${routeName}" is not defined.`, this, 'navigate')
		}
		return this.routes[routeName].path
	}

	onNavigate(path) {
		// console.log('Router.onNavigate()', path, this.routes)
		let activeRouteName = null
		for (const routeName in this.routes) {
			const route = this.routes[routeName]
			if (route.path === path) {
				// console.log('Router.onNavigate() - found path in routes:', path)
				activeRouteName = routeName
				route.component.activate()
			} else {
				route.component.deactivate()
			}
		}
		if (!activeRouteName) {
			throw new PuerError(`No route found matching path "${path}"`, this, 'onNavigate')
		}
	}

	navigate(routeName) {
		//console.log('Router.navigate()', routeName)
		const oldHash = this.getHash()
		const newHash = this.getRoutePath(routeName)

		console.log('Router.navigate() oldHash:', oldHash, 'newHash:', newHash)

		if (oldHash !== newHash) {
			this.setHash(newHash)
			// history.pushState    (null, null, newHash)
		}
		if (!this.isInitialized) {
			this.isInitialized = true
			//console.log('Router.navigate() - Initialized!')
			this.onNavigate(newHash)
		}
	}


	default(routeName) {
		const currentHash = this.getHash()
		if (currentHash === '') {
			this.navigate(routeName)
		}
	}


	define(getRoutes) {
		this.routes = getRoutes(this.app)
		window.addEventListener('hashchange', (event) => {
			const oldHash = this.getHash(event.oldURL)
			const newHash = this.getHash(event.newURL)
			console.log('-------------', newHash, '-------------')
			this.onNavigate(newHash)
		})
		//console.log('Router.define() – Hash Listener attached')
		const currentHash = this.getHash()
		if (currentHash) {
			this.navigate(currentHash)
		}
		return this
	}
}

export default PuerRouter