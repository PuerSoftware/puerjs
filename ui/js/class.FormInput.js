import Puer, { PuerComponent } from '../../puer.js'


class FormInput extends PuerComponent {
    constructor(props, children) {
        super(props, children)
        this.props.require('name', this)
        this.props.default('autocomplete', 'off')
        this.form = null
    }
    
    validate() {
        console.log('FormInput.onChange()', this.props.name)
        this.$$$.Form[0].validate(this.props.name)
    }

    render() {
        return input({
            ... this.props,
            onchange: this.validate,
        })
    }
}

Puer.define(FormInput, import.meta.url)
export default FormInput