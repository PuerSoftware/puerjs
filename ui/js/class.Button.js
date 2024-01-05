import $ from '../../index.js'


class Button extends $.Component {
	constructor(props, children) {
		super(props, children)

		this.PRIMARY   = 'primary'
		this.SECONDARY = 'secondary'
		this.NEUTRAL   = 'neutral'

		this.props.default('disabled', false)
		this.props.default('state',    '')
		this.props.default('states',   {})

		this._addedClasses = []
	}

	onPropStateChange(value) {
		if (value !== undefined) {
			const state = this.props.states[value]
			if (state) {
				this.props.text = state.label
				this._addedClasses.length && this.removeCssClass(... this._addedClasses)
				if (state.classes) {
					this._addedClasses = state.classes.split(' ')
					this.addCssClass(... this._addedClasses)
				}
			}
		}
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
		return $.a({... this.props.disabled})
	}
}

$.define(Button, import.meta.url)
export default Button