class PuerRoot {
    constructor(selector, tree) {
		tree.parent = this
		this.tree = tree
		this.dom  = null
		this.root = document.querySelector(selector)
		this.render()
		this.tree.__onMount()
	}

	render() {
		this.dom = this.tree.__render()
		// let tree = this.dom.cloneNode(true)
		this.root.innerHTML = null
		this.root.appendChild(this.dom) // TODO: Virutalize dom
	}

	invalidate() {
		this.render()
	}
}

export default PuerRoot