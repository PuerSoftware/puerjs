import $ from './class.Puer.js'


class PuerApp extends $.Component {
    constructor(props, children) {
    	super(props, children)
    	this.__render()
    	this.css('display', 'none')
	}

	__ready() {
		super.__ready()
		$.Router.start()
		this.css('display', 'block') // Display after css has loaded
	}

	__render() {
		super.__render()
		document.body.appendChild(this.element)
		this.__rendered()
		return this.element
	}

	route(path) {
		$.Router.navigate(path)
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

$.define(PuerApp)
export default PuerApp