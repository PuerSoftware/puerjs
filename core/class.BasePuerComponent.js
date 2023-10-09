import Puer             from './class.Puer.js'
import PuerHtmlElement  from './class.PuerHtmlElement.js'
import PuerObject       from './class.PuerObject.js'
import PuerState        from './class.PuerState.js'
import Puer$Chain       from './class.Puer$Chain.js'
import Puer$$Chain      from './class.Puer$$Chain.js'
import Puer$$$Chain     from './class.Puer$$$Chain.js'
import PuerComponentSet from './class.PuerComponentSet.js'
import String           from '../library/class.String.js'


class BasePuerComponent extends PuerObject {
	constructor(props) {
		super()
		this.id              = null
		this.element         = null
		this.rootComponent   = this
		this.parent          = null
		this.children        = []
		this.events          = props.extractEvents()
		this.props           = props
		this.state           = new PuerState(this.invalidate.bind(this))
		this.state.wrapState = false
		this.cssClass        = String.camelToDashedSnake(this.className)
		this.shadow          = null
		this.isCustom        = false
		this._listenerMap    = new WeakMap()
		
		this.getMethods()
			.filter(method => method.startsWith('render'))
			.map(method => {
				this[method] = Puer.deferrer(this[method], this)
			})
	}


	/******************** CHAIN GETTERS ********************/


	getImmediateDescendants(chainName) {
		let items = []
		if (component.isCustom) {
			if (prop === component.root.chainName) {
				items.push(component.root)
			}
		} else {
			const items = []
			for (const child of component.children) {
				if (prop === child.instance.chainName) {
					items.push(child.instance)
				}
			}
			return items.length ? items : null
		}
		return null
	}

	getDescendants(chainName) {
	}

	getAncestor(chainName) {
	}

	get $   () { return new PuerComponentSet([this]).$   }
	get $$  () { return new PuerComponentSet([this]).$$  }
	get $$$ () { return new PuerComponentSet([this]).$$$ }

	/*********************** PRIVATE ***********************/

	_addEvents() {
		for (const name in this.events) {
			this._on(name, this.events[name])
		}
	}

	_on(name, f, options) {
		let targetComponent = this
		let _f = function(event) {
			event.targetComponent = targetComponent
			return f.call(this, event)
		}
		_f = _f.bind(this.$$$.PuerComponent)
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