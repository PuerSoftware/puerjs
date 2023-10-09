import Puer, { PuerComponent, PuerError} from '../puer.js'
import Request                           from '../library/class.Request.js'


class FormInput extends PuerComponent {
    constructor(props) {
        super(props)
        this.form = null
    }
    
    onMount() {
        this.form = this.$$$.Form
        console.log(this.form)
    }

    validate() {
        let inputs = this.$$$.Form.$.Input
        console.log(inputs)
        console.log(this.$.input.element.value)
        if (this.props.validator) {
            if (this.form) {
                let url = this.form.props.validationUrl
                if (url) {
                    Request.get(url + this.props.validator, {value: this.$.input.element.value})
                        .then((response) => response.json())
                        .then((data) => {
                            console.log('Validation returned', data)
                        })
                        .catch(error => PuerError('Could not validate input:', error))
                } else {
                    throw new PuerError(
                        'To validate, parent form must define prop "validationUrl"', this.className, 'validate'
                    )
                }
            } else {
                throw new PuerError(
                    'To validate, must have instance of "Form" in a parent chain', this.className, 'validate'
                )
            }
        }
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