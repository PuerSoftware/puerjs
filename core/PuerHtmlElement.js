import BasePuerComponent from './BasePuerComponent.js'


class PuerHtmlElement extends BasePuerComponent {
	constructor(props, children) {
		super(props, children)
		this.tagName  = this.className.replace('PuerTag', '').toLowerCase()
		this.isCustom = false

		// Setup tag defaults
		switch (this.tagName) {
			case 'a':
				this.props.default('href', 'javascript:void(0)')
				break
		}
	}

	/*********************** PRIVATE ***********************/

	_setupRoot() {
		this.root = this
	}

	_setupElement() {
		this.element = this._renderElement()
		this.element.setAttribute('id', $.dereference(this.id))
		for (const child of this.children) {
			child.parent = this
			this.element.appendChild(child.element)
		}
	}

	_renderElement() {
		return document.createElement(this.tagName)
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
