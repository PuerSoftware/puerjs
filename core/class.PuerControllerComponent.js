import $             from './class.Puer.js'
import PuerComponent from './class.PuerComponent.js'
import {Controller}  from '../library/index.js'

export default class PuerControllerComponent extends PuerComponent {
	constructor(props, children) {
		super(props, children)
		this._controller     = null
		this.controllerClass = Controller
		this.on($.Event.APP_COMPLETE, this.initController)
	}

	initController() {
		this._controller = new this.controllerClass(this)
	}

	onActivate() {
		if (!this._controller) {
			this.initController()
		}
		$.app.activeController = this._controller
	}

	onDeactivate() {
		$.app.activeController = null
		this.deactivate()
	}

	get controller() {
		return this._controller
	}

}

PuerControllerComponent.prototype.chainName = 'PuerControllerComponent'