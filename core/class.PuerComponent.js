import Puer              from './class.Puer.js'
import BasePuerComponent from './class.BasePuerComponent.js'
import PuerState         from './class.PuerState.js'


class PuerComponent extends BasePuerComponent {
	constructor(props, children) {
		super(props, children)
		this.state     = new PuerState(this._onStateChange.bind(this))
		this.isCustom  = true
		this.cssClass  = this._computeCssClass()

		this.getMethods()
			.filter(method => method.startsWith('render') || method.startsWith('_render'))
			.map(method => {
				this[method] = Puer.defer(this[method], this)
			})
	}

	/********************** FRAMEWORK **********************/

	__render() {
		this.root = this.render()

        if (!this.root) {
            throw new PuerError('Must return component tree', this.className, 'render')
        }
        this.root.parent = this
		// console.log('__render root:', this.root)
		this.element = this.root.__render()
		this.element.setAttribute('class', this.cssClass)
		/*********************************************/
		if ('text' in this.props) {
			this.prepend(text(this.props.text))
		}
		/*********************************************/
		this._addEvents()
		return this.element
	}

	__update() {
		// console.log(`${this.className}.__update()`, this.children.length)
		this.props.touch()
		this.root.__update()
		// WARN: this.root.__update() will call twice if this.props has changes,
		// first time is called there, second -- in PuerComponent._onPropChange
		this.onUpdate()
	}

	__onReady() {
		this.root.__onReady()
		this.onReady()
	}

	/*********************** PRIVATE ***********************/

	_onPropChange(prop, oldValue, newValue) {
		this.root.__update()
	}

	_onStateChange() {
		this.root.__update()
		this.__update()
	}

	_computeCssClass() {
		return this.getPropsInProto('chainName', 'PuerComponent')
			.map(s => Puer.String.camelToDashedSnake(s))
			.join(' ')
	}
}

PuerComponent.prototype.chainName = 'PuerComponent'

export default PuerComponent