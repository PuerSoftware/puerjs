import $ from '../../index.js'


class InputButton extends $.Component {
	constructor( ... args ) {
		super( ... args )
		this.props.default('tagName', 'input')
		this.props.default('type',    'button')
		this.props.default('disabled', false)
		this.input = null
	}

	set disabled(value) {
		this.field && this.field.toggleCssClass('disabled', value)
		this.toggleCssClass('disabled', value)
		if (value) {
			this.element.setAttribute('disabled', true)
		} else {
			this.element.removeAttribute('disabled')
		}
		this.props.disabled = value
	}

	get disabled() {
		return this.props.disabled
	}

	onInit() {
		this.disabled = this.props.disabled
	}
	
	render() {
		return $[this.props.tagName]({ ... this.props })
	}
}

$.define(InputButton, import.meta.url)
export default InputButton