import $ from '../../index.js'


class InputButton extends $.Component {
	constructor( ... args ) {
		super( ... args )
		this.props.default('tagName', 'input')
		this.props.default('type',    'button')
		this.input = null
	}
	
	render() {
		return $[this.props.tagName]({ ... this.props })
	}
}

$.define(InputButton, import.meta.url)
export default InputButton