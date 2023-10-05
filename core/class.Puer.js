import PuerNamespace   from './class.PuerNamespace.js'
import PuerApp         from './class.PuerApp.js'
import PuerEvents      from './class.PuerEvents.js'
import PuerHtmlElement from './class.PuerHtmlElement.js'
import PuerConstructor from './class.PuerConstructor.js'
import String          from '../library/class.String.js'

class PuerClass extends PuerNamespace {
	static instance = null

	constructor() {
		super('Puer')
		if (!PuerClass.instance) {
			PuerClass.instance = this 
		}
		return PuerClass.instance
	}

	init(events=[]) {
		Puer.Event  = {}
		Puer.Events = new PuerEvents()
		for (const event of events) {
			Puer.Event[event] = event
		}
		Puer.Event.SYS_CONFIRM = 'SYS_CONFIRM'
		return this
	}

	app(selector, tree) {
		Puer.App = new PuerApp(selector)
		Puer.App.init(tree)
		return Puer.App
	}


	default(o, propName, defaultValue) {
		if (!o.hasOwnProperty(propName)) {
			o[propName] = defaultValue
		}
	}


	defer(f, owner=window, args=undefined) {
		let alias = f
		if (typeof f === 'function') {
			Puer.deferred = true
			alias = alias.apply(owner, args)
			Puer.deferred = false
		}
		return alias
	}


	deferrer(f, owner=window, args=undefined) {
		let alias = f
		return () => {
			Puer.deferred = true
			let result = alias.apply(owner, args)
			Puer.deferred = false
			return result
		}
	}


	isFunction(o) { return this.type(o) === 'function' }
	isBoolean(o)  { return this.type(o) === 'boolean'  }
	isObject(o)   { return this.type(o) === 'object'   }
	isString(o)   { return this.type(o) === 'string'   }
	isNumber(o)   { return this.type(o) === 'number'   }
	isRegexp(o)   { return this.type(o) === 'regexp'   }
	isSymbol(o)   { return this.type(o) === 'symbol'   }
	isError(o)    { return this.type(o) === 'error'    }
	isArray(o)    { return this.type(o) === 'array'    }
	isDate(o)     { return this.type(o) === 'date'     }

	_defineTag(name) {
		if (name in window) {
			throw `Could not register tag method ${name}: already present in global scope`
		}
		window[name] = (...args) => {
			// console.log(name, ...args)
			let [ cssClass,  props,    children ] = Puer.arganize(args,
				[ 'string',  'object', 'array', ],
				[ '',        {},       [],      ]
			)
			if (cssClass)  { props['class'] = cssClass + (props['cssClass'] ? ' ' + props['cssClass'] : '')}
			// console.log(`${name}("${css_class}", ${JSON.stringify(props)}, [${children.length}])`)
			let className = 'PuerTag' + String.capitalize(name)
			eval(`window.${className} = class ${className} extends PuerHtmlElement {}`)
			return new PuerConstructor(window[className], props, children, false)
		}
	}

	// _defineComponent(cls) {
	// 	if (Puer[cls.name]) {
	// 		throw `Could not register component ${cls.name}: already present $$`
	// 	}
		
	// 	Puer[cls.name] = (...args) => {
	// 		let [props,    children ] = Puer.arganize(args,
	// 			['object', 'array'  ],
	// 			[{},       []       ]
	// 		)
	// 		return new PuerConstructor(cls, props, children, true)
	// 	}
	// }

	define(m) {
		if (Puer.type(m) === 'string') {
			return Puer._defineTag(m)
		}
		return super.define(m) //Puer._defineComponent(m)
	}

	addComponent(component) {
		Puer.App.components[component.id] = component
	}

	getComponent(id) {
		return Puer.App.components[id]
	}

	removeComponent(id) {
		delete Puer.App.components[id]
	}
}

const Puer = new PuerClass()

Puer.defineNamespace('UI')
export default Puer




