import Puer, {PuerComponent} from '../../puer.js'


class InputButton extends PuerComponent {
	constructor( ... args ) {
		super( ... args )
		this.props.default('tagName', 'input')
		this.props.default('type',    'button')
		this.input = null
	}

	render() {
		return window[this.props.tagName.value]({ ... this.props })
	}
}

Puer.define(InputButton, import.meta.url)
export default InputButton