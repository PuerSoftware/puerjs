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
        if (!this.$$.ui_Form) {
            throw new PuerError('Must have ui_Form in a parent chain', this.className, 'render')
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

Puer.define('ui', FormField)
export default FormField