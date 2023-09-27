const $$ = new function() {
	const tags = 'a,abbr,address,area,article,aside,audio,b,base,bdi,bdo,blockquote,body,br,button,canvas,caption,cite,code,col,colgroup,data,datalist,dd,del,details,dfn,dialog,div,dl,dt,em,embed,fieldset,figcaption,figure,footer,form,h1,h2,h3,h4,h5,h6,head,header,hgroup,hr,html,i,iframe,img,input,ins,kbd,label,legend,li,link,main,map,mark,meta,meter,nav,noscript,object,ol,optgroup,option,output,p,param,picture,pre,progress,q,rp,rt,ruby,s,samp,script,section,select,small,source,span,strong,style,sub,summary,sup,table,tbody,td,template,textarea,tfoot,th,thead,time,title,tr,track,u,ul,var,video,wbr'.split(',')
	const _ = (args, types, defaults, norm_args=[]) => {
		if (types.length) {
			if (this.type(args[0]) == types.shift()) {
				defaults.shift()
				norm_args.push(args.shift())
			} else {
				norm_args.push(defaults.shift())
			}
			_(args, types, defaults, norm_args)
		}
		return norm_args
	}

	this.type = function type(o) {
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

	this.defineTag = (name) => {
		if (name in window) {
			throw `Could not register tag method ${name}: already present in global scope`
		}
		window[name] = (...args) => {
			let [css_class, attrs, children, text] = _(args, ['string', 'object', 'array', 'string'], [null, {}, [], ''])
			if (css_class) {
				attrs['class'] = css_class + (attrs['class'] ? ' ' + attrs['class'] : '')
			}
			if (text) {
				attrs['text'] = text
			}
			// console.log(css_class, attrs, children, text)

			eval(`window.Puer${name} = class Puer${name} extends PuerHtmlElement {}`)
			return new window[`Puer${name}`](attrs, children)
		}
	}

	this.defineComponent = (cls) => {
		if (cls.name in $$) {
			throw `Could not register component ${cls.name}: already present $$`
		}
		$$[cls.name] = (props, children) => {
			return new cls(props, children)
		}
	}

	for (const tag of tags) {
		this.defineTag(tag)
	}

}

class Puer {
	constructor(selector, tree) {
		tree.parent = this
		this.tree = tree
		this.dom  = null
		this.root = document.querySelector(selector)
		this.render()
	}

	render() {
		// console.log('Puer.render()')
		this.dom = this.tree.render()
		let tree = this.dom.cloneNode(true)
		this.root.innerHTML = null
		this.root.appendChild(tree)
	}

	rerender() {
		// console.log('Puer.rerender()')
		this.render()
	}
}

class PuerComponent {
	constructor(props, children) {
		this.parent          = null
		this.props           = props
		this.children        = children
		this.classProperties = Object.getOwnPropertyNames(PuerComponent.prototype)
		this.instanceVar     = 'I am an instance variable'
		this.className       = this.constructor.name

		for (let n in children) { children[n].parent = this }

		return new Proxy(this, {
			get(self, prop) {
				if (prop in self.props) {
					// console.log(`Getting component property: ${prop}`)
					return self.props[prop]
				} else if (self.isComputedProperty(prop)) {
					// console.log(`Getting computed or other property: ${prop}`)
				} else if (self.isOwnProperty(prop)) {
					// console.log(`Getting own property: ${prop}`)
				} else if (self.isClassProperty(prop)) {
					// console.log(`Getting class-defined property: ${prop}`)
				}
				// console.log('PROXY GETTER return', prop, self[prop])
				return self[prop]
			},
			set(self, prop, value) {
				if (prop in self.props) {
					// console.log(`Setting component property: ${prop} = ${value}`)
					self.props[prop] = value
					self.rerender()
				} else {
					self[prop] = value
				}
				return true  // Indicates that the property was set successfully
			},
			toString() {
				return self.toString()
			}
		})
	}

	rerender() {
		// console.log('rerender at', this.constructor.name)
		if (this.parent) {
			this.parent.rerender()
		}
	}

	render() {}  // To be defined in child classes

	isOwnProperty(prop) {
		return Object.prototype.hasOwnProperty.call(this, prop)
	}

	isClassProperty(prop) {
		return this.classProperties.includes(prop.toString())
	}

	isComputedProperty(prop) {
		return !this.isOwnProperty(prop) && !this.isClassProperty(prop)
	}

	toString() {
		return `${this.className}::${JSON.stringify(this.props)}`
	}
}


class PuerHtmlElement extends PuerComponent {
	constructor(props, children) {
		super(props, children)
		// console.log('Creating', this.className, props)
	}
	render() {
		let el = document.createElement(this.className.replace('Puer', ''))
		for (const attr in this.props) { el.setAttribute(attr, this.props[attr]) }
		for (const child of this.children) {
			let dom
			if (child instanceof PuerHtmlElement) {
				dom = child.render()
			} else {
				dom = child.render().render()
			}
			el.appendChild(dom)
		}
		if (!this.children.length && this.text) { el.innerHTML = this.text }
		return el
	}
}

class Custom extends PuerComponent {
	render() {
		return div('myclass', this.text)
	}
}
$$.defineComponent(Custom)

// let c = new Custom();
// c.dynamicVar = 'I am dynamically added';  // This will be an "own property"

// console.log(c.render);  // Should print "Accessing class-defined property: render"
// console.log(c.dynamicVar);  // Should print "Accessing own property: dynamicVar"
// console.log(c.someRandomProperty);  // Should print "Accessing computed or other property: someRandomProperty"
