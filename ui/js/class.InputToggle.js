import $ from '../../puer.js'

import FormInput from './class.FormInput.js'


class InputToggle extends FormInput {
	constructor(props, children) {
		super(props, children)
		this.props.default('allowEmpty', true)

		this.props.type = 'hidden'
		this.buttons    = null
		this.options    = {}
	}

	/**********************************************************/

	set value(value) {
		super.value = value
		for (const optionValue in this.options) {
			this.options[optionValue].toggleCssClass('selected', optionValue === value)
		}
	}

	/**********************************************************/

	onSelectedChange(value) {
		this.value = value
	}

	onReady() {
		super.onReady()
		this.addOptions(this.props.options)
	}

	/**********************************************************/

	/*
		options = [
			{value: '', text: ''},
			...
			{value: '', text: ''}
		]
	*/
	addOptions(options) {
		for (let option of options) {
			this.addOption(
				option.value,
				option.text,
				this.props.selected && this.props.selected === option.value
			)
		}
	}

	addOption(value, text, selected=false) {
		const cssClasses = ['button']
		if (selected) { cssClasses.push('selected') }

		this.options[value] = $.div(cssClasses.join(' '))
		this.buttons.append(this.options[value])		
	}

	removeOption(value) {
		this.options[value].remove()
		delete options[value]
	}

	reset() {
		if (this.props.selected) {
			this.value = this.props.selected
		} else {
			if (this.props.allowEmpty) {
				this.value = '0'
			} else {
				this.value = null
			}
		}
	}

	render() {
		this.buttons = $.div('buttons')
		this.children = [
			this.buttons
		]
		return super.render()
	}
}

$.define(InputToggle, import.meta.url)
export default InputToggle