import Puer, {PuerComponent} from '../puer.js'
import Request               from '../library/class.Request.js'


class Form extends PuerComponent {
	constructor(props, children) {
		super(props, children)
		this.props.require('validationUrl', this)

		this.props.default('title',         'Form')
		this.props.default('subtitle',      'Please fill out this form')
		this.props.default('buttonCaption', 'Submit')
		this.props.default('action',        '')
		this.props.default('method',        'POST')
		this.props.default('enctype',       'application/x-www-form-urlencoded')
		this.state.error = ''
	}

	validate(initiatorInputName) {
		let formData = {}
		for (const input of this.$$.FormInput) {
			formData[input.props.name] = {
				value          : input.element.value,
				validationType : input.props.validationType
			}
			if (input.props.name === initiatorInputName) {
				break
			}
		}
		Request.post(this.props.validationUrl, formData)
			.then((response) => {
				if (!response.ok) {
					throw new PuerError('Form validation failed', this, 'validate')
				}
				return response.json()
			})
			.then(data => {
				console.log('Validated data', data)
			})
			.catch(error => {
				console.error('Validate error', error)
			})
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