import PuerRouter      from './class.PuerRouter.js'
import PuerEvents      from './class.PuerEvents.js'
import PuerError       from './class.PuerError.js'
import PuerHtmlElement from './class.PuerHtmlElement.js'
import PuerTextElement from './class.PuerTextElement.js'
import StringMethods   from '../library/class.StringMethods.js'
import ObjectMethods   from '../library/class.ObjectMethods.js'

class Puer {
	static app
	static owner
	static deferred
	static customComponents = new Set()

	static application(cls) {
		Puer._defineComponent(cls)

		Puer.Event  = {}
		Puer.Events = new PuerEvents()
		Puer.app    = Puer[cls.name]()
		Puer.Router = new PuerRouter(Puer.app)

		return Puer
	}

	static define(className) {
		if (Puer.isString(className)) {
			if (className === 'text') {
				return Puer._defineText()
			}
			return Puer._defineTag(className)
		}
		return Puer._defineComponent(className)
	}

	static router(getRoutes) {
		return Puer.Router.define(getRoutes)
	}

	static defer(f, owner=window, args=undefined) {
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

	static requestCss(componentNames) {
		componentNames.forEach(name => {
			Puer.customComponents.add(name)
		})
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

	static isFunction (o) { return Puer.type(o) === 'function' }
	static isBoolean  (o) { return Puer.type(o) === 'boolean'  }
	static isObject   (o) { return Puer.type(o) === 'object'   }
	static isString   (o) { return Puer.type(o) === 'string'   }
	static isNumber   (o) { return Puer.type(o) === 'number'   }
	static isRegexp   (o) { return Puer.type(o) === 'regexp'   }
	static isSymbol   (o) { return Puer.type(o) === 'symbol'   }
	static isError    (o) { return Puer.type(o) === 'error'    }
	static isArray    (o) { return Puer.type(o) === 'array'    }
	static isDate     (o) { return Puer.type(o) === 'date'     }

	static _defineText() {
		if ('text' in window) {
			throw `Could not register tag method 'text': already present in global scope`
		}
		let className = 'PuerTagText'
		Object.defineProperty(PuerTextElement, 'name', { value: className })
		PuerTextElement.prototype.chainName = 'text'

		window['text'] = (text) => {
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

		window[name] = (... args) => {
			let [ cssClass,  props,    children ] = Puer.arganize(args,
				[ 'string',  'object', 'array', ],
				[ '',        {},       [],      ]
			)
			if (cssClass)  { props['class'] = cssClass + (props['cssClass'] ? ' ' + props['cssClass'] : '')}
			return new window[className](props, children)
		}
	}

	static _defineComponent(cls) {
		if (Puer[cls.name]) {
			throw `Could not register component ${cls.name}: already present $$`
		}
		cls.prototype.chainName = cls.name
		Puer[cls.name] = (... args) => {
			let [props,    children ] = Puer.arganize(args,
				['object', 'array'  ],
				[{},       []       ]
			)
			return new cls(props, children)
		}
	}
}

Puer.String = StringMethods
Puer.Object = ObjectMethods

export default Puer




