import $                 from './Puer.js'
import BasePuerComponent from './BasePuerComponent.js'
import PuerProxy         from './PuerProxy.js'


class PuerComponent extends BasePuerComponent {
	constructor(props, children) {
		super(props, children)
		this.state     = new PuerProxy({}, '_onStateChange', this)
		this.classes   = this._computeClasses()
		this.isCustom  = true
		this.props.default('mixins', []) // [{mixin: mixinClass, data: data}]
	}

	/********************** FRAMEWORK **********************/
	__init() {
		for (const mixin of this.props.mixins) {
			this.mixin(mixin.mixin, mixin.data)
		}

		super.__init()
	}

	__ready() {
		super.__ready()
		for (const prop in this.props) {
			this._onPropChange(prop)
		}
	}

	/*********************** PRIVATE ***********************/

	_onPropChange(prop) {
		this._applyProp(prop)
		const propCamelized = $.String.camelToUpper(prop)
		const methodName    = `onProp${propCamelized}Change`
		return this[methodName] && this[methodName](this.props[prop])
	}

	_onStateChange(prop) {
		this._applyProps()
		const propCamelized = $.String.camelToUpper(prop)
		const methodName    = `onState${propCamelized}Change`
		return this[methodName] && this[methodName](this.state[prop])
	}

	_setupRoot() {
		$.owner   = this
		this.root = this.render()
		if (!this.root) {
			throw `${this.className}.render() did not return anything`
		}
		$.owner = null
        this.root.parent = this
	}

	_setupElement() {
		this.element = this.root.element
	}

	_computeClasses() {
		return this.getPropsInProto('chainName', 'PuerComponent')
			.map(s => $.String.camelToKebab(s))
			.concat(this.classes)
	}

	/*********************** PUBLIC ***********************/

	render() {
		return $.div()
	}
}

PuerComponent.prototype.chainName = 'PuerComponent'

export default PuerComponent
