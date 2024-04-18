import PuerObject from '../core/class.PuerObject.js'


export default class Controller extends PuerObject {
	static $($) { window.$ = $ }

	constructor(component) {
		super()
		this._component = component
	}

	get component() { return this._component }

	onBeforeRoute(path, byUser) { return true }
	onBeforeEvent(e)    { return true }
}
