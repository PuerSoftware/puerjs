import Puer, {
    PuerComponent,
    PuerError
} from '../puer.js'


class FormInput extends PuerComponent {
    constructor(props) {
        super(props)

    }
    
    onMount() {
        if (!this.$$.ui_Form) {
            throw new PuerError('Must have ui_Form in a parent chain', this.className, 'render')
        }
    }

    render() {
        return input({ ... this.props})
    }
}

Puer.define('ui', FormInput)
export default FormInput