import PuerObject from './class.PuerObject.js'
// import PuerComponent from './class.PuerComponent.js'


class PuerApp extends PuerObject {
    constructor(selector) {
    	super()
		this.root        = null
		this.dom         = null
		this.rootElement = document.querySelector(selector)
		this.chainName   = this.className
	}

	init(root) {
		this.root = root
		this.dom  = root.__render(this.className)
		this.rootElement.innerHTML = null
		this.rootElement.appendChild(this.dom)
		this.root.parent = this
		this.root.__onReady()
		this.root.__update()
	}

	toString(root, indent='') {
		let s = ''
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
}

export default PuerApp