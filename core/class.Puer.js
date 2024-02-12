class Puer {
	static instance = null

	constructor() {
		if (!Puer.instance) {
			this.app
			this.owner
			this._path
			this.appPath
			this.isReferencing
			
			this.isRouting  = true
			this._cssUrls   = new Set()
			this._cssCount  = 0
			this.components = {}
			Puer.instance   = this
		}
		return Puer.instance
	}

	/********************** PRIVATE **********************/

	init() {
		this._setTimezoneCookie()
		this._classToType = {}
		'Boolean Number String Function Array Date RegExp Object Error Symbol'.split(' ')
			.forEach(name => {
				const typeName = name.toLowerCase()
				this._classToType['[object ' + name + ']'] = typeName
			})

		this.Event      = {}
		this.EventProps = {}
		this.Events     = new this.PuerEvents(this)
	}

	_setTimezoneCookie() {
		const timezone = Intl.DateTimeFormat().resolvedOptions().timeZone;
		document.cookie = 'timezone=' + timezone + ';path=/;max-age=31536000'; // one year
	}

	_onCssLoad(success) {
		this._cssCount --
		if (this._cssCount == 0) {
			this.app.__ready()
		}
	}

	_loadCss(componentUrl) {
		if (componentUrl) {
			let cssUrl = componentUrl.includes('puerjs') 
				? this._path + componentUrl.split(this._path)[1].replace(/\bjs\b/g, 'css')
				: componentUrl.replace(/\bjs\b/g, 'css')

			if (!this._cssUrls.has(cssUrl)) {
				let styleElement = this.Html.load(
					cssUrl,
					this._onCssLoad.bind(this)
				)
				this._cssUrls.add(cssUrl)
				this._cssCount ++
			}
		}
	}

	_toClassesArray(value) {
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

	_getConstructorArgs(args) {
		let [ cssClass,  props,    children ] = this.arganize(args,
			[ 'string',  'object', 'array', ],
			[ '',        {},       [],      ]
		)
		if (props.text && this.isString(props.text)) {
			props.text = this.String.decodeHtmlEntities(props.text)
		}
		props.classes = this._toClassesArray(props.classes)
		cssClass      = this._toClassesArray(cssClass)
		props.classes = props.classes.concat(cssClass)
		return [props, children]
	}

	_defineGetter(name, f) {
		Object.defineProperty(this, name, {
			get: function() {
				this.isReferencing = true
				return f
			}
		})
	}

	_defineText() {
		let className = 'PuerTagText'
		Object.defineProperty(this.TextElement, 'name', { value: className })
		this.TextElement.prototype.chainName = 'text'

		this._defineGetter('text', (text) => {
			return new this.TextElement(text)
		})
	}

	_defineTag(name) {
		let className = 'PuerTag' + this.String.capitalize(name)
		if (window[className]) {
			throw new PuerError(`Could not define tag "${className}": name occupied`, $, 'define')
		}
		eval(
			`class ${className} extends this.HtmlElement {};` +
			`window.${className} = ${className}`
		)
		Object.defineProperty(window[className], 'name', { value: className })
		window[className].prototype.chainName = name

		this._defineGetter(name, (... args) => {
			return new window[className](... this._getConstructorArgs(args))
		})
	}

	_defineComponent(cls, importUrl) {
		this._loadCss(importUrl)
		cls.prototype.chainName = cls.name
		window[cls.name] = cls
		
		this._defineGetter(cls.name, (... args) => {
			return new cls(... this._getConstructorArgs(args))
		})
	}

	define(cls, importUrl) {
		if (typeof cls === 'string') {
			if (cls === 'text') {
				return this._defineText()
			}
			return this._defineTag(cls)
		}
		if (this[cls.name]) {
			throw new $.Error(`Could not define component "$.${cls.name}": name occupied`, $, 'define')
		}
		return this._defineComponent(cls, importUrl)
	}

	defineClass(cls, defineAs=null) {
		this[defineAs || cls.name] = cls
	}

	/*********************** PUBLIC ***********************/

	isFunction(o)   { return this.type(o) === 'function' }
	isBoolean(o)    { return this.type(o) === 'boolean'  }
	isObject(o)     { return this.type(o) === 'object'   }
	isPuerObject(o) { return o && o.isPuerObject         }
	isString(o)     { return this.type(o) === 'string'   }
	isNumber(o)     { return this.type(o) === 'number'   }
	isRegexp(o)     { return this.type(o) === 'regexp'   }
	isSymbol(o)     { return this.type(o) === 'symbol'   }
	isError(o)      { return this.type(o) === 'error'    }
	isArray(o)      { return this.type(o) === 'array'    }
	isSet(o)        { return (o instanceof Set)          }
	isDate(o)       { return this.type(o) === 'date'     }

	isPrimitive(o) {
		return ['string', 'number', 'boolean'].includes(this.type(o))
	}

	application(cls, importUrl, onInit, onReady) {
		this._defineComponent(cls, importUrl)
		this.app    = this[cls.name]({onReady: onReady})
		this.Router = new this.PuerRouter(this.app)
		onInit()
		this.app.__init()
		return $
	}

	router(getRoutes) {
		return this.Router.define(getRoutes)
	}
	
	dereference(value) {
		return value && value.isReference 
			? value.dereference()
			: value
	}

	defer(f, args, context, timeout=1) {
		setTimeout(() => {
			if (context) {
				f.apply(context, args)
			} else {
				args = args || []
				f(...args)
			}
		}, timeout)
	}

	sync(asyncFunc) {
		return function(...args) {
			let callback = null
			if (this.isFunction(args.at(-1))) {
				callback = args.pop()
			}
 			asyncFunc(...args).then(result => {
				callback && callback(result, null)
			}).catch(error => {
				callback && callback(null, error)
			})
		}
	}

	arganize(args, types, defaults, norm_args=[]) {
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

	type(o) {
		if (o == null) { return o + '' }
		const className = Object.prototype.toString.call(o)
		return this._classToType[className] || typeof o
	}

	timer(name) {
		const time = Date.now()
		if (this._time) {
			console.log('Timer end:', this._time_name, `${time - this._time} ms`)
		}
		if (name) {
			console.log('Timer start:', name)
			this._time      = time
			this._time_name = name
		} else {
			this._time      = undefined
			this._time_name = undefined
		}
	}

	log( ... args ) {
		const newArgs = []
		for (const arg of args) {
			if ($.isString(arg) || $.isNumber(arg) || $.isBoolean(arg)) {
				newArgs.push(arg)
			} else {
				newArgs.push(JSON.stringify(arg, null, 4))
			}
		}
		console.log( ... newArgs )
	}
}

const $ = new Puer()
window.$ = $

import * as Core from './index.js'

$.Component      = Core.PuerComponent
$.ComponentMixin = Core.PuerComponentMixin
$.PuerRouter     = Core.PuerRouter     
$.PuerEvents     = Core.PuerEvents
$.Error          = Core.PuerError      
$.HtmlElement    = Core.PuerHtmlElement
$.TextElement    = Core.PuerTextElement

$.init()

import * as Library from '../library/index.js'

$.Constants      = Library.Constants
$.String         = Library.StringMethods
$.Object         = Library.ObjectMethods
$.Date           = Library.DateMethods
$.Set            = Library.SetMethods
$.Request        = Library.Request
$.Html           = Library.Html

$.DataSet        = Library.DataSet
$.DataStore      = Library.DataStore
$.DataSource     = Library.DataSource
$.DataOwnerMixin = Library.DataOwnerMixin
$.DataListMixn   = Library.DataListMixn
$.FormDataSource = Library.FormDataSource

$.Reference      = Library.Reference
$.ReferenceOwner = Library.ReferenceOwner
$.RouteRoot      = Library.RouteRoot

$.Constants.$($)
$.DataSet.$($)
$.DataSource.$($)
$.DataStore.$($)
$.Reference.$($)
$.Request.$($)

export default $
