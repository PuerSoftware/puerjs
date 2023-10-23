import Puer              from './class.Puer.js'
import BasePuerComponent from './class.BasePuerComponent.js'
import PuerState         from './class.PuerState.js'


class PuerComponent extends BasePuerComponent {
	constructor(props, children) {
		super(props, children)
		this.state    = new PuerState(this._onStateChange.bind(this))
		this.cssClass = this._computeCssClass()
		this.isCustom = true

		this._deferRenderers()
	}

	/*********************** PRIVATE ***********************/

	_onPropChange(prop, oldValue, newValue) {
		this.root.__update()
	}

	_onStateChange(prop, oldValue, newValue) {
		this.root.__update()
		this.__update()
	}

	_setupRoot() {
		this.root = this.render()
        if (!this.root) {
            throw new Puer.Error('Must return component tree', this.className, 'render')
        }
        this.root.parent = this
	}

	_setupElement() {
		this.element = this.root.element
		this.element.setAttribute('class', this.cssClass)
	}

	_deferRenderers() {
		this.getMethods()
			.filter(method => method.startsWith('render') || method.startsWith('_render'))
			.map(method => {
				this[method] = Puer.defer(this[method], this)
			})
	}

	_computeCssClass() {
		return this.getPropsInProto('chainName', 'PuerComponent')
			.map(s => Puer.String.camelToKebab(s))
			.join(' ')
	}
}

PuerComponent.prototype.chainName = 'PuerComponent'

export default PuerComponent