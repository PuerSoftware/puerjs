import Puer, { PuerComponent } from '../../puer.js'


class FormInput extends PuerComponent {
    constructor(props, children) {
        super(props, children)
        this.props.require('name', this)
        this.props.default('autocomplete', 'off')
        this.form = null
    }
    
    onUpdate() {
        this.form  = this.$$$.Form[0]
        this.field = this.$$$.FormField[0]
        if (!this.form) {
            throw new Puer.Error('FormInput must be a descendent of Form!', this, 'onReady')
        }
    }

    validate() {
        this.form && this.form.validate(this.props.name)
    }

    render() {
        return input({
            ... this.props.toObject(),
            onchange: this.validate,
        })
    }
}

Puer.define(FormInput, import.meta.url)
export default FormInput