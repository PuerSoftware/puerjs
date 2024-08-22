import $ from '../../index.js'

import FormInput from './FormInput.js'


export default class InputTextArea extends FormInput {
	constructor( ... args ) {
		super( ... args )
		this.props.default('tagName', 'textarea')
		this.props.default('type',    'text')
	}

	autoResize() {
		if (this.input && this.input.element) {
			this.input.element.style.height = 'auto';
			this.input.element.style.height = `${this.input.element.scrollHeight}px`;
		}
	}

	resetHeight() {
		if (this.input && this.input.element) {
			this.input.element.style.height = 'auto';
		}
	}

	render() {
		if (!this.props.isPreviewMode) {
			this.input = $[this.props.tagName]({
				...this.props,
				oninput: this.autoResize
			})
			const children = [
				this.input,
				...this.children,
			];
			return $.div(children)
		} else {
			return $.Box([
				$.div({text: this.state.value})
			])
		}
	}

	moveCaretDown() {
		document.execCommand('insertText', false, '\n')
	}
}

$.define(InputTextArea, import.meta.url)
