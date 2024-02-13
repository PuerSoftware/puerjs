import $ from '../../index.js'

import FormInput from './class.FormInput.js'


export default class InputTextArea extends FormInput {
	constructor( ... args ) {
		super( ... args )
		this.props.default('tagName', 'textarea')
		this.props.default('type',    'text')
	}
}

$.define(InputTextArea, import.meta.url)