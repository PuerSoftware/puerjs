import $ from './class.Puer.js'


class PuerApp extends $.ControllerComponent {
    constructor(props, children) {
    	super(props, children)
	    this._activeController = this._controller || null
    	this.props.default('onReady', () => {})
    	this.__render()
    	this.css('display', 'none')
	}

	_onAppClick(event) {
		this.trigger($.Event.APP_CLICK, {event: event})
	}

	_onAppKeyUp(event) {
		this.trigger($.Event.APP_KEYUP, {event: event})
		if (event.keyCode === 27) {
			this.trigger($.Event.APP_ESCAPE, {event: event})
		}
	}

	__complete() {
		this.onComplete && this.onComplete()
		this.trigger($.Event.APP_COMPLETE, {
			data: [],
			name: 'app'
		})
	}

	__onBeforeRoute(path, byUser) {
		return this._activeController
			? this._activeController.onBeforeRoute(path, byUser)
			: true
	}

	__onBeforeEvent(e) {
		return this._activeController
			? this._activeController.onBeforeEvent(e)
			: true
	}

	__ready() {
		super.__ready()
		$.Router.start()
		this.props.onReady && this.props.onReady()
		this.css('display', 'block') // Display after css has loaded
	}

	__render() {
		super.__render()
		document.body.appendChild(this.element)
		this.__rendered()

		this._on('click', this._onAppClick)
		this._on('keyup', this._onAppKeyUp)
		return this.element
	}
	route(path, query=null, byUser) {
		$.Router.navigate(path, query, byUser)
	}

	toTreeString(root, indent='') {
		let s = ''
		if (root) {
			s += indent + root.toString() + '\n'
		} else {
			root = this.root
			s += indent + this.toString() + '\n'
		}
		if (root.isCustom) {
			s += this.toTreeString(root.root, indent + '  ')
		} else {
			for (let child of root.children) {
				s += this.toTreeString(child, indent + '  ')
			}
		}
		return s
	}

	get activeController() {
		return this._activeController
	}

	set activeController(controller) {
		this._activeController = controller || this._controller
	}
}

$.define(PuerApp)
export default PuerApp