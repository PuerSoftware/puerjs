import Puer, {PuerComponent} from '../puer.js'


class Form extends PuerComponent {
	constructor(props) {
		Puer.default(props, 'title',         'Form')
		Puer.default(props, 'subtitle',      'Please fill out this form')
		Puer.default(props, 'buttonCaption', 'Submit')
		Puer.default(props, 'action',        '')
		Puer.default(props, 'method',        'POST')
		Puer.default(props, 'enctype',       'application/x-www-form-urlencoded')
		super(props)
		this.state.error = ''
	}

	render() {
		return (
			div({autocomplete: 'off'}, [
				h1 ({text: this.props.title}),
				p  ({text: this.props.subtitle}),
				p  ({text: this.state.error, class: 'error form-error'}),
				form ({
					action  : this.props.action,
					method  : this.props.method,
					enctype : this.props.enctype
				}, [
					... this.children,
					p ([
						button ({type: 'submit', text: this.props.buttonCaption})
					])
				])
			])
		)
	}
}


Puer.UI.define(Form)
export {Form as PuerUiForm}