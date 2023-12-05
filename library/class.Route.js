

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

	_select(name, value=null) {
		const children = []
		for (const child of this.routes) {
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
		console.log(`_setActiveChildren: ${this.name}:${this.value}`, routes)
		for (const route of routes) {
			let children = this._select(route.name, route.value)
			console.log('_setActiveChildren, children:', children)
			for (const child of children) {
				console.log('_setActiveChildren, child:', child)
				child.isActive = true
				child._setActiveChildren(route.routes)
			}
		}
	}

	setActivePath(path) {
		console.log(`setActivePath: ${this.name}:${this.value}`, path)
		if (this.isRoot) {
			this._setActiveChildren(path)
		}
	}

	getHash() {
		const children = []
		for (const child of this.routes) {
			children.push(child.getHash())
		}
		return `${this.name}:${this.value}[${children.join(',')}]`
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