import Puer       from './class.Puer.js'
import PuerHtmlElement from './class.PuerHtmlElement.js'
import PuerObject from './class.PuerObject.js'
import PuerState  from './class.PuerState.js'
import String     from './library/class.String.js'


class BasePuerComponent extends PuerObject {
	constructor(props, children) {
		super()
		this.id            = null
		this.element       = null
		this.rootComponent = this
		this.parent        = null
		this.children      = children || []
		this.events        = {}
		this.props         = this._processProps(props)
		this.state         = new PuerState(this.invalidate.bind(this))
		this.cssClass      = String.camelToDashedSnake(this.className)

		this._listenerMap  = new WeakMap()

		for (let child of this.children) { child.parent = this }
	}

	/********************** FRAMEWORK **********************/

	__render() {
		this.children && this.children.forEach(child => { child.__render() })
	}

	__onMount() {
		this.children && this.children.forEach(child => { child.__onMount() })
		return this.onMount()
	}

	/*********************** PRIVATE ***********************/

	_addEvents() {
		for (const name in this.events) {
			this._on(name, this.events[name])
		}
	}

	_processProps(props) {
		const _props = {}
		for (const name in props) {
			const value = props[name]
			if (Puer.isFunction(value)) {
				if (!name.startsWith('on')) {
					throw `Non-event function found in props (${name}): event names must start with "on".`
				}
				let eventName = name.substring(2).toLowerCase()
				this.events[eventName] = value
			} else {
				_props[name] = value
			}
		}
		return _props
	}

	_on(name, f, options) {
		let targetComponent = this
		let _f = function(event) {
			event.targetComponent = targetComponent
			return f.call(this, event)
		}
		_f = _f.bind(this.getCustomParent())
		this._listenerMap.set(f, _f)
		this.element.addEventListener(name, _f, options)
	}

	_off(name, f, options) {
		if (this._listenerMap.has(listener)) {
			const _f = this._listenerMap.get(f)
			this.element.removeEventListener(name, _f, options)
			this._listenerMap.delete(f)
		}
	}

	/*********************** GETTERS ***********************/

	getCustomParent() {
		if (this.isCustom()) {
			return this
		} else {
			if (this.parent) {
				return this.parent.getCustomParent()
			}
			return null
		}
	}
	
	/*********************** CASTING ***********************/

	toString() {
		return `${this.className}::${JSON.stringify(this.props)}`
	}

	/********************** PREDICATE **********************/

	isCustom() {
		return false
	}

	/********************** DIRECTIVE **********************/

	invalidate() {
		if (this.parent) {
			this.parent.invalidate()
		}
	}

	/************************ HOOKS ************************/

	onMount() {} // To be defined in child classes
	render() {}  // To be defined in child classes

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

	findAll(selector) {
		return this.element.querySelectorAll(selector)
	}

	find(selector) {
		return this.element.querySelector(selector)
	}

	addCssClass(name) {
		this.element.classList.add(name)
	}

	removeCssClass(name) {
		this.element.classList.remove(name)
	}

	attr(name, value=null) {
		if (value) {
			this.element.addAttribute(name, value)
		}
		return this.element.getAttribute(name)
	}
}

export default BasePuerComponent