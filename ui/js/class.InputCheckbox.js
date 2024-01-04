import $         from '../../index.js'
import FormInput from './class.FormInput.js'


export default class InputCheckbox extends FormInput {
	constructor(... args) {
		super(... args)
		this.props.default('text', '')

		this.props.tagName = 'input'
		this.props.type    = 'checkbox'
	}

	_onChange(event) {
		this.trigger($.Event.LIST_ITEM_CHECK, {
			name       : this.props.name,
			isChecked  : this.value,
			data       : this.props.data
		})
	}

	set value(value) {
		value          = value || false
		const oldValue = this.input.element.checked
		this.input.element.checked = value
		if (oldValue !== value) {
			this._trigger('change')
		}
	}

	get value() {
		return this.input.element.checked
	}

	onInit() {
		super.onInit()
		this._on('click', (e) => {e.stopPropagation()})
	}

	render() {
		const label   = $.label('unselectable', {text: this.props.label})
		this.children.push(label)
		const _render = super.render()
		label.props.for = this.input.id
		return _render
	}
}

$.define(InputCheckbox, import.meta.url)