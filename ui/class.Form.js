import Puer, {PuerComponent} from '../puer.js'


class Form extends PuerComponent {
	constructor(props, children) {
		props.default('title',         'Form')
		props.default('subtitle',      'Please fill out this form')
		props.default('buttonCaption', 'Submit')
		props.default('action',        '')
		props.default('method',        'POST')
		props.default('enctype',       'application/x-www-form-urlencoded')
		super(props, children)
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


Puer.define(Form)
export default Form