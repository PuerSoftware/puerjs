import Puer from '../../puer.js'

import FormInput from './class.FormInput.js'


class InputText extends FormInput {
	constructor( ... args ) {
		super( ... args )
		this.props.default('tagName', 'input')
		this.props.default('type',    'text')
	}
}

Puer.define(InputText, import.meta.url)
export default InputText