import BasePuerComponent from './class.BasePuerComponent.js'


class PuerHtmlElement extends BasePuerComponent {
	constructor(props, children) {
		super(props, children)
		this.tagName  = this.className.replace('PuerTag', '').toLowerCase()
		this.isCustom = false
	}

	/********************** FRAMEWORK **********************/

	__render() {
		this.root = this
		this.element = this._renderElement()
		if (this.children) {
			for (const child of this.children) {
				child.parent = this
				const childElement = child.__render()
				this.element.appendChild(childElement)
			}
		}
		this._addEvents()
		return this.element
	}

	__update() {
		console.log('__update', this.className)
		for (const prop in this.props) {
			this._onPropChange(prop)
		}
		for (const child of this.children) {
			child.__update()
		}
	}

	__onMount() {
		this.children && this.children.forEach(child => { child.__onMount() })
		return this.onMount()
	}

	/*********************** PRIVATE ***********************/

	_define() {} // Not defining custom component

	_dereference(value) {
		if (typeof value === 'function') {
			return value()
		}
		return value
	}

	_onPropChange(prop) {
		super._onPropChange(prop)
		this.element.setAttribute(prop, this._dereference(this.props[prop]))
	}

	_renderElement() {
		const element = document.createElement(this.tagName)
		for (const [prop, value] of this.props) {
			element.setAttribute(prop, this._dereference(value))
		}
		return element
	}
	
	/************************ HOOKS ************************/

	render() {
		return this
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

PuerHtmlElement.prototype.chainName = 'PuerHtmlElement'

export default PuerHtmlElement