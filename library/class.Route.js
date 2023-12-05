import RouteParser from './class.RouteParser.js'


class Route {
	constructor(name, value, isDefault=false, parent, routes=[]) {
		this.isRoot    = Boolean(!name && !value && !parent)
		this.name      = name
		this.value     = value
		this.isDefault = isDefault
		this.isActive  = false
		this.routes    = []
		this.parent    = null

		for (const route of routes) {
			this.routes.push(new Route(
				route.name,
				route.value,
				route.isDefault,
				this,
				route.routes
			))
		}
	}

	/********************** PRIVATE ***********************/

	_getHash() {
		const children = []
		for (const child of this.routes) {
			const childRoute = child.getInitialHash()
			childRoute && children.push(childRoute)
		}
		if (this.isRoot) {
			return children.join(',')
		}
		if (!this.isActive) {
			return false
		}
		const routeString = `${this.name}:${this.value}` 
		if (children.length > 0) {
			return `${routeString}[${children.join(',')}]`
		}
		return routeString
	}

	_select(name, value=null) {
		const children = []
		for (const child of this.routes) {
			console.log(`_select |${name}|${value}`, child.name, child.value)
			if (child.name === name) {
				if (value) {
					if (child.value === value) {
						children.push(child)
					}
				} else {
					children.push(child)
				}
			}
		}
		return children
	}

	_setActiveChildren(routes) {
		for (const route of routes) {
			let children = this._select(route.name, route.value)
			if (children.length > 0) {
				for (const child of children) {
					child.isActive = true
					child._setActiveChildren(route.routes)
				}
			} else {
				for (childRoute of this.) {

				}
			}
		}
	}

	/*********************** PUBLIC ***********************/

	updateHash(hash) {
		// ltab:vessel
		const path = this.getPath(hash)
		console.log(`updateHash: ${this.name}:${this.value}`, path)
		if (this.isRoot) {
			this._setActiveChildren(path)
		}
		return this._getHash()
	}

	getPath(hash) {
		const parser = new RouteParser()
		return parser.parse(hash)
	}

	getInitialHash() {
		if (!this.isDefault) {
			return false
		}
		const children = []
		for (const child of this.routes) {
			const childRoute = child.getInitialHash()
			childRoute && children.push(childRoute)
		}
		if (this.isRoot) {
			return children.join(',')
		}
		const routeString = `${this.name}:${this.value}` 
		if (children.length > 0) {
			return `${routeString}[${children.join(',')}]`
		}
		return routeString
	}

	toObject() {
		const children = []
		for (const child of this.routes) {
			children.push(child.toObject())
		}
		let o = {}
		if (this.isRoot) {
			o.isRoot   = true
		} else {
			o = Object.assign(o, {
				name  : this.name,
				value : this.value
			})

			if (this.isActive)  { o.isActive = true }
			if (this.isDefault) { o.isDefault = true }
		}

		return Object.assign(o, {
			routes : children
		})
	}

	toString() {
		return JSON.stringify(this.toObject(), null, 4)
	}

	display() {
		console.log(this.toString())
	}
}

export default Route