import BasePuerComponent from './class.BasePuerComponent.js'


class PuerHtmlElement extends BasePuerComponent {
	constructor(props) {
		super(props)
		if (this.className.startsWith('PuerTag')) {
			this.tagName   = this.className.replace('PuerTag', '').toLowerCase()
			this.chainName = this.tagName
		}
	}

	/********************** FRAMEWORK **********************/

	__render() {
		// console.log('__render', this.id, this.parent)
		this.element = this._renderDom()
		if (this.children) {
			for (const child of this.children) {
				child.instance.__render()
				this.element.appendChild(child.instance.element)
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

	_dereference(prop) {
		if (prop && prop.isGetterFunction) {
			return prop()
		}
		return prop
	}

	_renderDom() {
		const el = document.createElement(this.tagName)
		if (this.props.hasOwnProperty('text')) {
			const p = this._dereference(this.props.text)
			// console.log('_dereference', p, this.props.text.isGetterFunction)
			el.appendChild(document.createTextNode(p))
		}
		for (const prop in this.props) {
			if (prop != 'text') {
				el.setAttribute(prop, this._dereference(this.props[prop]))
			}
		}
		return el
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

export default PuerHtmlElement