import Puer, {PuerComponent} from '../../puer.js'


class InputHidden extends PuerComponent {
	render() {
		return input({ ... this.props, type: 'hidden' })
	}
}

Puer.define(InputHidden)
export default InputHidden