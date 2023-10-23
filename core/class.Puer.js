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
	static path
	static appPath
	
	static _cssUrls  = new Set()
	static _cssCount = 0

	/********************** PRIVATE **********************/

	static _init() {
		Puer._classToType = {}
		'Boolean Number String Function Array Date RegExp Object Error Symbol'.split(' ')
			.forEach(name => {
				const typeName = name.toLowerCase()
				Puer._classToType['[object ' + name + ']'] = typeName
				Puer[`is${name}`] = (o) => { return Puer.type(o) === typeName }
			})
		Puer.Error  = PuerError
		Puer.Event  = {}
		Puer.Events = new PuerEvents()
	}

	static _loadComponentCss(componentUrl) {
		if (componentUrl) {
			let cssUrl = componentUrl.includes('puerjs') 
				? Puer.path + componentUrl.split(Puer.path)[1].replace(/\bjs\b/g, 'css')
				: componentUrl.replace(/\bjs\b/g, 'css')

			if (!Puer._cssUrls.has(cssUrl)) {
				let styleElement = document.createElement('link')
				styleElement.setAttribute('type', 'text/css')
				styleElement.setAttribute('rel', 'stylesheet')
				styleElement.setAttribute('href', cssUrl)
				styleElement.onload = () => {
					Puer._cssCount --
					if (Puer._cssCount == 0) {
						Puer.app.__ready()
						console.log('APP READY')
					}
				}
				document.head.appendChild(styleElement)
				Puer._cssUrls.add(cssUrl)
				Puer._cssCount ++
			}
		}
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
			let [ cssClass,  props,    children ] = Puer.arganize(args,
				[ 'string',  'object', 'array', ],
				[ '',        {},       [],      ]
			)
			if (cssClass)  { props['class'] = cssClass + (props['cssClass'] ? ' ' + props['cssClass'] : '')}
			return new window[className](props, children)
		}
	}

	static _defineComponent(cls, importUrl) {
		Puer._loadComponentCss(importUrl)
		cls.prototype.chainName = cls.name
		Puer[cls.name] = (... args) => {
			let [props,    children ] = Puer.arganize(args,
				['object', 'array'  ],
				[{},       []       ]
			)
			return new cls(props, children)
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

	static application(cls, importUrl) {
		Puer._init()
		Puer._defineComponent(cls, importUrl)
		Puer.app    = Puer[cls.name]()
		Puer.Router = new PuerRouter(Puer.app)
		return Puer
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

Puer.String = StringMethods
Puer.Object = ObjectMethods

window.Puer = Puer
export default Puer




