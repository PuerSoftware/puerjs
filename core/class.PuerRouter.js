import Puer            from './class.Puer.js'
import PuerRouteParser from './class.PuerRouteParser.js'
// #home[cargo{param:value}[mail{id:1321321}].system]


class PuerRouter {
	static instance = null

	constructor(app) {
		if (!PuerRouter.instance) {
			this.app            = app
			this.initialHash    = this._getHash()
			this.path           = null
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

	/* Applies relative path object to current path (this.path)	*/
	_apply(newPath, path) {
		path = path || this.path
		let result = []
		newPath.forEach(newObj => {
			if (newObj === '*') {
				// Add remaining unmatched elements from path
				path.forEach(pathObj => {
					if (!newPath.some(newP => newP.name === pathObj.name)) {
						result.push(pathObj)
					}
				})
			} else {
				let pathObj = path.find(p => p.name === newObj.name)
				let objToAdd
				if (pathObj) {
					objToAdd = {
						...newObj,
						value: newObj.value,
						components: this._apply(newObj.components, pathObj.components)
					}
				} else {
					objToAdd = newObj
				}
				result.push(objToAdd)
			}
		})
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
	}
	/*********************** PUBLIC ***********************/

	navigate(hash) {
		console.log('Navigate:', hash)
		let path = this._decode(hash)
		if (hash != this.initialHash) {
			path = this._apply(path)
			console.log('RESULT:', JSON.stringify(path, null, 4).split('"').join(''))
		}
		hash = this._encode(path)
		window.location.hash = '#' + hash
		// this.app.__update()
	}

	default(hash) {
		this.initialHash = this.initialHash || hash
	}

	start() {
		this.navigate(this.initialHash)
		window.addEventListener('hashchange', (event) => {
			const hash = this._getHash(event.newURL)
			this._route(hash)
		})
		this._route(this.initialHash)
	}
}

export default PuerRouter