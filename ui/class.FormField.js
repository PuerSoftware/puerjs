import Puer, {
    PuerComponent,
    PuerError
} from '../puer.js'


class FormField extends PuerComponent {
    constructor(props) {
        Puer.default(props, 'label', 'Field label')
        super(props)
    }

    onMount() {
        if (!this.$$.PuerForm) {
            throw new PuerError('Must have PuerForm in a parent chain', 'PuerFormInput', 'render')
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

Puer.UI.define(FormField)
export { FormField as PuerUiFormField }