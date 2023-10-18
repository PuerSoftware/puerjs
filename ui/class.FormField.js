import Puer, {
    PuerComponent,
    PuerError
} from '../puer.js'


class FormField extends PuerComponent {
    constructor(props, children) {
        super(props, children)
        this.props.default('label', 'Field label')
        this.state.error = ''
    }

    onReady() {
        if (!this.$$$.Form[0]) {
            throw new PuerError('FormField must be a descendent of Form!', this, 'onReady')
        }
    }

    onValidate(data) {
        this.state.error = data.error || ''
    }

    render() {
        return div([
            div('error field-error', {text: this.state.error}),
            label({text: this.props.label}),
            ... this.children
        ])
    }
}

Puer.define(FormField)
export default FormField