import Puer, { PuerComponent } from '../../puer.js'


class FormInput extends PuerComponent {
	constructor(props, children) {
		super(props, children)
		this.props.require('name', this)
		this.props.default('autocomplete', 'off')
		this.form  = null
	}
	
	set value(value) {
		if (value) {
			this.element.value = value
		}
		this.events.change && this.events.change(event)
	}

	get value() {
		return this.element
			? this.element.value
			: null
	}

	validate() {
		this.$$$.Form[0].validate(this.props.name)
	}

	onReady() {
		this.element.addEventListener('change', this.validate.bind(this))
	}

	render() {
		return input({
			... this.props,
		})
	}
}

Puer.define(FormInput, import.meta.url)
export default FormInput