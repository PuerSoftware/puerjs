import $ from '../../index.js'


class FormInput extends $.Component {
	constructor(props, children) {
		super(props, children)
		this.props.require('name')
		this.props.default('isHeader', false)
		this.props.default('autocomplete', 'off')
		this.props.default('disabled', false)

		this.form  = null
		this.input = null
		this.field = null

		this.disabledByDefault = this.props.disabled
	}
	
	set disabled(value) {
		this.field && this.field.toggleCssClass('disabled', value)
		if (value) {
			this.input.setAttribute('disabled', true)
		} else {
			this.input.element.removeAttribute('disabled')
		}
		this.props.disabled = value
	}

	get disabled() {
		return this.props.disabled
	}

	set value(value) {
		const oldValue = this.input.element.value
		this.input.element.value = value
		if (this.events.change && oldValue !== value) {
			this.events.change()
		}
	}

	get value() {
		return this.input && this.input.element
			? this.input.element.value
			: null
	}

	reset() {
		if (!this.disabledByDefault) {
			this.disabled = false
		}
		if (this.field) {
			this.field.error = ''
		}
		this.value = ''
	}

	onInit() {
		this.input.element.addEventListener('change', this.validate.bind(this))
		this.form  = this.$$$.Form[0]
		this.field = this.$$$.FormField[0]
		
		this.disabled = this.props.disabled
	}

	validate() {
		this.form && this.form.submit(false)
	}

	render() {
		this.input = $[this.props.tagName]({ ... this.props })
		this._eventTarget = this.input
		const beforeProps = this.events.beforeclick ? { onclick: this.events.beforeclick } : {}
		const afterProps  = this.events.afterclick  ? { onclick: this.events.afterclick }  : {}

		const children = [
			$.div('before', beforeProps),
			this.input,
			... this.children,
			$.div('after', afterProps)
		]

		return $.div(children)
	}
}

$.define(FormInput, import.meta.url)
export default FormInput