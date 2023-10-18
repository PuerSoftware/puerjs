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
		/*********************************************/
		if ('text' in this.props) {
			this.prepend(text(this.props.text))
		}
		/*********************************************/
		this._addEvents()
		return this.element
	}

	__update() {
		// console.log(`${this.className}.__update()`, this.children.length)
		this.props.touch()
		for (const child of this.children) {
			child.__update()
		}
		this.onUpdate()
	}

	__onReady() {
		this.children && this.children.forEach(child => { child.__onReady() })
		return this.onReady()
	}

	/*********************** PRIVATE ***********************/

	_define() {} // Not defining custom component

	_onPropChange(prop, oldValue, newValue) {
		this.element.setAttribute(prop, newValue)
	}

	_renderElement() {
		const element = document.createElement(this.tagName)
		for (const [prop, value] of this.props) {
			element.setAttribute(prop, this.props.dereference(prop))
		}
		return element
	}
	
	/************************ HOOKS ************************/

	render() {
		return this
	}

}

PuerHtmlElement.prototype.chainName = 'PuerHtmlElement'

export default PuerHtmlElement