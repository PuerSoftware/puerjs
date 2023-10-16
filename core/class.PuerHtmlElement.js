import BasePuerComponent from './class.BasePuerComponent.js'


class PuerHtmlElement extends BasePuerComponent {
	constructor(props, children) {
		super(props, children)
		this.tagName  = this.className.replace('PuerTag', '').toLowerCase()
		this.isCustom = false
	}

	/********************** FRAMEWORK **********************/

	__register(path='PuerApp', index=0) {
		super.__register(path, index)
		this.root = this
        this.children && this.children.forEach((child, index) => {
        	child.parent = this
            child.__register(this.path, index)
        })
        return this
	}

	__render() {
		// console.log('__render', this.id, this.parent)
		this.element = this._renderDom()
		if (this.children) {
			for (const child of this.children) {
				child.__render()
				this.element.appendChild(child.element)
			}
		}
		this._addEvents()
		return this.element
	}

	__update() {
		for (const prop in this.props) {
			this._onPropChange(prop)
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
		if (prop === 'text') {
			this.element.innerHTML = this._dereference(this.props.text) // TODO: make separate component
		} else {
			this.element.setAttribute(prop, this._dereference(this.props[prop]))
		}
	}

	_renderDom() {
		const el = document.createElement(this.tagName)
		if (this.props.text) {
			const p = this._dereference(this.props.text)
			// console.log('_dereference', p, this.props.text.isGetterFunction)
			el.appendChild(document.createTextNode(p))
		}
		// console.log('_renderDom', this.props.toString())
		for (const [prop, value] of this.props) {
			if (prop !== 'text') {
				el.setAttribute(prop, this._dereference(value))
			}
		}
		// console.log('_renderDom.for .. of', el)
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

PuerHtmlElement.prototype.chainName = 'PuerHtmlElement'

export default PuerHtmlElement