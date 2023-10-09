import Puer, {
    PuerComponent,
    PuerError
} from '../puer.js'


class FormField extends PuerComponent {
    constructor(props) {
        props.default('label', 'Field label')
        super(props)
    }

    onMount() {
        if (!this.$$$.Form) {
            throw new PuerError('Must have instance of "Form" in a parent chain', this.className, 'render')
        }
    }

    render() {
        return div([
            div('error field-error', {text: 'Unknown and scary error occured'}),
            label({text: this.props.label}),
            ... this.children
        ])
    }
}

Puer.define(FormField)
export default FormField