import RouteParser from './class.RouteParser.js'


class Route {
	static create(routes) {
		routes = Route._validateRoutes(routes, new Set())
		$.log(routes)
		return new Route(null, null, false, null, routes)
	}

	static _makeUnique(routes) {
		const unique = {}
		for (const route of routes) {
			const id = `${route.name}:${route.value}`
			if (unique[id]) {
				if (route.isDefault || unique[id].isDefault) {
					unique[id].isDefault = true
				}
			} else {
				unique[id] = route
			}
		}
		return Object.values(unique)
	}

	static _validateRoutes(routes, crossLevelNames) {
		routes = Route._makeUnique(routes)

		const defaults = new Set()
		const names    = new Set()
		
		for (const route of routes) {
			if (route.isDefault) {
				if (defaults.has(route.name)) {
					throw `$.Route: More than one default is registered for route set "${route.name}"`
				} else {
					defaults.add(route.name)
				}
			}
			if (crossLevelNames.has(route.name)) {
				throw `$.Route: route set name is not unique: "${route.name}"`
			}
			names.add(route.name)
			route.routes = Route._validateRoutes(route.routes, crossLevelNames)
		}
		crossLevelNames = $.Set.union(crossLevelNames, names)
		const nonDefaultNames = $.Set.difference(names, defaults)
		if (nonDefaultNames.size > 0) {
			throw `$.Route: Defaults are not registered for route sets: "${Array.from(nonDefaultNames).join(', ')}"`
		}

		return routes
	}

	constructor(name, value, isDefault=false, parent, routes=[]) {
		$.log(routes)
		this.isRoot    = Boolean(!name && !value && !parent)
		this.name      = name
		this.value     = value
		this.isDefault = isDefault
		this.isActive  = false
		this.routes    = []
		this.parent    = parent

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

	_getLevelHash() {
		for (const child of this.routes) {
			
		}
	}

	_getHash() {
		const path = []
		let   hash = null

		const tree = this._childTree()

		for (const name in tree) {
			for (const child of tree[name]) {
				if (child.isActive) {
				}
				const childHash = child._getHash()
				childHash && path.push(childHash)
		}

		if (this.isActive) {
			hash = this.id 
			if (path.length > 0) {
				hash += `[${path.join(',')}]`
			}
		} else if (this.isDefault && !this.isRoot) {
			hash = this.id 
			if (path.length > 0) {
				hash += `[${path.join(',')}]`
			}
		} else if (this.isRoot) {
			hash = path.join(',')
		}
		return hash
	}

	_childTree(name, value) {
		let tree = {}
		for (const child of this.routes) {
			if (!tree[child.name]) {
				tree[child.name] = {}
			}
			tree[child.name][child.value] = child
		}
		if (name) {
			tree = tree[name]
			if (tree) {
				if (value) {
					return tree[value]
				} else {
					return tree
				}
			}
		}
		return tree
	}

	_selectDefault() {
		for (const child of this.routes) {
			if (child.isDefault) {
				return child
			}
		}
		return null
	}

	_selectActive() {
		for (const child of this.routes) {
			if (child.isActive) {
				return child
			}
		}
		return null
	}

	_activate(activeChild, routes) {
		console.log('_activate', activeChild.id)
		for (const child of activeChild.parent.routes) {
			if (child.name === activeChild.name) {
				child.isActive = (child === activeChild)
				console.log('set active', child.id, child.isActive)
			}
		}
		console.log('done loop')
		activeChild._setActiveChildren(routes)
	}

	_setActiveChildren(routes) {
		let child
		for (const route of routes) {
			let child = this._childTree(route.name, route.value)
			if (child) {
				this._activate(child, route.routes)
			} else {
				child = this._selectActive() || this._selectDefault()
				this._activate(child, routes)
			}
		}
	}

	/*********************** PUBLIC ***********************/

	get id() {
		return `${this.name}:${this.value}`
	}

	updateHash(hash) {
		// ltab:vessel
		const path = this.getPath(hash)
		console.log(`updateHash: ${this.id}`, hash)
		if (this.isRoot) {
			this._setActiveChildren(path)
		}
		$.log('updateHash', this.toObject())
		return this._getHash()
	}

	getPath(hash) {
		const parser = new RouteParser()
		return parser.parse(hash)
	}

	getDefaultHash() { // TODO: check for double defaults and for absent defaults – throw error
		if (!this.isDefault) {
			return false
		}
		const children = []
		for (const child of this.routes) {
			const childRoute = child.getDefaultHash()
			childRoute && children.push(childRoute)
		}
		if (this.isRoot) {
			return children.join(',')
		}
		const routeString = this.id
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