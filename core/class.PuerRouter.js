import Puer            from './class.Puer.js'
import PuerRouteParser from './class.PuerRouteParser.js'

// page:home[ltab:cargo{param:value}[mail{id:1321321}],rtab:system]

// 1. Implement isDefaultRoute on corresponding level.
//	If no corresponding set member is present, default becomes active and hash reflects that.
// 2. Implement implied "*". If in a member of a route set is present in hash, it remains if not overwritten
// if more than one default is present in a route set, error is thrown
// if no default is set in route set, error is thrown


class PuerRouter {
	static instance = null

	constructor(app) {
		if (!PuerRouter.instance) {
			this.app            = app
			this.initialHash    = this._getHash()
			this.path           = null
			this.config         = null
			PuerRouter.instance = this
		}
		return PuerRouter.instance
	}

	/********************** PRIVATE ***********************/

	_encode(path) {
        return path.map(obj => {
            let componentsString = obj.components && obj.components.length > 0
                ? `[${this._encode(obj.components)}]`
                : ''
            return `${obj.name}:${obj.value}${componentsString}`
        }).join(',')
    }

	_decode(s) {
		const parser = new PuerRouteParser()
		return parser.parse(s)
	}

	_getDefaults(a) {
		let   names        = new Set()
		let   defaultNames = new Set()
		const defaults     = []

		for (const o of a) {
			names.add(o.name)
			if (defaultNames.has(o.name)) {
				if (o.default) {
					throw `More than one default for "${name}"`
				}
			} else {
				defaultNames.add(o.name)
				defaults.push(o)
			}
		}

		const nonDefaultNames = Puer.Set.difference(names, defaultNames)
		if (nonDefaultNames.size > 0) {
			throw `No default values are set for "${Array.from(nonDefaultNames).join(', ')}"`
		}

		return defaults
	}

	/* Applies relative path object to current path (this.path)	*/
	_apply(newPath, oldPath, config) {
		oldPath = oldPath || this.path
		config  = config  || this.config

		let result       = []
		let resultObj = {}

		console.log('config',  JSON.stringify(config, null, 4))
		console.log('oldPath', JSON.stringify(oldPath, null, 4))
		console.log('newPath', JSON.stringify(newPath, null, 4))

		const defaults = this._getDefaults(config)
		let   nextNewPath = newPath
		let   nextOldPath = oldPath
		let   nextConfig  = null

		for (const defaultObj of defaults) {
			let oldPathObj = null
			let newPathObj = null

			resultObj.name = defaultObj.name
			
			for (newPathObj of newPath) {
				if (newPathObj.name === defaultObj.name) {
					resultObj.value = newPathObj.value
					nextNewPath = newPathObj.components || []
					console.log('moved new path')
					break
				}
			}
			
			for (oldPathObj of oldPath) {
				if (oldPathObj.name === defaultObj.name) {
					if (!resultObj.value) {
						resultObj.value = oldPathObj.value
					}
					nextOldPath = oldPathObj.components || []
					console.log('moved old path')
					break
				}
			}

			if (!resultObj.value) {
				resultObj.value = defaultObj.value
			}
			nextConfig = defaultObj.routes || null

			console.log('RESULT OBJ', JSON.stringify(resultObj, null, 4))

			if (nextConfig) {
				resultObj.components = this._apply(
					nextNewPath,
					nextOldPath,
					nextConfig
				)
				
			} else {
				resultObj.components = []
			}
			result.push(resultObj)
		}

		return result
	}

	_getHash() {
		let hash = window.location.hash.split('#')[1]
		return hash ? decodeURIComponent(hash) : hash
	}

	_route(hash) {
		const path = this._decode(hash)
		this.path = path
		// console.log(Puer.String.titleDivider(path.join('/'), 50, '-'))
		this.app.__route(path)
		this.app.__routeChange()
	}
	/*********************** PUBLIC ***********************/

	getConfig() {
		return this.app.getRouteConfig()
	}

	navigate(hash) {
		// console.log('Navigate:', hash)
		let path = this._decode(hash)
		if (hash != this.initialHash) {
			path = this._apply(path)
			console.log('RESULT:', JSON.stringify(path, null, 4))
		}
		hash = this._encode(path)
		window.location.hash = '#' + hash
		// this.app.__update()
	}

	default(hash) {
		this.initialHash = this.initialHash || hash
	}

	start() {
		this.config = this.getConfig()
		this.navigate(this.initialHash)
		window.addEventListener('hashchange', (event) => {
			const hash = this._getHash(event.newURL)
			this._route(hash)
		})
		this._route(this.initialHash)
	}
}

export default PuerRouter