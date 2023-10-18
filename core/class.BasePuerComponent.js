import Puer             from './class.Puer.js'
import PuerProps        from './class.PuerProps.js'
import PuerHtmlElement  from './class.PuerHtmlElement.js'
import PuerObject       from './class.PuerObject.js'
import PuerComponentSet from './class.PuerComponentSet.js'
import PuerApp          from './class.PuerApp.js'


class BasePuerComponent extends PuerObject {
	constructor(props, children) {
		super()
		this.owner        = Puer.owner
		this.id           = null
		this.element      = null
		this.parent       = null
		this.root         = null
		
		this.children     = new PuerComponentSet (children, this._onChildrenChange .bind(this))
		this.props        = new PuerProps        (props,    this._onPropChange     .bind(this))

		this.events       = this.props.extractEvents(this.owner)
		this.cssClass     = Puer.String.camelToDashedSnake(this.className)
		this.isCustom     = false
		this.path         = null
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
				if (chainName === child.chainName) {
					items.push(child)
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
						const childItems = child.getChainDescendants(chainName, false)
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

	_onChildrenChange() {
		console.log(`${this.className}._onChildrenChange`)
		this.__update()
	}

	_onPropChange(prop, oldValue, newValue) {}

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
		return `${this.className}(${this.props.toString()})`
	}

	/************************ HOOKS ************************/

	onReady() {} // To be defined in child classes
	onUpdate() {} // To be defined in child classes
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

	append(component) {
		const element = component.__render()
		component.parent = this
		!this.isCustom && this.children.push(component)
		this.element.appendChild(element)
	}

	prepend(component) {
		const element = component.__render()
		component.parent = this
		!this.isCustom && this.children.unshift(component)
		if (this.element.firstChild) {
			this.element.insertBefore(element, this.element.firstChild)
		} else {
			this.element.appendChild(element)
		}
	}

	remove() {
		this.element.remove()
		if (this.parent.isCustom) {
			this.parent.root = null
		} else {
			const index = this.parent.children.indexOf(this)
			delete this.parent.children[index]
		}
	}
}

BasePuerComponent.prototype.chainName = 'BasePuerComponent'

export default BasePuerComponent