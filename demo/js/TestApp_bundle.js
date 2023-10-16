class PuerObject {
	constructor() {
		this.classProperties = Object.getOwnPropertyNames(this.constructor.prototype)
		this.className       = this.constructor.name
	}

	isInstanceProperty(prop) { return Object.prototype.hasOwnProperty.call(this, prop) }
	isClassProperty(prop)    { return this.classProperties.includes(prop.toString()) }
	isComputedProperty(prop) { return !this.isOwnProperty(prop) && !this.isClassProperty(prop) }

	getProperties() {
		let props = new Set()
		let o     = this
		do {
			Object.getOwnPropertyNames(o).map(item => props.add(item))
		} while ((o = Object.getPrototypeOf(o)))
		return [ ... props.keys()]
	}

	getMethods() {
		return this.getProperties().filter(item => typeof this[item] === 'function')
	}

	hasOwnMethod(method) {
		return this.hasOwnProperty(method) && typeof this[method] === 'function'
	}

	hasProto(className) {
		let proto = this
		do {
			if (proto.hasOwnProperty(propName) && proto.constructor.name === className) {
				return true
			}
		} while (proto && (proto = Object.getPrototypeOf(proto)))
		return false
	}

	hasPropInProto(propName, propValue) {
		let proto = this
		do {
			// console.log(`${propName}=${propValue}`, 'in', proto.constructor.name, '?', proto[propName])
			if (proto[propName] === propValue) {
				// console.log('yes')
				return true
			}
			// console.log('no')
			proto = Object.getPrototypeOf(proto)
		} while (proto !== null)
		return false
	}
}

PuerObject.prototype.chainName = 'PuerObject'
;


class PuerApp extends PuerObject {
    constructor(selector) {
    	super()
		this.components  = {}
		this.root        = null
		this.dom         = null
		this.rootElement = document.querySelector(selector)
		this.chainName   = this.className
	}

	init(root) {
		this.root = root
		this.render()
		this.root.parent = this
		this.root.__onMount()
	}

	has(component_id) {
		return this.components.hasOwnProperty(component_id)
	}

	// Is called only once on application init
	render() {
		this.root.__register()
		this.dom = this.root.__render(this.className)
		this.rootElement.innerHTML = null
		this.rootElement.appendChild(this.dom) // TODO: Virutalize dom
	}

	// Is called every time on invalidate
	update() {
		this.dom = this.root.__update(this.className)
	}

	toString(root, indent='') {
		s = ''
		root = root || this.root
		s += indent + root.toString() + '\n'
		if (root.isCustom) {
			s += this.toString(root.root, indent + '  ')
		} else {
			for (let child of root.children) {
				s += this.toString(child, indent + '  ')
			}
		}
		return s
	}

	invalidate() {
		this.update()
	}

	
}
;


class PuerEvents extends EventTarget {
	static instance = null

	constructor() {
		if (!PuerEvents.instance) {
			super()
			this.socket       = null
			this.cache        = []
			this.is_connected = false
			this._listenerMap = new WeakMap()
			PuerEvents.instance   = this
		}
		return PuerEvents.instance
	}

	_cache(name, data) {
		this.cache.push({
			name : name,
			data : data
		})
	}

	_uncache() {
		this.cache.forEach((event) => {
			this.send(event.name, event.data)
		})
		this.cache = []
	}

	connect(endpoint) {
		this.socket = new WebSocket(endpoint)

		this.socket.onopen = () => {
			this.is_connected = true
			this._uncache()
		}

		this.socket.onmessage = (event) => {
			const data = JSON.parse(event.data)
			console.log('Received event: ', data.name, data.data)
	
			if (Array.isArray(data.data)) {
				data.data.forEach((item) => {
					this.trigger(data.name, item)
				})
			} else {
				this.trigger(data.name, data.data)
			}
			this.send(Puer.Event.SYS_CONFIRM, {name: data.name, key: data.key})
		}

		this.socket.onclose = (event) => {
			console.log('WebSocket connection closed:', event)
		}
	}

	once(name, f) {
		this.on(name, f, true)
	}
	on(name, f, once=false) {
		let _f = (e) => { return f(e.type, e.detail) }
		this._listenerMap.set(f, _f)
		this.addEventListener(name, _f, {once: once})
	}
	off(name, f) {
		let _f = this._listenerMap.get(f)
		this.removeEventListener(name, _f)
	}
	trigger(name, data) {
		this.dispatchEvent(new CustomEvent(name, { detail: data }))
	}
	send(name, data) {
		if (!this.is_connected) {
			this._cache(name, data)
		} else {
			console.log('Sent event:', name, data)
			this.socket.send(JSON.stringify({ 'name' : name, 'data' : data }))
		}
	}
}
;


class PuerError extends Error {
	constructor(message, className, methodName) {
		const where = className && methodName ? `${className}.${methodName}(): '` : ''
		message = `${where}${message}`
		super(message)
		this.name = 'PuerError'
	}
}
;


class PuerProxyPlugin {
	constructor() {
	}

	engage(target, proxy, handler) {
		this.target  = target
		this.proxy   = proxy
		this.handler = handler
	}

	get() {
		return undefined
	}

	set() {
		return false
	}
}
;


const PuerProxyMapPlugins = {

	MethodDecorator: class MethodDecorator extends PuerProxyPlugin {
		/*
			methods = {
				methodName1 : callback1(),
				methodName1 : callback2(),
				any         : callbackAny()
			}
		*/
		constructor(methods) {
			super()
			this.methods = methods
		}

		get(prop) {
			if (typeof this.target[prop] === 'function') {
				return new Proxy(this.target[prop], {
					apply: (target, thisArg, args) => {
						let f = (... args) => Reflect.apply(target, this.target, args)
						if (this.methods.hasOwnProperty(prop)) {
							return this.methods[prop](f, ... args)
						} else if (this.methods.any) {
							return this.methods.any(f, ... args)
						}
						return f(...args)
					}
				})
			}
			return undefined
		}
	},

	/*****************************************************************/

	KeyAccessorDecorator : class KeyAccessorDecorator extends PuerProxyPlugin {
		constructor(getter, setter) {
			super()
			this.getter = getter
			this.setter = setter
		}

		get(key) {
			console.log('in KAD', key)
			const f = (key) => this.target.get(key)
			return this.getter(f, key)
		}

		set(key, value) {
			const f = (key, value) => {
				return this.target.set(key, value)
			}
			return this.setter(f, key, value)
		}
	}
}


class PuerProxyMap extends Map {
	constructor(object, plugins) {
		super(Object.entries(object))

		const _map = this

		const handler = {
			get: function(target, prop, receiver) {
				if (typeof _map[prop] === 'function') {
					return function(...args) {
						return target[prop].apply(target, args)
					}
				}

				let result = null
				for (const plugin of plugins) {
					if (plugin.get) {
						return plugin.get(prop)
					}
				}

				return _map.get(prop)
			},

			set: function(target, prop, value, receiver) {
				for (const plugin of plugins) {
					if (plugin.set) {
						return plugin.set(prop, value)
					}
				}
				return _map.set(prop, value)
			},

			deleteProperty: function(target, prop, receiver) {
				for (const plugin of plugins) {
					if (plugin.delete) {
						return plugin.delete(prop)
					}
				}
				return _map.delete(prop)
			}
		}

		const proxy = new Proxy(this, handler)

		for (const plugin of plugins) {
			plugin.engage(this, proxy, handler)
		}

		return proxy
	}

	toMap() {
		return new Map(this.entries())
	}

	toObject() {
		return Object.fromEntries(this.toMap())
	}

	toString() {
		return JSON.stringify(this.toObject())
			.split('","').join('", "')
			.replace(/"([^"]+)":/g, '$1: ')
			.split('"').join("'")
	}
}
;


class PuerProps extends PuerProxyMap {
	constructor(props={}, onChange) {
		super(props, [
			new PuerProxyMapPlugins.MethodDecorator({
				set: (f, prop, value) => {
					const oldValue = this[prop]
					let res = f(prop, value)
					if (this[prop] !== oldValue) {
						onChange(prop, this[prop])
					}
					return res
				}
			})
		])
	}

	default(prop, defaultValue) {
		if (!this.hasOwnProperty(prop)) {
			this[prop] = defaultValue
		}
		return this[prop]
	}

	require(prop) {
		if (!this.hasOwnProperty(prop)) {
			throw new PuerError(`Property ${prop} is required but not set.`, this, 'require');
		}
		return this[prop]
	}

	extractEvents(owner) {
		const events = {}
		for (const prop in this) {
			let value = this[prop]
			if (typeof value === 'function' && prop.startsWith('on')) {
				events[prop.substring(2).toLowerCase()] = value.bind(owner)
				delete this[prop]
			}
		}
		return events
	}

	toObject() {
		return super.toObject()
	}
}
;


const PuerProxyArrayPlugins = {

	/*****************************************************************/

	ChainOperator: class ChainOperator extends PuerProxyPlugin {
		/*
			operators = {
				operator1 : itemMethodName1,
				operator1 : itemMethodName2,
				...
				operatorN : itemMethodNameN
			}
		*/
		constructor(operators) {
			super()
			this.operators = operators
			this.operator  = null
		}

		get(prop) {
			if (this.operator) {
				let   newInstance  = new this.target.constructor()
				const method       = this.operators[this.operator]

				for (const item of this.target) {
					newInstance = newInstance.concat(item[method](prop))
					this.operator = null
					return newInstance
				}
			} else {
				if (prop in this.operators) {
					this.operator = prop
					return new Proxy(this.target, this.handler)
				}
			}
			return undefined
		}
	},

	/*****************************************************************/

	MethodDecorator: class MethodDecorator extends PuerProxyPlugin {
		/*
			methods = {
				methodName1 : callback1(),
				methodName1 : callback2(),
				any         : callbackAny()
			}
		*/
		constructor(methods) {
			super()
			this.methods = methods
		}

		get(prop) {
			if (typeof this.target[prop] === 'function') {
				return new Proxy(this.target[prop], {
					apply: (target, thisArg, args) => {
						let f = (... args) => Reflect.apply(target, thisArg, args)
						if (this.methods.hasOwnProperty(prop)) {
							return this.methods[prop](f, ... args)
						} else if (this.methods.any) {
							return this.methods.any(f, ... args)
						}
						return f(...args)
					}
				})
			}
			return undefined
		}
	},

	/*****************************************************************/

	IndexAccessorDecorator : class IndexAccessorDecorator extends PuerProxyPlugin {
		constructor(getter, setter) {
			super()
			this.getter = getter
			this.setter = setter
		}

		get(index) {
			if (this.getter && Number.isInteger(Number(index))) {
				const f = () => this.target[index]
				return this.getter(f, index)
			}
			return undefined
		}

		set(index, value) {
			if (this.setter && Number.isInteger(Number(index))) {
				const f = (value) => { this.target[index] = value }
				this.setter(f, index, value)
				return true
			}
			return false
		}
	}
}

/*****************************************************************/
/*****************************************************************/

class PuerProxyArray extends Array {
	constructor(items, plugins) {
		super(... items)

		const handler = {
			get: function(target, prop, receiver) {
				if (prop === '__target') { return target }
				
				let result = null
				for (const plugin of plugins) {
					result = plugin.get(prop)
					if (result !== undefined) { return result }
				}
				return Reflect.get(target, prop, receiver)
			},

			set: function(target, prop, value, receiver) {
				for (const plugin of plugins) {
					if (plugin.set(prop, value)) {
						return true
					}
				}
				return Reflect.set(target, prop, value, receiver)
			}
		}

		const proxy = new Proxy(this, handler)

		for (const plugin of plugins) {
			plugin.engage(this, proxy, handler)
		}

		return proxy
	}

	toArray() {
		return Array.from(this)
	}

	toString() {
		return '[' + this.toArray().join(', ') + ']'
	}
}
;


class PuerComponentSet extends PuerProxyArray {
	constructor(components, onChange) {
		super(components, [
			new PuerProxyArrayPlugins.MethodDecorator({}),
			new PuerProxyArrayPlugins.IndexAccessorDecorator(
				null,
				function (f, n, value) {
					const oldLength = this.length
					f(value)
					if (this.length !== oldLength) {
						onChange()
					}
				}
			),
			new PuerProxyArrayPlugins.ChainOperator({
				$   : 'getImmediateChainDescendants',
				$$  : 'getChainDescendants',
				$$$ : 'getChainAncestor'
			})
		])
	}
}
;


class BasePuerComponent extends PuerObject {
	constructor(props, children) {
		super()
		this.owner        = Puer.owner
		this.id           = null
		this.element      = null
		this.parent       = null
		
		this.children     = new PuerComponentSet (children, this._onChildrenChange .bind(this))
		this.props        = new PuerProps        (props,    this._onPropChange     .bind(this))

		console.log(this.props.toString(), this.props.text)

		// console.log('CONSTRUCTOR', this.className, this.children.toString())

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
			// console.log('getImmediateChainDescendants', chainName, this.root.chainName)
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

	/********************** FRAMEWORK **********************/

	__register(path='PuerApp', index=0) {
		this.path = path + '>' + this.className + `[${index}]`
	}


	/*********************** PRIVATE ***********************/

	_onPropChange(prop, value) {}

	_onChildrenChange() {}

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
		console.log(this.props.text)
		return `${this.className}(${this.props.toString()})`
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
;


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

	_dereference(propName) {
		const propValue = this.props[propName]
		if (propValue && typeof propValue === 'function') {
			return propValue()
		}
		return propValue
	}

	_onPropChange(prop) {
		super._onPropChange(prop)
		if (prop === 'text') {
			this.element.innerHTML = this._dereference(prop) // TODO: make separate component
		} else {
			this.element.setAttribute(prop, this._dereference(prop))
		}
	}

	_renderDom() {
		const el = document.createElement(this.tagName)
		if (this.props.hasOwnProperty('text')) {
			const p = this._dereference('text')
			// console.log('_dereference', p, this.props.text.isGetterFunction)
			el.appendChild(document.createTextNode(p))
		}
		for (const prop in this.props) {
			if (prop != 'text') {
				el.setAttribute(prop, this._dereference(prop))
			}
		}
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
;


class PuerConstructor extends PuerObject {
    constructor(cls, props, children, isCustom) {
        super()
        this.cls      = cls
        this.props    = props
        this.children = children
        this.isCustom = isCustom
        this.instance = null
        this.xPath    = null
        this.owner    = Puer.owner
    }

    /*********************** PRIVATE ***********************/

    // _getInstance(id) {
    //     let instance = null
    //     if (Puer.App.has(id)) {
    //         instance      = Puer.App.components[id]
    //         this.children = instance.children
    //         // console.log('Found in components', instance.id, instance.props, instance)
    //     } else {
    //         instance          = new this.cls(this.props, this.owner)
    //         instance.id       = id
    //         instance.isCustom = this.isCustom

    //         Puer.App.components[id] = instance
    //     }
    //     return instance
    // }

    /********************** FRAMEWORK **********************/

    __register(xPath='PuerApp', index=0) {
        this.xPath    = xPath + '>' + this.cls.name + `[${index}]`
        this.instance = this._getInstance(this.xPath)

        this.instance.children = this.children

        if (this.isCustom) {
            this.tree                 = this.tree || this.instance.render()
            if (!this.tree) {
                throw new PuerError('Must return component tree', this.instance.className, 'render')
            }
            this.instance.root        = this.tree.__register(this.xPath)
            this.instance.root.parent = this.instance


        } else {
            this.instance.root = this.instance
            this.children && this.children.forEach((child, index) => {
                const childInstance = child.__register(this.xPath, index)
                childInstance.parent = this.instance
            })
        }

        this.instance.isCustom = this.isCustom
        this.instance.shadow   = this

        // console.log(this.xPath, this.instance)
        return this.instance
    }

    __update() {
        return this.instance.__update()
    }

    __render() {
        return this.instance.__render()
    }

    __onMount() {
		return this.instance.__onMount()
	}    
}
;


class StringMethods {
    static random(len) {
        let result = ''
        const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789'
        const charactersLength = characters.length;
        let counter = 0
        while (counter < len) {
            result += characters.charAt(Math.floor(Math.random() * charactersLength))
            counter += 1
        }
        return result
    }

    static capitalize(s) {
        return s.charAt(0).toUpperCase() + s.slice(1)
    }

    static camelToDashedSnake(s) {
        return s.replace(/([a-zA-Z])(?=[A-Z])/g, '$1-').toLowerCase()
    }

    static titleDivider(title, n = 20, ch = '=') {
        let pad = Math.floor((n - title.length - 2) / 2)
        return ch.repeat(pad) + ' ' + title + ' ' + ch.repeat(n - title.length - 2 - pad)
    }
}
;


class ObjectMethods {
	static compare(o1, o2) {
		if ((typeof o1 )!== (typeof o2)) {
			return false
		}
		switch (typeof o1) {
			case 'object':
				for (const key in o1) {
					if (!ObjectMethods.compare(o1[key], o2[key])) { return false }
				}
				return true
			default:
				return o1 === o2
		}
	}
}
;


class Puer {
	static owner

	static init(events=[]) {
		Puer.Event  = {}
		Puer.Events = new PuerEvents()
		for (const event of events) {
			Puer.Event[event] = event
		}
		Puer.Event.SYS_CONFIRM = 'SYS_CONFIRM'
		return this
	}

	static app(selector, tree) {
		if (!Puer.Events) {
			throw new PuerError('Initialize Puer application using Puer.init().app(...)')
		}
		Puer.App = new PuerApp(selector)
		Puer.App.init(tree)
		return Puer.App
	}


	static defer(f, owner=window, args=undefined) {
		let alias = f
		if (typeof f === 'function') {
			Puer.deferred = true
			alias = alias.apply(owner, args)
			Puer.deferred = false
		}
		return alias
	}


	static deferrer(f, owner=window, args=undefined) {
		let alias = f
		return () => {
			Puer.deferred = true
			if (owner.isCustom) {
				Puer.owner = owner
			}

			let result = alias.apply(owner, args)

			Puer.owner    = null
			Puer.deferred = false
			return result
		}
	}

	static arganize(args, types, defaults, norm_args=[]) {
		if (types.length) {
			if (Puer.type(args[0]) == types.shift()) {
				defaults.shift()
				norm_args.push(args.shift())
			} else {
				norm_args.push(defaults.shift())
			}
			this.arganize(args, types, defaults, norm_args)
		}
		return norm_args
	}

	static type(o) {
		if (o == null) { return o + '' }
		const class2type = {}
		'Boolean Number String Function Array Date RegExp Object Error Symbol'.split(' ')
			.forEach(name => {
				class2type['[object ' + name + ']'] = name.toLowerCase();
			})
		const className = Object.prototype.toString.call(o);
		if (className in class2type) { return class2type[className]	}
		return typeof o
	}

	static isFunction(o) { return Puer.type(o) === 'function' }
	static isBoolean(o)  { return Puer.type(o) === 'boolean'  }
	static isObject(o)   { return Puer.type(o) === 'object'   }
	static isString(o)   { return Puer.type(o) === 'string'   }
	static isNumber(o)   { return Puer.type(o) === 'number'   }
	static isRegexp(o)   { return Puer.type(o) === 'regexp'   }
	static isSymbol(o)   { return Puer.type(o) === 'symbol'   }
	static isError(o)    { return Puer.type(o) === 'error'    }
	static isArray(o)    { return Puer.type(o) === 'array'    }
	static isDate(o)     { return Puer.type(o) === 'date'     }

	static _defineTag(name) {
		if (name in window) {
			throw `Could not register tag method ${name}: already present in global scope`
		}
		let className = 'PuerTag' + StringMethods.capitalize(name)
		eval(
			`class ${className} extends PuerHtmlElement {};` +
			`window.${className} = ${className}`
		)
		Object.defineProperty(window[className], 'name', { value: className })
		window[className].prototype.chainName = name
		// console.log('setting chain name', window[className].prototype.chainName)

		window[name] = (... args) => {
			// console.log(name, ...args)
			let [ cssClass,  props,    children ] = Puer.arganize(args,
				[ 'string',  'object', 'array', ],
				[ '',        {},       [],      ]
			)
			if (cssClass)  { props['class'] = cssClass + (props['cssClass'] ? ' ' + props['cssClass'] : '')}
			// console.log(`${name}("${css_class}", ${JSON.stringify(props)}, [${children.length}])`)
			// return new PuerConstructor(window[className], props, children, false)
			return new window[className](props, children)
		}
	}

	static _defineComponent(namespace, cls) {
		if (Puer[cls.name]) {
			throw `Could not register component ${cls.name}: already present $$`
		}

		cls.prototype.chainName = cls.name
		// console.log('setting chain name', cls.name)
		
		Puer[cls.name] = (... args) => {
			let [props,    children ] = Puer.arganize(args,
				['object', 'array'  ],
				[{},       []       ]
			)
			// return new PuerConstructor(cls, props, children, true)
			return new cls(props, children)
		}
	}

	static define(... args) {
		const className = args.pop()
		const namespace = args.join('_')
		if (Puer.type(className) === 'string') {
			return Puer._defineTag(className)
		}
		return Puer._defineComponent(namespace, className)
	}

	static addComponent(component) {
		Puer.App.components[component.id] = component
	}

	static getComponent(id) {
		return Puer.App.components[id]
	}

	static removeComponent(id) {
		delete Puer.App.components[id]
	}
}
Puer.String = StringMethods
Puer.Object = ObjectMethods
;


(() => {
	const tags = (
		'a,abbr,address,area,article,aside,audio,b,base,bdi,bdo,blockquote,body,br,button,'    +
		'canvas,caption,cite,code,col,colgroup,data,datalist,dd,del,details,dfn,dialog,div,'   +
		'dl,dt,em,embed,fieldset,figcaption,figure,footer,form,h1,h2,h3,h4,h5,h6,head,header,' +
		'hgroup,hr,html,i,iframe,img,input,ins,kbd,label,legend,li,link,main,map,mark,meta,'   +
		'meter,nav,noscript,object,ol,optgroup,option,output,p,param,picture,pre,progress,q,'  +
		'rp,rt,ruby,s,samp,script,section,select,small,source,span,strong,style,sub,summary,'  +
		'sup,table,tbody,td,template,textarea,tfoot,th,thead,time,title,tr,track,u,ul,var,video,wbr'
	).split(',')

	for (const tag of tags) {
		Puer.define(tag)
	}
})()
;


class PuerState extends PuerObject {
	constructor(onChange) {
		super()
		this.state    = {}
		this.onChange = onChange
		return PuerState._makeObservable(this.state, this.onChange)
	}

	static _makeObservable(obj, onChange) {
		return new Proxy(obj, {
			get(target, prop) {
				const value = target[prop]
				if (typeof value === 'object' && value !== null) {
					return PuerState._makeObservable(value, onChange)  // Recursive call for nested object
				}
				// console.log('STATE GET', value, target.wrapState)

				let getterFunction = () => {
					return target[prop]
				}
				getterFunction.isGetterFunction = true

				return Puer.deferred ? getterFunction : value
			},
			set(target, prop, value) {
				let isChange = prop in target
				target[prop] = value

				// if (prop == 'wrapState')   { return true }
				if (Array.isArray(target)) { isChange = true }
				if (isChange)              { onChange(prop, value) }
	
				return true
			}
		})
	}
}
;


class PuerComponent extends BasePuerComponent {
	constructor(props, children) {
		super(props, children)
		this.state     = new PuerState(this.invalidate.bind(this))
		this.isCustom  = true

		this.getMethods()
			.filter(method => method.startsWith('render') || method.startsWith('_render'))
			.map(method => {
				this[method] = Puer.deferrer(this[method], this)
			})
	}

	/********************** FRAMEWORK **********************/


	__register(path='PuerApp', index=0) {
		super.__register(path, index)
		this.tree = this.render()
        if (!this.tree) {
            throw new PuerError('Must return component tree', this.className, 'render')
        }
        this.root = this.tree.__register(this.path)
        this.root.parent = this
        return this
	}

	__render() {
		// console.log('__render', this.id, this.parent)
		this.element = this.root.__render()
		this.element.classList.add(this.cssClass)
		this._addEvents()
		return this.element
	}

	__onMount() {
		this.root.__onMount()
		this.onMount()
	}

	/*********************** PRIVATE ***********************/

	_renderDom() {
		if (this.root) {
			return this.root._renderDom()
		}
		return null
	}

	_onPropChange(prop) {
		super._onPropChange(prop)
		const onChangeFuncName = `onChange${Puer.String.capitalize(prop)}`
		if (this.hasOwnMethod(onChangeFuncName)) {
			this[onChangeFuncName].bind(this)(this.props[prop])
		}
	}

	/********************* DOM METHODS *********************/

	append(child) {
		// child = Puer.defer(child)
		child.parent = this
		console.log(this.children)
		this.children.push(child)
		// console.log(this.children)

		this.invalidate()
	}

	prepend(child) {
		// child = Puer.defer(child)
		child.parent = this
		this.children.unshift(child)
		this.invalidate()
	}
}

PuerComponent.prototype.chainName = 'PuerComponent'
;


class Comp2Base extends PuerComponent {
	constructor(props, children) {
		super(props, children)
	}
}

Puer.define(Comp2Base)
;


class Comp2 extends Comp2Base {
	constructor(props, children) {
		super(props, children)
		this.state.liText = 'HAHA'
		// console.log(this.state.liText)
	}


	changeState() {
		this.state.liText = this.state.liText + 'HA'
	}

	showChain() {
		// console.log('this.$',                                this.$)                                   // +
		// console.log('this.$.ul',                             this.$.ul)                                // +
		// console.log('this.$.ul[0]',                    this.$.ul[0])                                   // +
		// console.log('this.$.ul[0].$.div',                    this.$.ul[0].$.div)                       // +
		// console.log('this.$$$.Comp1',                        this.$$$.Comp1)                           // +
		// console.log('this.$$$.Comp1[0].$.div',               this.$$$.Comp1[0].$.div)                  // +
		// console.log('this.$$$.Comp1[0].$.div[0].props.text', this.$$$.Comp1[0].$.div[0].props.text)    // +
		// console.log('this.$$$.Comp1[0].$.div[0].toString()',  this.$$$.Comp1[0].$.div[0].toString())   // +
		// console.log('this.$$$.PuerObject',              this.$$$.PuerObject)                           // +
		// console.log('this.$$$.PuerHtmlElement',              this.$$$.PuerHtmlElement)                 // +
	}

	renderItem() {
		this.append(div({onclick: this.changeState, text: this.state.liText}))
	}

	render() {
		return ul ([
			div    (this.children),
			li     ({text: this.state.liText}),
			li     ({text: 'haha2'}),
			button ({onClick: this.renderItem, text: 'Add Item'}),
			button ({onClick: this.showChain,  text: 'Show Chain'})
		])
	}
}

Puer.define(Comp2)
;


class Comp1 extends PuerComponent {
	constructor(props, children) {
		super(props, children)
	}

	init() {
		Puer.Events.send('Event', {})
	}

	_onClick(e) {

	}

	showChain() {
		console.log('this.$$.Comp2Base', this.$$.Comp2Base) // +
		console.log('this.$$.Comp2',     this.$$.Comp2)     // +
	}

	render() {
		return div('', {onclick: this._onClick, text: 'Some Div'}, [
			Puer.Comp2([
				h1('', {myProp: 'test', text: 'H1'})
			]),
			// console.log('render in Comp1', Puer.renderOwner),
			button({onClick: this.showChain,  text: 'Show Chain in Comp1'})
		])
	}
}

Puer.define(Comp1)
;


Puer.init().app('#demo', Puer.Comp1())
;
