import $                from './class.Puer.js'
import PuerProps        from './class.PuerProps.js'
import PuerObject       from './class.PuerObject.js'
import PuerComponentSet from './class.PuerComponentSet.js'


class BasePuerComponent extends PuerObject {
	constructor(props, children) {
		super()
		this.owner    = $.owner
		this.id       = props['id'] || this.id
		this.element  = null
		this.parent   = null
		this.root     = null
		this.children = new PuerComponentSet(children, this._onChildrenChange.bind(this))
		this.props    = new PuerProps(props, '_onPropChange', this)

		this.events   = this.props.extractEvents(this.owner)
		this.classes  = this.props.pop('classes') || []

		this.jsCode    = this._toCode(this.classes, props, children)
		this.isCustom  = false
		this._isActive = true
		this._isHidden = false

		this.elementCopy       = null
		this.parentElementCopy = null

		this._listenerMap = new WeakMap()
		this._eventTarget = this

		$.components[this.id] = this
		this.props.default('isDefaultRoute', false)
		this.props.default('extra', null)
		this.props.default('isExtra', false)

		this.name = this.props.name || null
	}

	/********************** FRAMEWORK **********************/

	__render() {
		this._setupRoot()
		this._cascade('__render')
		this._setupElement()
		this._createText()
		this.addCssClass(... this.classes.map(c => $.dereference(c)))
		this._addEvents()
		this.props.extra && this.root.append(this.props.extra)
		this.onRender && this.onRender()
		return this.root
	}

	__rendered() {
		this._cascade('__rendered')
		this._applyProps()
	}

	__onBeforeRoute(path) {
		if (path) {
			return this._cascade('__onBeforeRoute', [path]) && this.onBeforeRoute(path)		
		}
		return true
	}

	__route(flatPath, activation) {
		/*
		*  activation can be: -1 0 1
		*  ------ -1  - route parent deactivated
		*  ------- 0  - route parent did not change _isActive
		*  ------- 1  - route parent activated
		*/
		let hasMatch = false
		if (this.props.route) {
			const [routeName, routeValue] = this.props.route.split(':')
			for (const name in flatPath) {

				if (routeName === name) {
					hasMatch = true
					if (routeValue === flatPath[name]) {
						activation = this._isActive ? 0 : 1
						this.activate()
						this.onActivate && this.onActivate()
						this._cascade('__route', [flatPath, activation])
					} else {
						activation = !this._isActive ? 0 : -1
						this.onDeactivate // TODO: check if need to do like onActivate
							? this.onDeactivate()
							: this.deactivate()

						this._cascade('__route', [flatPath, activation])
					}
				}
			}
		} else {
			if (activation < 0) {
				this.onDeactivate && this.onDeactivate()
			} else if (activation > 0) {
				this.onActivate && this.onActivate()
			}
		}
		if (!hasMatch) {
			this.activate()
			this._cascade('__route', [flatPath, activation])
		}
	}

	__routeChange() {
		this.onRoute && this.onRoute($.Router.path)
		this._cascade('__routeChange', [])
	}

	__init() {
		this._cascade('__init')
		// if (this.props.isExtra) {
		// 	$.wait(
		// 		() => Boolean(this.parent),
		// 		() => {this.onInit && this.onInit()}
		// 	)
		// } else {
		this.onInit && this.onInit()
		// }
	}

	__ready() {
		this._cascade('__ready')
		this.onReady && this.onReady()
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
		console.log(`${this.className}._onChildrenChange`)
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
			// if (value && value.isReference) debugger
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

	_cascade(methodName, args=[]) {
		let b = true
		if (this.isCustom) {
			b = this.root[methodName](... args)
		} else {
			for (const child of this.children) {
				b = child[methodName](... args)
			}
		}
		return b
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
		return this.isActive
	}

	get isHidden() {
		return this._isHidden
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

	/********************* DIRECTIVES *********************/

	activate() {
		if (!this._isActive && this.elementCopy) {
			this.element = this.elementCopy
			this.parentElementCopy.appendChild(this.element)
			this.elementCopy = null
			this._isActive    = true
		}
	}

	deactivate() {
		if (this._isActive) {
			this.elementCopy       = this.element
			this.parentElementCopy = this.element.parentNode
			this.element.remove()
			this.element  = null
			this._isActive = false
		}
	}

	route(path, query=null, relative=false) {
		if (this.props.route) {
			const [routeName, routeValue] = this.props.route.split(':')
			if (path.startsWith('*')) {
				relative = true
				path     = path.substring(1)
			} else if (relative) {
				path = `${routeName}:${routeValue}[${path}]`
			}
		}
		this.parent.route(path, query, relative)
	}

	getRouteConfig() {
		/*
			{
				route      : 'page:main',
				isRelative : true,
				className  : 'mycomp'
				routes : [
					...
				]
			}
		*/

		let config = null
		if (this.props.route) {
			const [name, value] = this.props.route.split(':')
			config = {
				name      : name,
				value     : value,
				className : this.className,
				isDefault : this.props.isDefaultRoute,
				routes    : []
			}
		}

		const descendants       = this.getDescendants()
		let   descendantConfigs = []

		for (const descendant of descendants) {
			let descendantConfig = descendant.getRouteConfig()
			descendantConfigs = descendantConfigs.concat(descendantConfig)
		}

		if (config) {
			config.routes = descendantConfigs
			descendantConfigs = [config]
		}
		return descendantConfigs
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

	getDescendants() {
		if (this.isCustom) {
			return [this.root]
		} else {
			return this.children
		}
	}

	append(component) {
		if ($.isArray(component)) {
			for (const c of component) {
				this.append(c)
			}
		} else {
			component.__render()
			component.__init()
			component.__ready()
			component._applyProps()

			component.parent = this.root
			component.owner  = this.owner
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
			component.__render()
			component.__init()
			component.__ready()
			component._applyProps()

			component.parent = this.root
			component.owner  = this.owner
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
		this.element.remove()
		if (this.parent.isCustom) {
			this.parent.root = null
		} else {
			const index = this.parent.children.indexOf(this)
			if (index >= 0) {
				delete this.parent.children[index]
			}
		}
		this.id && delete $.components[this.id]
	}

	removeChildren() {		
		while (this.root.children.length) {
			this.root.children[0].remove()
		}				
	}

	hide() {
		this._isHidden = true
		this.addCssClass('hidden')
	}

	show(display='auto') {
		this._isHidden = false
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

	onBeforeRoute(path) {
		return true
	}
}

BasePuerComponent.prototype.chainName = 'BasePuerComponent'

export default BasePuerComponent