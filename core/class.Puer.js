import PuerApp         from './class.PuerApp.js'
import PuerEvents      from './class.PuerEvents.js'
import PuerHtmlElement from './class.PuerHtmlElement.js'
import PuerConstructor from './class.PuerConstructor.js'
import String          from '../library/class.String.js'

class Puer {

	static init(events=[]) {
		Puer.Event  = {}
		Puer.Events = new PuerEvents()
		for (const event of events) {
			Puer.Event[event] = event
		}
		Puer.Event.SYS_CONFIRM = 'SYS_CONFIRM'
		return Puer
	}

	static app(selector, tree) {
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
			let result = alias.apply(owner, args)
			Puer.deferred = false
			return result
		}
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

	static arganize(args, types, defaults, norm_args=[]) {
		if (types.length) {
			if (this.type(args[0]) == types.shift()) {
				defaults.shift()
				norm_args.push(args.shift())
			} else {
				norm_args.push(defaults.shift())
			}
			this.arganize(args, types, defaults, norm_args)
		}
		return norm_args
	}

	static _defineTag(name) {
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

	static _defineComponent(cls) {
		if (Puer[cls.name]) {
			throw `Could not register component ${cls.name}: already present $$`
		}
		
		Puer[cls.name] = (...args) => {
			let [props,    children ] = Puer.arganize(args,
				['object', 'array'  ],
				[{},       []       ]
			)
			return new PuerConstructor(cls, props, children, true)
		}
	}

	static define(m) {
		if (Puer.type(m) === 'string') {
			return Puer._defineTag(m)
		}
		return Puer._defineComponent(m)
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


export default Puer