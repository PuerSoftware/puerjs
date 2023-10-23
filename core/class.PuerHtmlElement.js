import BasePuerComponent from './class.BasePuerComponent.js'


class PuerHtmlElement extends BasePuerComponent {
	constructor(props, children) {
		super(props, children)
		this.tagName  = this.className.replace('PuerTag', '').toLowerCase()
		this.isCustom = false

		/************************* Govnokod start **************************/
		// TODO: refactor this
		if (this.tagName === 'a') {
			this.props.default('href', 'javascript:void(0);')
		}
		/**************************  Govnokod end ***************o**********/
	}

	/*********************** PRIVATE ***********************/

	_onPropChange(prop, oldValue, newValue) {
		this.element.setAttribute(prop, newValue)
	}

	_setupRoot() {
		this.root = this
	}

	_setupElement() {
		this.element = this._renderElement()
		for (const child of this.children) {
			child.parent = this
			this.element.appendChild(child.element)
		}
	}

	_renderElement() {
		const element = document.createElement(this.tagName)
		for (const [prop, value] of this.props) {
			element.setAttribute(prop, this.props.dereference(prop))
		}
		return element
	}

	/*********************** PUBLIC ***********************/

	toString() {
		return `${this.tagName}(${this.props.toString()})`
	}
	
	render() {
		return this
	}
}

PuerHtmlElement.prototype.chainName = 'PuerHtmlElement'

export default PuerHtmlElement