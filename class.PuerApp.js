class PuerApp {
    constructor(selector) {
		this.components  = {}
		this.dom         = null
		this.rootElement = document.querySelector(selector)
		// console.log('App', this.components)
	}

	init(rootConstructor) {
		this.rootConstructor = rootConstructor
		this.render()
		this.rootConstructor.instance.parent = this
		this.rootConstructor.__onMount()
	}

	render() {
		this.rootConstructor.__register('PuerApp', this, this)
		// console.log('PuerApp.render()', this.rootConstructor.instance)
		// console.log(this.components)
		this.dom = this.rootConstructor.__render('PuerApp')
		// let tree = this.dom.cloneNode(true)
		this.rootElement.innerHTML = null
		this.rootElement.appendChild(this.dom) // TODO: Virutalize dom
	}

	invalidate() {
		this.render()
	}

	
}

export default PuerApp