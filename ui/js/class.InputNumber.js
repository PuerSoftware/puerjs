import $         from '../../index.js'
import InputText from './class.FormInput.js'


class InputNumber extends InputText {
	constructor( ... args ) {
		super( ... args )
		this.props.default('tagName', 'input')
		this.props.default('type',    'number')
	}
}

$.define(InputNumber, import.meta.url)
export default InputNumber