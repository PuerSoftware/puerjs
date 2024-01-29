import $         from '../../index.js'
import FormInput from './class.FormInput.js'


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
		console.log('onToggle cliec', event.targetComponent)
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
				this.props.selected && this.props.selected === option.value
			)
		}
	}

	addOption(value, label, selected=false) {
		const cssClasses = ['option']
		if (selected) { cssClasses.push('selected') }

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
		this.buttons = $.div('unselectable buttons')
		this.children = [
			this.buttons
		]
		return super.render()
	}
}

$.define(InputToggle, import.meta.url)
export default InputToggle