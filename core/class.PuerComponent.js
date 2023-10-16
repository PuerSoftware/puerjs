import Puer              from './class.Puer.js'
import BasePuerComponent from './class.BasePuerComponent.js'
import PuerState         from './class.PuerState.js'


class PuerComponent extends BasePuerComponent {
	constructor(props, children) {
		super(props, children)
		this.state     = new PuerState(this.invalidate.bind(this))
		this.isCustom  = true

		this.getMethods()
			.filter(method => method.startsWith('render') || method.startsWith('_render'))
			.map(method => {
				this[method] = Puer.deferrer(this[method], this)
			})
	}

	/********************** FRAMEWORK **********************/


	__register(path='PuerApp', index=0) {
		super.__register(path, index)
		this.tree = this.render()
        if (!this.tree) {
            throw new PuerError('Must return component tree', this.className, 'render')
        }
        this.root = this.tree.__register(this.path)
        this.root.parent = this
        return this
	}

	__render() {
		// console.log('__render', this.id, this.parent)
		this.element = this.root.__render()
		this.element.classList.add(this.cssClass)
		this._addEvents()
		return this.element
	}

	__update() {
		this.root.__update()
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

	_onPropChange(prop) {
		super._onPropChange(prop)
		const onChangeFuncName = `onChange${Puer.String.capitalize(prop)}`
		if (this.hasOwnMethod(onChangeFuncName)) {
			this[onChangeFuncName].bind(this)(this.props[prop])
		}
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