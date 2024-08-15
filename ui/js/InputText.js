import $ from '../../index.js'

import FormInput from './FormInput.js'


class InputText extends FormInput {
	constructor( ... args ) {
		super( ... args )
		this.props.default('tagName', 'input')
		this.props.default('type',    'text')
	}
}

$.define(InputText, import.meta.url)
export default InputText
