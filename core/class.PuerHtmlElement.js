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
		this._createTextElement()
		this._addEvents()
		return this.element
	}

	__update() {
		if (this.isActive) {
			this.props.touch()
			for (const child of this.children) {
				child.__update()
			}
			this._applyCssProps()
			this.onUpdate()
		}
		// console.log(`${this.className}.__update()`, this.children.length)
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

	/*********************** CASTING ***********************/

	toString() {
		return `${this.tagName}(${this.props.toString()})`
	}
	
	/************************ HOOKS ************************/

	render() {
		return this
	}
}

PuerHtmlElement.prototype.chainName = 'PuerHtmlElement'

export default PuerHtmlElement