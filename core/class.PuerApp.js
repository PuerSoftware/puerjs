import PuerObject from './class.PuerObject.js'


class PuerApp extends PuerObject {
    constructor(selector) {
    	super()
		this.components  = {}
		this.root        = null
		this.dom         = null
		this.rootElement = document.querySelector(selector)
		this.chainName   = this.className
	}

	init(root) {
		this.root = root
		this.render()
		this.root.parent = this
		this.root.__onReady()
	}

	has(component_id) {
		return this.components.hasOwnProperty(component_id)
	}

	// Is called only once on application init
	render() {
		this.dom = this.root.__render(this.className)
		this.rootElement.innerHTML = null
		this.rootElement.appendChild(this.dom)
	}

	// Is called every time on invalidate
	update() {
		//console.log('update()', this.root.className, this.root.__update)
		this.dom = this.root.__update(this.className)
	}

	toString(root, indent='') {
		s = ''
		root = root || this.root
		s += indent + root.toString() + '\n'
		if (root.isCustom) {
			s += this.toString(root.root, indent + '  ')
		} else {
			for (let child of root.children) {
				s += this.toString(child, indent + '  ')
			}
		}
		return s
	}

	invalidate() {
		// this.update()
	}

	
}

export default PuerApp