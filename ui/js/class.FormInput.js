import Puer, { PuerComponent } from '../../puer.js'


class FormInput extends PuerComponent {
    constructor(props, children) {
        super(props, children)
        this.props.require('name', this)
        this.props.default('autocomplete', 'off')
        this.form = null
        this.value = this.props.value
    }

    _onChange(event) {
        this.validate()
		const newValue = this.element.value 
        if (this.value === newValue ) {
			this.value = ''
		}
		this.value = newValue
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