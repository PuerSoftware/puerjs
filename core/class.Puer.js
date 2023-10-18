import PuerApp         from './class.PuerApp.js'
import PuerRouter      from './class.PuerRouter.js'
import PuerEvents      from './class.PuerEvents.js'
import PuerError       from './class.PuerError.js'
import PuerHtmlElement from './class.PuerHtmlElement.js'
import PuerTextElement from './class.PuerTextElement.js'
import StringMethods   from '../library/class.StringMethods.js'
import ObjectMethods   from '../library/class.ObjectMethods.js'

class Puer {
	static owner
	static deferred

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
		Puer.Router = new PuerRouter(Puer.App.root)
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
			// console.log('deferring', f.name)
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

	static _defineText() {
		if ('text' in window) {
			throw `Could not register tag method 'text': already present in global scope`
		}
		let className = 'PuerTagText'
		// window.PuerTagText = PuerTextElement
		Object.defineProperty(PuerTextElement, 'name', { value: className })
		PuerTextElement.prototype.chainName = 'text'
		// console.log('setting chai name', window[className].prototype.chainName)

		window['text'] = (text) => {
			// console.log(`${name}("${css_class}", ${JSON.stringify(props)}, [${children.length}])`)
			// return new PuerConstructor(window[className], props, children, false)
			return new PuerTextElement(text)
		}
	}

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

	static _defineComponent(cls) {
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

	static define(className) {
		if (Puer.type(className) === 'string') {
			if (className === 'text') {
				return Puer._defineText()
			}
			return Puer._defineTag(className)
		}
		return Puer._defineComponent(className)
	}

	static application(selector, cls=null) {
		let rootId = 'puer-application'
		if (!cls) {
			cls      = selector
			selector = '#' + rootId
		}
		const rootElement = document.createElement('div')
		rootElement.id = rootId
		document.body.appendChild(rootElement)
		Puer._defineComponent(cls)
		Puer.init().app(selector, Puer[cls.name]())
		return Puer
	}

	static router(getRoutes) {
		return Puer.Router.define(getRoutes)
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
export default Puer




