import $                from './Puer.js'
import PuerProps        from './PuerProps.js'
import PuerObject       from './PuerObject.js'
import PuerComponentSet from './PuerComponentSet.js'


export default class BasePuerComponent extends PuerObject {
	constructor(props, children) {
		super()
		this.owner    = $.owner
		this.id       = props['id'] || this.id
		this.element  = null
		this.parent   = null
		this.root     = null
		this.children = new PuerComponentSet(children, this._onChildrenChange.bind(this))
		this.props    = new PuerProps(props, '_onPropChange', this)

		this.name     = this.props.name || null
		this.events   = this.props.extractEvents(this.owner)
		this.classes  = this.props.pop('classes') || []

		this.jsCode     = this._toCode(this.classes, props, children)
		this.isCustom   = false
		this._isActive  = true
		this._isHidden  = false
		this._isRemoved = false

		this.elementCopy       = null
		this.parentElementCopy = null

		this._listenerMap = new WeakMap()
		this._eventTarget = this

		$.components[this.id] = this

		// this.mixin(RoutingMixin)
	}

	/********************** FRAMEWORK **********************/

	__render() {
		this._setupRoot()
		this._cascade('__render')
		this._setupElement()
		this._createText()
		this.addCssClass(... this.classes.map(c => $.dereference(c)))
		this._addEvents()
		this.onRender && this.onRender()
		return this.root
	}

	__rendered() {
		this._cascade('__rendered')
		this._applyProps()
	}

	__init() {
		this._cascade('__init')
		this.onInit && this.onInit()
	}

	__ready() {
		this._cascade('__ready')
		this.onReady && this.onReady()
	}

	__route(activeComponents) {
		if (activeComponents.has(this)) {
			if (!this._isActive) {
				this.activate()
			}
		} else {
			if (this._isActive) {
				this.deactivate()
			}
		}
		this._cascade('__route', [activeComponents])
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
		if (!item) {
			return []
		} else if (item.hasPropInProto('chainName', chainName)) {
			return [item]
		}

		return !item.parent
			? []
			: item.parent.getChainAncestor(chainName, false)
	}

	get $    () { return new PuerComponentSet([this]).$   }
	get $$   () { return new PuerComponentSet([this]).$$  }
	get $$$  () { return new PuerComponentSet([this]).$$$ }


	/*********************** PRIVATE ***********************/

	_onChildrenChange() {
		// console.log(`${this.className}._onChildrenChange`)
		this._applyProps()
	}

	_onPropChange(prop) {
		this._applyProp(prop)
	}

	_createText() {
		// $.isReferencing = true // TODO
		const value = this.props.text

		if (value) {
			const component = $.text(value)
			const root = this.isCustom
				? this.root
				: this

			component.parent = root
			root.children.push(component)

			component.__render()
			this.element.appendChild(component.element)
		}
	}

	_applyProps() {
		for (const prop in this.props) {
			this._applyProp(prop)
		}
	}

	_applyProp(prop) {
		if (this.element) {

			let value = $.dereference(this.props[prop])
			if (prop.startsWith('css')) {
				const cssProp = $.String.camelToLower(prop.replace(/^css/, ''))
				if ($.isPxCssProp(cssProp) && $.String.isNumeric(String(value))) {
					value = `${value}px`
				}
				this.css(cssProp, value)
			} else if (prop === 'text') {
				const textElement = this.getTextElements()
				if (textElement) {
					textElement.nodeValue = value
				} else {
					if (value) {
						this._createText()
					}
				}
			} else if (typeof value !== 'function' || typeof value !== 'object') {
				if ($.isAttr(prop)) {
					this.setAttribute(prop, value)
				}
			}
		}
	}

	_addEvents() {
		for (const name in this.events) {
			this._on(name, this.events[name])
		}
	}

	_on(name, f, extraDetail) {
		if (!this._eventTarget._listenerMap.has(f)) {
			const targetComponent = this
			let _f = function (event) {
				event.targetComponent = targetComponent
				// event.targetName      = target.props.name || null
				event.extraDetail     = extraDetail
				return f.call(targetComponent, event)
			}
			_f = _f.bind(this.owner)
			this._eventTarget._listenerMap.set(f, _f)
			this._eventTarget.element.addEventListener(name, _f)
		}
	}

	_off(name, f) {
		if (this._eventTarget._listenerMap.has(f)) {
			const _f = this._eventTarget._listenerMap.get(f)
			this._eventTarget.element.removeEventListener(name, _f)
			this._eventTarget._listenerMap.delete(f)
		}
	}

	_trigger(name, data) {
		data = data || {}
		const event = new CustomEvent(name, { detail: data })
		this._eventTarget.element.dispatchEvent(event)
	}

	/**
	 * Call a method on all children components.
	 * @param {string} methodName - Name of the method to call.
	 * @param {Array} [args=null] - Optional arguments to pass to the method.
	 */
	_cascade(methodName, args=null) {
		args = args || []
		for (const child of this._iterChildren()) {
			child[methodName](... args)
		}
	}

	/**
	 * Iterate over children components.
	 * If component is a custom component, yield its root component.
	 * If component is a built-in component, yield its children.
	 * @return {Generator<BasePuerComponent>}
	 */
	*_iterChildren() {
		if (this.isCustom) {
			yield this.root
		} else {
			for (const child of this.children) {
				yield child
			}
		}
	}

	_toCode(classes, props, children) {
		delete props.classes
		const params       = []
		const childrenCode = []
		const propCode     = []
		let value

		if (classes.length) {
			params.push(classes.join(' '))
		}
		for (const prop in props) {
			switch ($.type(props[prop])) {
				case 'undefined':
					value = 'undefined'
					break
				case 'string':
					value = `'${props[prop]}'`
					break
				default:
					value = props[prop].toString()
			}
			propCode.push(`${prop}: ${value}`)
		}
		params.push(`{${propCode.join(', ')}}`)
		for (const child of children) {
			childrenCode.push('\t' + child.jsCode)
		}
		if (childrenCode.length) {
			params.push(`[\n${childrenCode.join('\n')}\n]`)
		}
		return `$.${this.className}(${params.join(', ')})`
	}

	/*********************** CASTING ***********************/

	toString() {
		return `${this.className}(${this.props.toString()})`
	}

	/********************* PREDICATES *********************/

	get isActive() {
		if (!this._isActive) {
			return false
		}
		return this.parent ? this.parent.isActive : true
	}

	get isActiveEventTarget() {
		return !this._isRemoved && this.isActive
	}

	get isHidden() {
		return this.hasCssClass('hidden')
	}

	get computedStyle() {
		return window.getComputedStyle ? getComputedStyle(this.element, null) : this.element.currentStyle
	}

	get height() {
		return parseInt(this.computedStyle.height, 10)
	}

	get width() {
		return parseInt(this.computedStyle.width, 10)
	}

	hasDescendant(component) {
		return component.hasAncestor(this)
	}

	hasAncestor(component) {
		if (this.parent) {
			if (this.parent === component) {
				return true
			} else {
				return this.parent.hasAncestor(component)
			}
		}
		return false
	}

    isDomEventTarget(e) {
        return this.element && this.element.contains(e.target)
    }

	/********************* DIRECTIVES *********************/

	activate() {
		if (!this._isActive) { // TODO: refactor
			if (this.props.route && this.elementCopy) {
				this.element = this.elementCopy
				this.parentElementCopy.appendChild(this.element)
				this.elementCopy = null
			}
			this._isActive   = true
			this.onActivate && this.onActivate()
		}
	}

	deactivate() { // TODO: refactor
		if (this._isActive) {
			if (this.props.route) {
				this.elementCopy = this.element
				this.parentElementCopy = this.element.parentNode
				this.element.remove()
				this.element = null
			}
			this._isActive = false
			this.onDeactivate && this.onDeactivate()
		}
	}

	on(name, f, validTargets=null) {
		validTargets = validTargets || (
			this.props.triggers
				? this._getTargetSet(this.props.triggers[name])
				: null
		)
		super.on(name, f, validTargets)
	}

	as(mixinClass) {
		const handler = {
			get: (target, prop, receiver) => {
				if (prop in mixinClass.prototype) {
					return mixinClass.prototype[prop].bind(target)
				}
				return Reflect.get(target, prop, receiver)
			}
		}
		return new Proxy(this, handler)
	}

	mixin(mixinClass, data=null, overwrite=true) {
		const methods = Object.getOwnPropertyDescriptors(mixinClass.prototype)
		for (let key in methods) {
			if (key !== 'constructor') {
				const descriptor = methods[key]
				if (typeof descriptor.value === 'function') {
					if (this[key] && !overwrite) {
						const original = this[key]
						this[key] = (... args) => {
							descriptor.value.apply(this, args)
							original.apply(this, args)
						}
					} else {
						this[key] = descriptor.value.bind(this)
					}
				} else {
					if (this[key] && !overwrite) {
						throw `Mixin overrides existing property "${this.className}.${key}"`
					} else {
						Object.defineProperty(this, key, descriptor)
					}
				}
			}
		}
		mixinClass.init(this, data || {})
	}

	getDescendants() {
		if (this.isCustom) {
			return [this.root]
		} else {
			return this.children
		}
	}

	getParents() {
		return this.parent
			? [this].concat(this.parent.getParents())
			: [this]
	}

	/********************* DOM METHODS *********************/

	// findAll(selector) {
	// 	return this.element.querySelectorAll(selector)
	// }

	// find(selector) {
	// 	return this.element.querySelector(selector)
	// }

	getTextElements() {
		return Array.from(this.element.childNodes).find(child => child.nodeType === 3)
	}

	addCssClass() {
		this.element.classList.add(... arguments)
	}

	removeCssClass() {
		this.element.classList.remove(... arguments)
	}

	toggleCssClass(...args) {
		let methodName = 'toggle'
		if ($.isBoolean(args.at(-1))) {
			methodName = args.pop()
				? 'add'
				: 'remove'
		}
		for (const c of arguments) {
			c && this.element.classList[methodName](c)
		}
	}

	hasCssClass(c) {
		return this.element.classList.contains(c)
	}

	css(prop, value) {
		let styles = {}
		if (value) {
			styles[prop] = value
			for (let [property, value] of Object.entries(styles)) {
				this.element.style[property] = value
			}
		}
	}

	setAttribute    (name, value) { return this.element.setAttribute(name, value) }
	getAttribute    (name)        { return this.element.getAttribute(name)        }
	removeAttribute (name)        { return this.element.removeAttribute(name)     }

	append(component) {
		if ($.isArray(component)) {
			for (const c of component) {
				this.append(c)
			}
		} else {
			if (!component.element) {
				component.__render()
				component.__init()
				component.__ready()
				component._applyProps()
			}
			component._isRemoved = false
			component.parent     = this.root
			component.owner      = this.owner
			this.root.children.push(component)
			this.element.appendChild(component.element)
		}
	}

	prepend(component) {
		if ($.isArray(component)) {
			for (const c of component) {
				this.prepend(c)
			}
		} else {
			if (!component.element) {
				component.__render()
				component.__init()
				component.__ready()
				component._applyProps()
			}

			component._isRemoved = false
			component.parent     = this.root
			component.owner      = this.owner
			this.root.children.unshift(component)

			if (this.element.firstChild) {
				this.element.insertBefore(component.element, this.element.firstChild)
			} else {
				this.element.appendChild(component.element)
			}
		}
	}

	replace(component) {
		component.__render()
		component.__init()
		component.__ready()
		component._applyProps()

		component.parent = this.parent.root
		component.owner  = this.parent.owner

		const index = this.parent.root.children.indexOf(this)
		if (index >= 0) {
			this.parent.root.children[index] = component
			this.element.parentNode.replaceChild(component.element, this.element)
		} else {
			throw 'Cannot replace component - not found'
		}
		this.remove()
	}

	remove() {
		this.onBeforeRemove && this.onBeforeRemove()
		this.element.remove()

		if (this.parent.isCustom) {
			this.parent.root = null
		} else {
			const index = this.parent.children.indexOf(this)
			if (index >= 0) {
				delete this.parent.children[index]
			}
		}
		this._isRemoved = true
		this.id && delete $.components[this.id]
	}

	removeChildren() {
		while (this.root.children.length) {
			this.root.children[0].remove()
		}
	}

	hide() {
		this.addCssClass('hidden')
	}

	show(display='auto') {
		this.removeCssClass('hidden')
	}

	toggle(visible) {
		if (visible === undefined) {
			visible = this.hasCssClass('hidden')
		}
		visible ? this.show() : this.hide()
	}

	highlight(words) {
		this._cascade('highlight', [words])
	}

	unhighlight() {
		this._cascade('unhighlight')
	}

	redraw() {
		const display = this.element.style.display
		this.element.style.display = 'none'
		this.element.offsetHeight // This line is necessary to trigger reflow
		this.element.style.display = display
	}
}

BasePuerComponent.prototype.chainName = 'BasePuerComponent'
