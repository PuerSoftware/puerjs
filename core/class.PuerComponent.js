import Puer              from './class.Puer.js'
import BasePuerComponent from './class.BasePuerComponent.js'
import PuerState         from './class.PuerState.js'


class PuerComponent extends BasePuerComponent {
	constructor(props, owner) {
		super(props, owner)
		this.state     = new PuerState(this.invalidate.bind(this))

		this.getMethods()
			.filter(method => method.startsWith('render') || method.startsWith('_render'))
			.map(method => {
				this[method] = Puer.deferrer(this[method], this)
			})
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

	/*********************** PRIVATE ***********************/

	_renderDom() {
		if (this.root) {
			return this.root._renderDom()
		}
		return null
	}

	/********************* DOM METHODS *********************/

	append(child) {
		// child = Puer.defer(child)
		child.parent = this
		this.children.push(child)
		// console.log(this.children)

		this.invalidate()
	}

	prepend(child) {
		// child = Puer.defer(child)
		child.parent = this
		this.children.unshift(child)
		this.invalidate()
	}
}

PuerComponent.prototype.chainName = 'PuerComponent'

export default PuerComponent