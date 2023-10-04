import BasePuerComponent from './class.BasePuerComponent.js'


class PuerHtmlElement extends BasePuerComponent {
	constructor(props) {
		super(props)
		this.tagName = this.className.replace('Puer', '').toLowerCase()
		this.childInstances = null
	}

	/********************** FRAMEWORK **********************/

	__render() {
		// console.log('__render', this.id, this.parent)
		this.element = this.render()
		if (this.childInstances) {
			for (const childInstance of this.childInstances) {
				childInstance.__render()
				this.element.appendChild(childInstance.element)
			}
		}
		this._addEvents()
		return this.element
	}

	__onMount() {
		this.children && this.children.forEach(child => { child.__onMount() })
		return this.onMount()
	}

	/*********************** PRIVATE ***********************/

	_define() {} // Not defining custom component
	
	/************************ HOOKS ************************/

	render() {
		const el = document.createElement(this.tagName)
		if (this.props.hasOwnProperty('text')) {
			el.appendChild(document.createTextNode(this.props.text))
			delete this.props.text
		}
		for (const prop in this.props) {
			el.setAttribute(prop, this.props[prop])
		}
		return el
	}

	/********************* DOM METHODS *********************/

	append(child) {
		child.parent = this
		this.children.push(child)
		this.invalidate()
	}

	prepend(child) {
		child.parent = this
		this.children.unshift(child)
		this.invalidate()
	}
}

export default PuerHtmlElement