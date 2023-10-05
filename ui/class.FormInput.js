import Puer, {
    PuerComponent,
    PuerError
} from '../puer.js'


class FormInput extends PuerComponent {
    constructor(props) {
        super(props)

    }
    
    onMount() {
        if (!this.$$.PuerForm) {
            throw new PuerError('Must have PuerForm in a parent chain', 'PuerFormInput', 'render')
        }
    }

    render() {
        return input({ ... this.props})
    }
}

Puer.UI.define(FormInput)
export default FormInput//{ FormInput as PuerUiFormInput }