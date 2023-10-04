class PuerApp {
    constructor(selector) {
		this.components    = {}
		this.rootComponent = null
		this.dom           = null
		this.rootElement   = document.querySelector(selector)
		// console.log('App', this.components)
	}

	init(rootConstructor) {
		this.rootConstructor = rootConstructor
		this.render()
		this.rootConstructor.instance.parent = this
		this.rootConstructor.__onMount()
		console.log('MOUNTED:', this.dom)
	}

	render() {
		console.log(this.components)
		this.rootComponent = this.rootConstructor.__register()
		console.log(this.components)
		console.log('REGISTERED:', this.toString())
		// console.log('PuerApp.render()', this.rootConstructor.instance)
		// console.log(this.components)
		this.dom = this.rootConstructor.__render('PuerApp')
		// let tree = this.dom.cloneNode(true)
		this.rootElement.innerHTML = null
		this.rootElement.appendChild(this.dom) // TODO: Virutalize dom
		console.log('RENDERED', this.dom)
	}

	toString(root, indent='') {
		s = ''
		root = root || this.rootComponent
		s += indent + root.toString() + '\n'
		if (root.isCustom) {
			s += this.toString(root.root, indent + '  ')
		} else {
			for (let child of root.children) {
				s += this.toString(child, indent + '  ')
			}
		}
		return s
	}

	invalidate() {
		console.log('APP INVALIDATE')
		this.render()
	}

	
}

export default PuerApp