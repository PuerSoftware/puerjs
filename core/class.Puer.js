import PuerRouter      from './class.PuerRouter.js'
import PuerEvents      from './class.PuerEvents.js'
import PuerError       from './class.PuerError.js'
import PuerHtmlElement from './class.PuerHtmlElement.js'
import PuerTextElement from './class.PuerTextElement.js'
import StringMethods   from '../library/class.StringMethods.js'
import ObjectMethods   from '../library/class.ObjectMethods.js'
import DateMethods     from '../library/class.DateMethods.js'
import Request         from '../library/class.Request.js'
import DataSet         from '../library/class.DataSet.js'


class Puer {
	static app
	static owner
	static deferred
	static path
	static appPath
	
	static _cssUrls  = new Set()
	static _cssCount = 0

	/********************** PRIVATE **********************/

	static init() {
		Puer._setTimezoneCookie()
		Puer._classToType = {}
		'Boolean Number String Function Array Date RegExp Object Error Symbol'.split(' ')
			.forEach(name => {
				const typeName = name.toLowerCase()
				Puer._classToType['[object ' + name + ']'] = typeName
				// Puer[`is${name}`] = (o) => { return Puer.type(o) === typeName }
			})
		Puer.Error  = PuerError
		Puer.Event  = {}
		Puer.Events = new PuerEvents(Puer)
	}

	static _setTimezoneCookie() {
		const timezone = Intl.DateTimeFormat().resolvedOptions().timeZone;
		document.cookie = 'timezone=' + timezone + ';path=/;max-age=31536000'; // one year
	}

	static _onCssLoad() {
		Puer._cssCount --
		if (Puer._cssCount == 0) {
			Puer.app.__ready()
		}
	}

	static _loadCss(componentUrl) {
		if (componentUrl) {
			let cssUrl = componentUrl.includes('puerjs') 
				? Puer.path + componentUrl.split(Puer.path)[1].replace(/\bjs\b/g, 'css')
				: componentUrl.replace(/\bjs\b/g, 'css')

			if (!Puer._cssUrls.has(cssUrl)) {
				let styleElement = document.createElement('link')
				styleElement.setAttribute('type', 'text/css')
				styleElement.setAttribute('rel', 'stylesheet')
				styleElement.setAttribute('href', cssUrl)
				styleElement.addEventListener('load',  Puer._onCssLoad, false)
				styleElement.addEventListener('error', Puer._onCssLoad, false)
				document.head.appendChild(styleElement)
				Puer._cssUrls.add(cssUrl)
				Puer._cssCount ++
			}
		}
	}

	static _toClassesArray(value) {
		if (value) {
			if (typeof value == 'function') {
				value = [value]
			} else {
				value = value.split(' ')
			}
		} else {
			value = []
		}
		return value
	}

	static _getConstructorArgs(args) {
		let [ cssClass,  props,    children ] = Puer.arganize(args,
			[ 'string',  'object', 'array', ],
			[ '',        {},       [],      ]
		)
		if (props.text && Puer.isString(props.text)) {
			props.text = Puer.String.decodeHtmlEntities(props.text)
		}
		props.classes = Puer._toClassesArray(props.classes)
		cssClass      = Puer._toClassesArray(cssClass)
		props.classes = props.classes.concat(cssClass)
		return [props, children]
	}

	static _defineText() {
		let className = 'PuerTagText'
		Object.defineProperty(PuerTextElement, 'name', { value: className })
		PuerTextElement.prototype.chainName = 'text'

		window['text'] = (text) => {
			return new PuerTextElement(text)
		}
	}

	static _defineTag(name) {
		let className = 'PuerTag' + StringMethods.capitalize(name)
		eval(
			`class ${className} extends PuerHtmlElement {};` +
			`window.${className} = ${className}`
		)
		Object.defineProperty(window[className], 'name', { value: className })
		window[className].prototype.chainName = name

		window[name] = (... args) => {
			return new window[className](... Puer._getConstructorArgs(args))
		}
	}

	static _defineComponent(cls, importUrl) {
		Puer._loadCss(importUrl)
		cls.prototype.chainName = cls.name
		Puer[cls.name] = (... args) => {
			return new cls(... Puer._getConstructorArgs(args))
		}
	}

	static define(cls, importUrl) {
		if (typeof cls === 'string') {
			if (window[cls]) {
				throw new PuerError(`Could not define tag "${cls}": name occupied`, Puer, 'define')
			} else {
				if (cls === 'text') {
					return Puer._defineText()
				}
				return Puer._defineTag(cls)
			}
		}
		if (Puer[cls.name]) {
			throw new PuerError(`Could not define component "Puer.${cls.name}": name occupied`, Puer, 'define')
		}
		return Puer._defineComponent(cls, importUrl)
	}

	/*********************** PUBLIC ***********************/

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

	static isPrimitive(o) {
		return ['string', 'number', 'boolean'].includes(Puer.type(o))
	}

	static isDeferrable(o) {
		return ['string', 'number', 'boolean', 'object', 'array'].includes(Puer.type(o))
	}

	static application(cls, importUrl) {
		Puer._defineComponent(cls, importUrl)
		Puer.app    = Puer[cls.name]()
		Puer.Router = new PuerRouter(Puer.app)
		return Puer
	}

	static router(getRoutes) {
		return Puer.Router.define(getRoutes)
	}

	static defer(f, owner=window) {
		let alias = f
		return (...args) => {
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
	
	static reference(o, s) {
		let f = () => o[s]
		f.toString = () => {
			return Puer.dereference(o[s])
		}
		f.isReference = true
		return f
	}

	static dereference(value) {
		while (Puer.isFunction(value) && value.isReference) {
			value = value()
		}
		return value
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
		const className = Object.prototype.toString.call(o)
		return Puer._classToType[className] || typeof o
	}

}

Puer.String  = StringMethods
Puer.Object  = ObjectMethods
Puer.Date    = DateMethods
Puer.Request = Request
Puer.DataSet = DataSet
 
Puer.init()

window.Puer = Puer
export default Puer




