class PuerRouter {
	constructor(app) {
		this.app    = app
		this.routes = null
	}

	onNavigate(path) {
		for (const [routeName, route] of this.routes) {
			console.log('onNavigate', route)
			if (route.path === path) {
				route.component.activate()
			} else {
				route.component.deactivate()
			}
		}
	}

	navigate(routeName) {
		const path = this.routes[routeName].path
		history.replaceState (null, null, path)
		history.pushState    (null, null, path)
	}

	define(routesFunc, defaultRouteName) {
		this.routes = routesFunc(this.app.root)
		window.addEventListener('hashchange', () => {
			this.onNavigate(window.location.hash)
		})
		this.navigate(defaultRouteName)
	}
}

export default PuerRouter