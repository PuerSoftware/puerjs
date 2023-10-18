import Puer, { PuerComponent, PuerError} from '../puer.js'


class FormInput extends PuerComponent {
    constructor(props, children) {
        super(props, children)
        this.props.require('name', this)
        this.props.require('validationType', this)
        this.form = null
    }
    
    onUpdate() {
        this.form  = this.$$$.Form[0]
        this.field = this.$$$.FormField[0]

        if (!this.form) {
            throw new PuerError('FormInput must be a descendent of Form!', this, 'onReady')
        }
    }

    validate() {
        this.form.validate(this.props.name)
    }

    render() {
        return input({
            ... this.props,
            onchange : this.validate
        })
    }
}

Puer.define(FormInput)
export default FormInput