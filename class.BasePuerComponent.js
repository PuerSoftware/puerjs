import Puer            from './class.Puer.js'
import PuerHtmlElement from './class.PuerHtmlElement.js'
import PuerObject      from './class.PuerObject.js'
import PuerState       from './class.PuerState.js'
import PuerChain       from './class.PuerChain.js'
import PuerParentChain from './class.PuerParentChain.js'
import String          from './library/class.String.js'


class BasePuerComponent extends PuerObject {
	constructor(props) {
		super()
		this.id              = null
		this.element         = null
		this.rootComponent   = this
		this.parent          = null
		this.children        = []
		this.events          = {}
		this.props           = this._filterProps(props)
		this.state           = new PuerState(this.invalidate.bind(this))
		this.state.wrapState = false
		this.cssClass        = String.camelToDashedSnake(this.className)
		this.shadow          = null
		this.isCustom        = false
		this.render          = Puer.deferrer(this.render, this)
		this.$               = new PuerChain(this)
		this.$$              = new PuerParentChain(this)

		this._listenerMap = new WeakMap()
	}

	/*********************** PRIVATE ***********************/

	_filterProps(props) {
		const _props = {}
		for (const name in props) {
			const value = props[name]
			if (Puer.isFunction(value) && !value.isGetterFunction) {
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

	_addEvents() {
		for (const name in this.events) {
			this._on(name, this.events[name])
		}
	}

	_on(name, f, options) {
		// console.log('_on', name, f)
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
		if (this.isCustom) {
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
		return `${this.className}(${JSON.stringify(this.props).slice(1, -1)})`
	}

	/********************** DIRECTIVE **********************/

	invalidate() {
		if (this.parent) {
			this.parent.invalidate()
		}
	}

	/************************ HOOKS ************************/

	onMount() {} // To be defined in child classes
	render()  {} // To be defined in child classes

	/********************* DOM METHODS *********************/

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