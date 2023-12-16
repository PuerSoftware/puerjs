import $ from '../../index.js'


class Button extends $.Component {
	constructor(props, children) {
		super(props, children)
		this.button = null

		this.PRIMARY   = 'primary'
		this.SECONDARY = 'secondary'
		this.NEUTRAL   = 'neutral'

		this.props.default('disabled', false)
	}

	set disabled(value) {
		this.toggleCssClass('disabled', value)
		if (value) {
			this._off('click', this.events.click)
		} else {
			this._on('click', this.events.click)
		}
		this.props.disabled = value
	}

	get disabled() {
		return this.props.disabled
	}

	render() {
		return $.a({...this.props.disabled})
	}
}

$.define(Button, import.meta.url)
export default Button