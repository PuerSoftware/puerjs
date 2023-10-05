import PuerConstructor from './class.PuerConstructor.js'


class PuerNamespace {
	constructor(name) {
		this.namespace = name
	}

	type(o) {
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

	define(cls) {
		if (this[cls.name]) {
			throw `Could not register component ${cls.name}: already present $$`
		}
		
		this[cls.name] = (...args) => {
			let [props,    children ] = this.arganize(args,
				['object', 'array'  ],
				[{},       []       ]
			)
			return new PuerConstructor(cls, props, children, true)
		}
	}

	defineNamespace(name) {
		this[name] = new PuerNamespace(name)
	}
}

export default PuerNamespace