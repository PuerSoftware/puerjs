import Puer              from './class.Puer.js'
import BasePuerComponent from './class.BasePuerComponent.js'
import PuerState         from './class.PuerState.js'


class PuerComponent extends BasePuerComponent {
	constructor(props, children) {
		super(props, children)	
		this.state     = new PuerState({}, this._onStateChange.bind(this))
		this.classes   = this._computeClasses()
		this.isCustom  = true
		this.listeners = {}

		this._deferRenderers()

	}

	/********************** FRAMEWORK **********************/
	
	__ready() {
		super.__ready()
		for (const prop in this.props) {
			this._onPropChange(prop, null, this.props[prop])
		}
	}

	/*********************** PRIVATE ***********************/

	_onPropChange(prop, oldValue, newValue) {
		this.root && this.root.__update()

		const propCamelized = Puer.String.camelToUpper(prop)
		const methodName    = `on${propCamelized}Change`

		return this[methodName] && this[methodName](Puer.dereference(newValue), Puer.dereference(oldValue))
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
				this[method] = Puer.referencer(this[method], this)
			})
	}

	_computeClasses() {
		return this.getPropsInProto('chainName', 'PuerComponent')
			.map(s => Puer.String.camelToKebab(s))
			.concat(this.classes)
	}

	/*********************** PUBLIC ***********************/

	render() {
		return div()
	}

	on(name, f, options) {
		this.listeners[name] = (...args) => {
			if (this.isActive()) {
				// console.log(name, this.className)
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