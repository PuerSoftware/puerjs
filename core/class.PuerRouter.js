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

	onNavigate(path) {
		console.log('Router.onNavigate()', path, this.routes)
		let activeRouteName = null
		for (const routeName in this.routes) {
			const route = this.routes[routeName]
			if (route.path === path) {
				console.log('Router.onNavigate() - found path in routes:', path)
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
		console.log('Router.navigate()', routeName)
		if (!this.routes) {
			throw new PuerError('Route definition is not provided', this, 'navigate')
		}
		const oldPath = window.location.hash
		const newPath = this.routes[routeName].path

		console.log('Router.navigate() oldPath:', oldPath, 'newPath:', newPath)

		if (oldPath !== newPath) {
			window.location.hash = newPath
			// history.pushState    (null, null, newPath)
		}
		if (!this.isInitialized) {
			this.isInitialized = true
			console.log('Router.navigate() - Initialized!')
			this.onNavigate(newPath)
		}
	}


	define(getRoutes) {
		this.routes = getRoutes(this.app)
		window.addEventListener('hashchange', (event) => {
			const oldHash = event.oldURL.split('#')[1] || ''
			const newHash = event.newURL.split('#')[1] || ''
			console.log(`Router.define() - Hash change detected: ${oldHash} => ${newHash}`)
			this.onNavigate(newHash)
		})
		console.log('Router.define() – Hash Listener attached')
		return this
	}
}

export default PuerRouter