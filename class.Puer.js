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
		this.root.appendChild(this.dom) // TODO: Virutalize dom
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
			let [ css_class, attrs,    children, text     ] = Puer.arganize(args,
				[ 'string',  'object', 'array',  'string' ],
				[ '',        {},       [],       ''       ]
			)
			if (css_class) { attrs['class'] = css_class + (attrs['class'] ? ' ' + attrs['class'] : '')}
			if (text)      { attrs['text']  = text }

			// console.log(`${name}("${css_class}", ${JSON.stringify(attrs)}, [${children.length}], "${text}")`)
			
			// for (const attr in attrs) {
			// 	if (this.type(attrs[attr]) == 'function') {
			// 		attrs[attr] = attrs[attr].name + '()'
			// 	}
			// }
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

export default Puer