import $, {PuerComponent}   from '../../../puer.js'


class FormPage extends PuerComponent {
	constructor(props, children) {
		super(props, children)
	}

	render() {
		return $.div([
			h3({text: this.props.title}),
			$.Form({validationUrl: '/validate'}, [
				$.FormField({label: 'Username'}, [
					$.InputText({
						type           : 'text',
						name           : 'username',
						validationType : 'username'
					}),
				]),
				$.FormField({label: 'Password'}, [
					$.InputText({
						type           : 'password',
						name           : 'password',
						validationType : 'password'
					}),
				])
			])
		])
	}
}

$.define(FormPage, import.meta.url)
export default FormPage