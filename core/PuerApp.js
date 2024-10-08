import $ from './Puer.js'


export default class PuerApp extends $.Component {
    constructor(props, children) {
		super(props, children)
		this.props.default('onReady', () => {})
		this.__render()
		this.css('display', 'none')
	}

	_onAppClick(event) {
		this.trigger($.Event.APP_CLICK, {event: event})
	}

	_onAppKeyUp(e) {
		this.trigger($.Event.APP_KEYUP, {event: e})
		const key = $.Constants.KeyCodeToKey[e.keyCode]
		key && this.trigger($.Event[`APP_${key}`], {event: e})
	}

	__complete() {
		this.onComplete && this.onComplete()
		this.trigger($.Event.APP_COMPLETE, {
			data: [],
			name: 'app'
		})
	}

	__ready() {
		super.__ready()
		this.hasPropInTree('route') && $.Router.start()
		this.props.onReady && this.props.onReady()
		this.css('display', 'block') // Display after css has loaded
	}

	__render() {
		super.__render()
		document.body.appendChild(this.element)
		this.__rendered()

		document.addEventListener('click', this._onAppClick.bind(this))
		document.addEventListener('keyup', this._onAppKeyUp.bind(this))
		this.onRender && this.onRender()
		return this.element
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
}

$.define(PuerApp)
