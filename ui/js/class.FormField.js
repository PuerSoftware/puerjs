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
		return Puer.div([
			Puer.label({text: this.props.label}),
			... this.children,
			Puer.div('error field-error', {text: this.state.error})
		])
	}
}

Puer.define(FormField, import.meta.url)
export default FormField