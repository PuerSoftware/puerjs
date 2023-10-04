import BasePuerComponent from './class.BasePuerComponent.js'


class PuerComponent extends BasePuerComponent {
	constructor(props) {
		super(props)
	}

	/********************** FRAMEWORK **********************/

	__render() {
		// console.log('__render', this.id, this.parent)
		this.element = this.root.__render()
		this.element.classList.add(this.cssClass)
		this._addEvents()
		return this.element
	}

	__onMount() {
		this.root.__onMount()
		this.onMount()
	}

	/********************** PREDICATE **********************/

	checkType() {
		return this.className
	}

	isCustom() {
		return true
	}

	/********************* DOM METHODS *********************/

	append(child) {
		child.parent = this
		this.children.push(child)
		console.log(this.children)
		this.invalidate()
	}

	prepend(child) {
		child.parent = this
		this.children.unshift(child)
		this.invalidate()
	}
}


export default PuerComponent