import BasePuerComponent from './class.BasePuerComponent.js'


class PuerHtmlElement extends BasePuerComponent {
	constructor(props, children) {
		super(props, children)
		// console.log('Creating', this.className, props)
	}

	_define() {} // Not defining custom component

	render() {
		let el = document.createElement(this.className.replace('Puer', ''))
		for (const prop in this.props) {
			if (prop !== 'text') {
				el.setAttribute(prop, this.props[prop])
			}
		}
		for (const child of this.children) {
			el.appendChild(child.element)
		}
		if (this.children.length == 0 && this.props['text']) {
			el.innerHTML = this.props['text']
		}
		return el
	}
}

export default PuerHtmlElement