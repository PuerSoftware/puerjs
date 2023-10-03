import BasePuerComponent from './class.BasePuerComponent.js'


class PuerComponent extends BasePuerComponent {
	constructor(props, children) {
		super(props, children)
	}

	/********************** FRAMEWORK **********************/

	__render() {
		super.__render()
		if (!this.element) {
			this.rootConstructor        = this.render()
			this.rootConstructor.parent = this
			this.rootConstructor.__render()

			let rendered = this.rootConstructor
			if (!(this.rootConstructor  instanceof Element)) {
				rendered = this.rootConstructor.render()
			}
			this.element = rendered
			this.element.classList.add(this.cssClass)
			
			this._addEvents()
		} else {
			this.rootConstructor.__render()
		}
		return this.element
	}

	/********************** PREDICATE **********************/

	checkType() {
		return this.className
	}

	isCustom() {
		return true
	}
}


export default PuerComponent