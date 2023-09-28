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
		this.parent   = null
		this.children = children
		this.events   = {}
		this.props    = this._processProps(props)
		this.state    = new PuerState(this.invalidate.bind(this))
		this.cssClass = this.className.replace(/([a-zA-Z])(?=[A-Z])/g, '$1-').toLowerCase()

		for (let n in children) { children[n].parent = this }
	}

	__onMount() {
		this.children && this.children.forEach(child => { child.__onMount() })
		return this.onMount()
	}

	__render() {
		this.children && this.children.forEach(child => { child.__render() })
		this.element = this.render()
		if (!(this.element instanceof Element)) {
			this.element = this.element.render()
		}
		this.element.classList.add(this.cssClass)
		this._addEvents()
		return this.element
	}

	_addEvents() {
		for (const name in this.events) {
			this.element.addEventListener(name, this.events[name])
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

	onMount() {}

	invalidate() {
		if (this.parent) {
			this.parent.invalidate()
		}
	}

	renderChildren() {
		return this.children && this.children.map(child => { return child.element })
	}

	render() {}  // To be defined in child classes

	toString() {
		return `${this.className}::${JSON.stringify(this.props)}`
	}
}

export default BasePuerComponent