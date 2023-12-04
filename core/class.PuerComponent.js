import Puer              from './class.Puer.js'
import BasePuerComponent from './class.BasePuerComponent.js'
import PuerProxy         from './class.PuerProxy.js'


class PuerComponent extends BasePuerComponent {
	constructor(props, children) {
		super(props, children)	
		this.state     = new PuerProxy({}, '_onStateChange', this)
		this.classes   = this._computeClasses()
		this.isCustom  = true
		this.listeners = {}
	}

	/********************** FRAMEWORK **********************/
	
	__ready() {
		super.__ready()
		for (const prop in this.props) {
			this._onPropChange(prop)
		}
	}

	/*********************** PRIVATE ***********************/

	_onPropChange(prop) {
		this._applyProp(prop)
		const propCamelized = Puer.String.camelToUpper(prop)
		const methodName    = `on${propCamelized}Change`
		return this[methodName] && this[methodName](this.props[prop])
	}
	
	_onStateChange(prop) {
		this._applyProps()
	}

	_setupRoot() {
		Puer.owner = this
		this.root  = this.render()
		Puer.owner = null
        this.root.parent = this
	}

	_setupElement() {
		this.element = this.root.element
	}

	_computeClasses() {
		return this.getPropsInProto('chainName', 'PuerComponent')
			.map(s => Puer.String.camelToKebab(s))
			.concat(this.classes)
	}

	/*********************** PUBLIC ***********************/

	render() {
		return Puer.div()
	}

	on(name, f, options) {
		this.listeners[name] = (...args) => {
			if (this.isActive()) {
				f.bind(this)(...args)
			}
		}
		Puer.Events.on(name, this.listeners[name], options)
	}

	once(name, f, options) {
		Puer.Events.once(name, f.bind(this), options)
	}

	off(name) {
		this.listeners[name] && Puer.Events.off(name, this.listeners[name])
	}

	trigger(name, data) {
		data.targetComponent = this
		Puer.Events.trigger(name, data)
	}
}

PuerComponent.prototype.chainName = 'PuerComponent'

export default PuerComponent