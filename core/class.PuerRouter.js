import PuerError from './class.PuerError.js'


class PuerRouter {
	static instance = null

	constructor(app) {
		if (!PuerRouter.instance) {
			this.app           = app
			this.routes        = null
			this.isInitialized = false
		}
		return PuerRouter.instance
	}

	onNavigate(path) {
		console.log('onNavigate', path, this.routes)
		let activeRouteName = null
		for (const routeName in this.routes) {
			const route = this.routes[routeName]
			console.log(routeName, route.path, route.component)
			if (route.path === path) {
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
		console.log('navigate', routeName)
		if (!this.routes) {
			throw new PuerError('Route definition is not provided', this, 'navigate')
		}
		const path = this.routes[routeName].path
		history.replaceState (null, null, path)
		history.pushState    (null, null, path)
		if (!this.isInitialized) {
			this.isInitialized = true
			this.onNavigate(path)
		}
	}


	define(getRoutes) {
		this.routes = getRoutes(this.app)
		window.addEventListener('hashchange', (event) => {
			console.log(`Hash changed to ${event.newURL}`)
			const newHash = event.newURL.split('#')[1]
			this.onNavigate(newHash)
		})
		console.log('Hash Listener attached')
		return this
	}
}

export default PuerRouter