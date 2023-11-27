import Puer, {PuerComponent} from '../../puer.js'


class FormField extends PuerComponent {
	constructor(props, children) {
		super(props, children)
		this.props.default('label', '')
		this.state.error = ''
	}

	onUpdate() {
		if (!this.$$$.Form[0]) {
			throw new Puer.Error('FormField must be a descendent of Form!', this, 'onReady')
		}
	}

	setError(error) {
		console.log('FormField.onValidate', error)
		this.state.error = error
		error
			? this.addCssClass('error')
			: this.removeCssClass('error')
	}

	render() {
		return div([
			label({text: this.props.label}),
			... this.children,
			div('error field-error', {text: this.state.error})
		])
	}
}

Puer.define(FormField, import.meta.url)
export default FormField