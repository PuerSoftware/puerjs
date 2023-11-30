import Puer, { PuerComponent } from '../../puer.js'


class FormInput extends PuerComponent {
	constructor(props, children) {
		super(props, children)
		this.props.require('name', this)
		this.props.default('isHeader', false)
		this.props.default('autocomplete', 'off')
		this.props.default('disabled', false)

		this.form  = null
		this.input = null
		this.field = null

	}
	
	set disabled(value) {
		this.field && this.field.toggleCssClass('disabled', value)
		if (value) {
			this.input.setAttribute('disabled', true)
		} else {
			console.log('disable input')
			this.input.removeAttribute('disabled')
		}
		this.props.disabled = value
	}

	get disabled() {
		return this.props.disabled
	}

	set value(value) {
		if (value) {
			this.input.element.value = value
		}
		this.events.change && this.events.change(event)
	}

	get value() {
		return this.input && this.input.element
			? this.input.element.value
			: null
	}

	onReady() {
		this.input.element.addEventListener('change', this.validate.bind(this))
		this.form  = this.$$$.Form[0]
		this.field = this.$$$.FormField[0]
		
		this.disabled = this.props.disabled
	}

	validate() {
		this.form && this.form.validate()
	}

	render() {
		this.input = window[this.props.tagName.value]({ ... this.props })
		const beforeProps = this.events.beforeclick ? { onclick: this.events.beforeclick } : {}
		const afterProps  = this.events.afterclick  ? { onclick: this.events.afterclick }  : {}

		return div([
			div('before', beforeProps),
			this.input,
			div('after', afterProps)
		])
	}
}

Puer.define(FormInput, import.meta.url)
export default FormInput