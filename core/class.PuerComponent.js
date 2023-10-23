import Puer              from './class.Puer.js'
import BasePuerComponent from './class.BasePuerComponent.js'
import PuerState         from './class.PuerState.js'


class PuerComponent extends BasePuerComponent {
	constructor(props, children) {
		super(props, children)
		this.state    = new PuerState({}, this._onStateChange.bind(this))
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
        this.root.parent = this
	}

	_setupElement() {
		this.element = this.root.element
	}

	_deferRenderers() {
		this.getMethods()
			.filter(method => method.startsWith('render') || method.startsWith('_render'))
			.map(method => {
				this[method] = Puer.defer(this[method], this)
			})
	}

	_computeCssClass() {
		const classes = this.getPropsInProto('chainName', 'PuerComponent')
			.map(s => Puer.String.camelToKebab(s))
		classes.push(this.props['class'])
		return classes.join(' ')
	}

	/*********************** PUBLIC ***********************/

	render() {
		return div()
	}
}

PuerComponent.prototype.chainName = 'PuerComponent'

export default PuerComponent