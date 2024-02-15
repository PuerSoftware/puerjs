import $ from '../../index.js'

import FormInput from './class.FormInput.js'


export default class InputTextArea extends FormInput {
	constructor( ... args ) {
		super( ... args )
		this.props.default('tagName', 'textarea')
		this.props.default('type',    'text')
	}

	moveCaretDown() {
		document.execCommand('insertText', false, '\n')
	}
}

$.define(InputTextArea, import.meta.url)