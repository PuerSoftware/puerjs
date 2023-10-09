import Puer             from './class.Puer.js'
import PuerHtmlElement  from './class.PuerHtmlElement.js'
import PuerObject       from './class.PuerObject.js'
import PuerComponentSet from './class.PuerComponentSet.js'
import String           from '../library/class.String.js'
import PuerApp          from './class.PuerApp.js'


class BasePuerComponent extends PuerObject {
	constructor(props, owner) {
		super()
		this.id           = null
		this.element      = null
		this.parent       = null
		this.owner        = owner
		this.children     = []
		this.events       = props.extractEvents(owner)
		this.props        = props
		this.cssClass     = String.camelToDashedSnake(this.className)
		this.shadow       = null
		this.isCustom     = false
		this._listenerMap = new WeakMap()
	}


	/******************** CHAIN GETTERS ********************/


	getImmediateChainDescendants(chainName) {
		let items = []
		if (this.isCustom) {
			if (chainName === this.root.chainName) {
				items.push(this.root)
			}
		} else {
			for (const child of this.children) {
				if (chainName === child.instance.chainName) {
					items.push(child.instance)
				}
			}
		}
		return items
	}

	getChainDescendants(chainName, firstCall=true) {
		let items = []
		if (!firstCall && this.hasPropInProto('chainName', chainName)) {
			items.push(this)
		} else if (this.isCustom) {
			if (chainName === this.root.chainName) {
				items.push(this.root)
			}
			let rootItems = this.root.getChainDescendants(chainName, false)
			if (rootItems) {
				items = items.concat(rootItems)
			}
		} else {
			if (this.children) {
				for (const child of this.children) {
					if (child) {
						const childItems = child.instance.getChainDescendants(chainName, false)
						if (childItems) {
							items = items.concat(childItems)
						}
					}
				}
			} else {
				items = []
			}
		}
		return items
	}

	getChainAncestor(chainName, fistCall=true) {
		let item = fistCall ? this.parent : this
		// console.log('getChainAncestor', this, fistCall)
		if (item.hasPropInProto('chainName', chainName)) {
			return [item]
		} else if (item === Puer.App) {
			return []
		}

		return item.parent === Puer.App
			? []
			: item.parent.getChainAncestor(chainName, false)
	}

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

BasePuerComponent.prototype.chainName = 'BasePuerComponent'

export default BasePuerComponent