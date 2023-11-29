import Puer, {PuerComponent}   from '../../../puer.js'


class FormPage extends PuerComponent {
	constructor(props, children) {
		super(props, children)
	}

	render() {
		return div([
			h3({text: this.props.title}),
			Puer.Form({validationUrl: '/validate'}, [
				Puer.FormField({label: 'Username'}, [
					Puer.InputText({
						type           : 'text',
						name           : 'username',
						validationType : 'username'
					}),
				]),
				Puer.FormField({label: 'Password'}, [
					Puer.InputText({
						type           : 'password',
						name           : 'password',
						validationType : 'password'
					}),
				])
			])
		])
	}
}

Puer.define(FormPage, import.meta.url)
export default FormPage