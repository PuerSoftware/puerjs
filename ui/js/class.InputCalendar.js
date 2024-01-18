import $ from '../../index.js'

import FormInput from './class.FormInput.js'


class InputCalendar extends FormInput {
	constructor( ... args ) {
		super( ... args )
		this.props.default('tagName', 'input')
		this.props.default('type',    'text')
	}

	_onClick(event) {
		console.log('haha')
	}

	onInit() {
		super.onInit()
		this._on('click', this._onClick)
	}

	render() {
		const label = $.label('unselectable', {text: this.props.label})
		this.children.push(label)
		return super.render()
	}
}

$.define(InputCalendar, import.meta.url)
export default InputCalendar