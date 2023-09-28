class Puer {
	constructor(selector, tree) {
		tree.parent = this
		this.tree = tree
		this.dom  = null
		this.root = document.querySelector(selector)
		this.render()
		this.tree.__onMount()
	}

	render() {
		// console.log('Puer.render()')
		this.dom = this.tree.__render()
		let tree = this.dom.cloneNode(true)
		this.root.innerHTML = null
		this.root.appendChild(tree)
	}

	invalidate() {
		this.render()
	}

	/**********************************************************************************/

	static root(selector, tree) {
		return new Puer(selector, tree)
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
			let [ css_class, attrs,    children, text     ] = Puer.arganize(args,
				[ 'string',  'object', 'array',  'string' ],
				[ '',        {},       [],       ''       ]
			)
			if (css_class) { attrs['class'] = css_class + (attrs['class'] ? ' ' + attrs['class'] : '')}
			if (text)      { attrs['text']  = text }

			// console.log(`${name}("${css_class}", ${JSON.stringify(attrs)}, [${children.length}], "${text}")`)
			
			for (const attr in attrs) {
				if (this.type(attrs[attr]) == 'function') {
					attrs[attr] = attrs[attr].name + '()'
				}
			}
			eval(`window.Puer${name} = class Puer${name} extends PuerHtmlElement {}`)
			return new window[`Puer${name}`](attrs, children)
		}
	}

	static _defineComponent(cls) {
		if (Puer[cls.name]) {
			throw `Could not register component ${cls.name}: already present $$`
		}
		Puer[cls.name] = (props, children) => {
			let instance = new cls(props, children)
			// console.log('defineComponent', instance)
			return instance
		}
	}

	static define(m) {
		if (Puer.type(m) === 'string') {
			return Puer._defineTag(m)
		}
		return Puer._defineComponent(m)
	}
}

/**********************************************************************************/

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

/**********************************************************************************/

class PuerObject {
	constructor() {
		this.classProperties = Object.getOwnPropertyNames(PuerComponent.prototype)
		this.className       = this.constructor.name
	}

	isInstanceProperty(prop) { return Object.prototype.hasOwnProperty.call(this, prop) }
	isClassProperty(prop)    { return this.classProperties.includes(prop.toString()) }
	isComputedProperty(prop) { return !this.isOwnProperty(prop) && !this.isClassProperty(prop) }
}

/**********************************************************************************/

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
				const value = target[prop];
				if (typeof value === 'object' && value !== null) {
					return PuerState._makeObservable(value, onChange)  // Recursive call for nested object
				}
				return value
			},
			set(target, prop, value) {
				let isChange = prop in target
				target[prop] = value
	
				// Additional condition for arrays
				if (Array.isArray(target)) {
					isChange = true  // Array changes are always considered as changes
				}
	
				if (isChange) {
					onChange(prop, value)
				}
	
				return true
			}
			})
		}
}

/**********************************************************************************/

class BasePuerComponent extends PuerObject {
	constructor(props, children) {
		super()
		this.parent   = null
		this.props    = props
		this.children = children
		this.state    = new PuerState(this.invalidate.bind(this))
		this.element  = null
		this.cssClass = this.className.replace(/([a-zA-Z])(?=[A-Z])/g, '$1-').toLowerCase()

		for (let n in children) { children[n].parent = this }
	}

	__onMount() {
		this.children && this.children.forEach(child => { child.__onMount() })
		return this.onMount()
	}
	__render() {
		this.children && this.children.forEach(child => { child.__render() })
		this.element = this.render()
		if (!(this.element instanceof Element)) {
			this.element = this.element.render()
		}
		this.element.classList.add(this.cssClass)
		return this.element
	}

	onMount() {}

	invalidate() {
		// console.log('invalidate')
		if (this.parent) {
			this.parent.invalidate()
		}
	}

	renderChildren() {
		return this.children && this.children.map(child => { return child.element })
	}

	render() {}  // To be defined in child classes

	toString() {
		return `${this.className}::${JSON.stringify(this.props)}`
	}
}

/**********************************************************************************/

class PuerHtmlElement extends BasePuerComponent {
	constructor(props, children) {
		super(props, children)
		// console.log('Creating', this.className, props)
	}

	_define() {} // Not defining custom component

	render() {
		let el = document.createElement(this.className.replace('Puer', ''))
		for (const prop in this.props) {
			if (prop !== 'text') {
				el.setAttribute(prop, this.props[prop])
			}
		}
		for (const child of this.children) {
			el.appendChild(child.element)
		}
		if (this.children.length == 0 && this.props['text']) {
			el.innerHTML = this.props['text']
		}
		return el
	}
}

/**********************************************************************************/

class PuerComponent extends BasePuerComponent {
	constructor(props, children) {
		super(props, children)
		// console.log('Creating', this.className, props)
	}
}

