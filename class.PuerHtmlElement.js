import BasePuerComponent from './class.BasePuerComponent.js'


class PuerHtmlElement extends BasePuerComponent {
	constructor(props, children) {
		super(props, children)
	}

	_define() {} // Not defining custom component

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