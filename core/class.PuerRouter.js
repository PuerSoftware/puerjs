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
					throw `More than one default for "${o.name}"`
				}
			} else {
				if (o.default) {
					defaultNames.add(o.name)
					defaults.push(o)
				}
			}
		}
		
		const nonDefaultNames = Puer.Set.difference(names, defaultNames)
		if (nonDefaultNames.size > 0) {
			throw `No default values are set for "${Array.from(nonDefaultNames).join(', ')}"`
		}

		return defaults
	}

	_getConfigObjByNameValue(config, name, value) {

	}

	/* Applies relative path object to current path (this.path)	*/
	_apply(newPath, oldPath, config) {
		oldPath = oldPath || this.path || []
		config  = config  || this.config

		let result = []

		Puer.log('newPath', newPath)
		Puer.log('oldPath', oldPath)
		Puer.log('config', config)

		const defaults = this._getDefaults(config)
		let   nextNewPath = newPath
		let   nextOldPath = oldPath
		let   nextConfig  = null

		for (const defaultObj of defaults) {
			let resultObj  = {}
			let oldPathObj = null
			let newPathObj = null

			resultObj.name = defaultObj.name
			resultObj.components = []
			
			for (newPathObj of newPath) {
				if (newPathObj.name === defaultObj.name) {
					resultObj.value = newPathObj.value
					nextNewPath = newPathObj.components || []
					console.log('move new path')
					break
				}
			}
			
			for (oldPathObj of oldPath) {
				if (oldPathObj.name === defaultObj.name) {
					if (!resultObj.value) {
						resultObj.value = oldPathObj.value
					}
					nextOldPath = oldPathObj.components || []
					console.log('move old path')
					break
				}
			}

			if (!resultObj.value) {
				resultObj.value = defaultObj.value
			}
			const nextConfigObj = this._getConfigObjByName(name, config)
			if (nextConfigObj) {
				nextConfig = defaultObj.routes || null
			} else {
				nextConfig = []
			}
			console.log('move config')

			Puer.log('RESULT OBJ', resultObj)

			if (nextConfig) {
				resultObj.components = this._apply(
					nextNewPath,
					nextOldPath,
					nextConfig
				)
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

		this.app.__route(path)
		this.app.__routeChange()
	}
	/*********************** PUBLIC ***********************/

	getConfig() {
		return this.app.getRouteConfig()
	}

	navigate(hash) {
		let path = this._decode(hash)
		
		path = this._apply(path)
		Puer.log('RESULT1:', path)
		hash = this._encode(path)
		window.location.hash = '#' + hash
	}

	start() {
		this.config = this.getConfig()
		this.navigate(this.initialHash)
		window.addEventListener('hashchange', (event) => {
			let hash = this._getHash(event.newURL)
			const path = this._apply(this._decode(hash))
			Puer.log('RESULT2:', path)
			hash = this._encode(path)
			this._route(hash)
			window.location.hash = '#' + hash
		})
		this._route(this.initialHash)
	}
}

export default PuerRouter