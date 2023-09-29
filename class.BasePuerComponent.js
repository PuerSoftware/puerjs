import Puer       from './class.Puer.js'
import PuerObject from './class.PuerObject.js'
import PuerState  from './class.PuerState.js'
import String     from './library/class.String.js'


class BasePuerComponent extends PuerObject {
	constructor(props, children) {
		super()
		this.id       = props.id || String.random(8)
		props.id      = this.id
		this.element  = null
		this.root     = this
		this.parent   = null
		this.children = children || []
		this.events   = {}
		this.props    = this._processProps(props)
		this.state    = new PuerState(this.invalidate.bind(this))
		this.cssClass = String.camelToDashedSnake(this.className)

		this._listenerMap = new WeakMap()

		for (let child of this.children) { child.parent = this }
	}

	__onMount() {
		this.children && this.children.forEach(child => { child.__onMount() })
		return this.onMount()
	}

	__register() {
		let components = {}
		components[this.id] = this
		if (this.children.length) {
			this.children.forEach(child => { 
				components = Object.assign(components, child.__register())
			})
		} 
		
		return components
	}

	__render() {
		this.children && this.children.forEach(child => { child.__render() })
		this.element = this.render()
		if (!(this.element instanceof Element)) {
			this.root    = this.element
			this.element = this.element.render()
		}
		this.element.classList.add(this.cssClass)
		this._addEvents()
		return this.element
	}

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
		let _f = function(event) {
			event.component = this
			return f.call(this, event)
		}
		console.log('_on', this.getCustomParent())
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
 
	onMount() {} // To be defined in child classes

	render() {}  // To be defined in child classes

	invalidate() {
		if (this.parent) {
			this.parent.invalidate()
		}
	}

	toString() {
		return `${this.className}::${JSON.stringify(this.props)}`
	}

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

	isCustom() {
		return false
	}

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
}

export default BasePuerComponent