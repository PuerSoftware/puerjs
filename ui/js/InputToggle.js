import $         from '../../index.js'
import FormInput from './FormInput.js'


class InputToggle extends FormInput {
	constructor(props, children) {
		super(props, children)
		this.props.default('allowEmpty', true)
		this.props.default('selected', '1')
		this.props.default('options', [
			{value: '1', label: 'Yes'},
			{value: '0', label: 'No'}
		])

		this.props.type    = 'hidden'
		this.props.tagName = 'input'
		this.buttons       = null
		this.options       = {}
	}

	_onButtonClick(event) {
		this.value = event.targetComponent.props.value
		const s = this.value
	}

	/**********************************************************/

	set value(value) {
		value = value.toString()
		super.value = value
		for (const optionValue in this.options) {
			this.options[optionValue].toggleCssClass('selected', optionValue === value)
		}
	}

	get value() {
		return this.input.element.value
	}

	/**********************************************************/

	onSelectedChange(value) {
		this.value = value
	}

	onReady() {
		super.onReady && super.onReady()
		this.addOptions(this.props.options)

		this.value = this.props.selected
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
				option.label,
				this.props.selected && this.props.selected === option.value,
				option.cssClass
			)
		}
	}

	addOption(value, label, selected=false, cssClass=null) {
		const cssClasses = ['option']
		if (selected) { cssClasses.push('selected') }
		if (cssClass) { cssClasses.push(cssClass) }

		this.options[value] = $.div(cssClasses.join(' '), {
			text    : label,
			value   : value.toString(),
			onclick : this._onButtonClick.bind(this)
		})
		this.buttons.append(this.options[value])
	}

	removeOption(value) {
		this.options[value].remove()
		delete options[value]
	}

	// reset() {
	// 	// if (this.props.selected) {
	// 	// 	this.input.element.value = this.props.selected.toString()
	// 	// } else {
	// 	// 	if (this.props.allowEmpty) {
	// 	this.input.element.value = ''
	// 	// 	} else {
	// 	// 		this.input.element.value = null
	// 	// 	}
	// 	// }
	// 	// for (const optionValue in this.options) {
	// 	// 	this.options[optionValue].toggleCssClass('selected', optionValue === this.value)
	// 	// }
	// }

	render() {
		this.buttons = $.div('unselectable buttons')
		this.children = [
			this.buttons
		]
		return super.render()
	}
}

$.define(InputToggle, import.meta.url)
export default InputToggle
