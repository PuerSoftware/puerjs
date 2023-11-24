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
			console.log('set', this.input.element)
			this.input.element.value = value
			console.log('setted', this.input.element.value)
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
		return div([
			this.input	
		])
	}
}

Puer.define(FormInput, import.meta.url)
export default FormInput