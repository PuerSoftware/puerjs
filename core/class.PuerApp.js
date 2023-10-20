import Puer          from './class.Puer.js'
import PuerComponent from './class.PuerComponent.js'


class PuerApp extends PuerComponent {
    constructor(props, children) {
    	super(props, children)
    	this.__render()
    	this.hide()
		// this.__onReady()
		// this.__update()
	}

	__onReady() {
		super.__onReady()
		this.show()
	}

	__render() {
		super.__render()
		document.body.appendChild(this.element)
		return this.element
	}

	toTreeString(root, indent='') {
		let s = ''
		if (root) {
			s += indent + root.toString() + '\n'
		} else {
			root = this.root
			s += indent + this.toString() + '\n'
		}
		if (root.isCustom) {
			s += this.toTreeString(root.root, indent + '  ')
		} else {
			for (let child of root.children) {
				s += this.toTreeString(child, indent + '  ')
			}
		}
		return s
	}
}

Puer.define(PuerApp)
export default PuerApp