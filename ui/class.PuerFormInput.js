import Puer, {
    PuerComponent,
    PuerError
} from '../puer.js'


class PuerFormInput extends PuerComponent {
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

Puer.define(PuerFormInput)
export default PuerFormInput