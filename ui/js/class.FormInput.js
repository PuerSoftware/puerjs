import Puer, { PuerComponent } from '../../puer.js'


class FormInput extends PuerComponent {
	constructor(props, children) {
		super(props, children)
		this.props.require('name', this)
		this.props.default('autocomplete', 'off')

		this.form  = null
		this.input = null
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

	validate() {
		this.$$$.Form[0].validate(this.props.name)
	}

	onReady() {
		this.input.element.addEventListener('change', this.validate.bind(this))
	}

	render() {
		this.input = window[this.props.tagName]({ ... this.props })
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