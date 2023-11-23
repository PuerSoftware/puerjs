import Puer, { PuerComponent } from '../../puer.js'


class FormInput extends PuerComponent {
	constructor(props, children) {
		super(props, children)
		this.props.require('name', this)
		this.props.default('autocomplete', 'off')
		this.form  = null
		this.value = this.props.value
	}

	_onChange(event) {
		console.log(this.props.name, '_onChange')
		this.validate()
		this.value = this.element.value
		this.events.change(event)
	}
	
	validate() {
		this.$$$.Form[0].validate(this.props.name)
	}

	render() {
		return input({
			... this.props,
			onchange: this._onChange,
		})
	}
}

Puer.define(FormInput, import.meta.url)
export default FormInput