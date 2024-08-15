import $ from '../../index.js'


export default class Tag extends $.Component {
	constructor(... args) {
		super(... args)
		this.props.default('label', '')
		this.props.default('isRemovable', true)
		this.props.default('data',        null)

		this._closeButton = null
	}

	_onClose() {
		this.trigger($.Event.TAG_REMOVE, {label: this.props.label})
		this.remove()
	}

	_onClick() {
		this.trigger($.Event.TAG_CLICK, {label: this.props.label})
	}

	get data() {
		return this.props.data
	}

	render() {
		const components = [
			$.div({
				text    : this.props.label,
				onclick : this._onClick.bind(this)
			}, this.children)
		]
		if (this.props.isRemovable) {
			this._closeButton = $.Link({
				text    : 'x',
				onclick : this._onClose
			})
			components.push(this._closeButton)
		}
		return $.Columns('unselectable', components)
	}
}

$.define(Tag, import.meta.url)