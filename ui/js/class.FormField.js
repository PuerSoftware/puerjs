import $ from '../../index.js'


class FormField extends $.Component {
	constructor(props, children) {
		super(props, children)
		this.props.default('label', '')
		this.state.error = ''
	}

	onUpdate() {
		if (!this.$$$.Form[0]) {
			throw new $.Error('FormField must be a descendent of Form!', this, 'onReady')
		}
	}

	set error(error) {
		this.state.error = error
		error
			? this.addCssClass('error')
			: this.removeCssClass('error')
	}

	get error() {
		return this.state.error		
	}

	render() {
		return $.div([
			$.label({text: this.props.label}),
			... this.children,
			$.div('error field-error', {text: this.state.error})
		])
	}
}

$.define(FormField, import.meta.url)
export default FormField