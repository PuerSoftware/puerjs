import BasePuerComponent from './class.BasePuerComponent.js'


class PuerHtmlElement extends BasePuerComponent {
	constructor(props, children) {
		super(props, children)
	}

	/********************** FRAMEWORK **********************/

	__render() {
		super.__render()
		if (!this.element) {
			this.element = this.render()
			this._addEvents()
		}
		return this.element
	}

	/*********************** PRIVATE ***********************/

	_define() {} // Not defining custom component
	
	/************************ HOOKS ************************/

	render() {
		this.element = document.createElement(this.className.replace('Puer', '').toLowerCase())
		for (const prop in this.props) {
			if (prop !== 'text') {
				this.element.setAttribute(prop, this.props[prop])
			}
		}
		for (const child of this.children) {
			this.element.appendChild(child.element)
		}
		if (this.children.length == 0 && this.props['text']) {
			this.element.innerHTML = this.props['text']
		}
		return this.element
	}
}

export default PuerHtmlElement