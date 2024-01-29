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
		this.sendCheckEvent()
	}

	sendCheckEvent(isResend=false) {
		this.trigger($.Event.LIST_ITEM_CHECK, {
			name       : this.props.name,
			data       : this.props.data,
			isChecked  : this.value,
			isResend   : isResend
		})
	}

	set value(value) {
		value          = value || false
		const oldValue = this.input.element.checked
		this.input.element.checked = value
		this._triggerChange(oldValue, value)
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