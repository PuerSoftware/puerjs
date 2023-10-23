import Puer, {PuerComponent} from '../../puer.js'
import Request               from '../../library/class.Request.js'


class Form extends PuerComponent {
	constructor(props, children) {
		super(props, children)
		this.props.default('title',         'Form')
		this.props.default('subtitle',      'Please fill out this form')
		this.props.default('buttonCaption', 'Submit')
		this.props.default('action',        '')
		this.props.default('method',        'POST')
		this.props.default('enctype',       'application/x-www-form-urlencoded')
		this.props.default('autocomplete',  'off')
		this.state.error = ''
	}

	onUpdate() {
		this.inputs = this.$$.FormInput
		this.fields = this.$$.FormField
	}

	onValidate(data) {
		console.log('Validated data', data)
		this.state.error = data.error || ''
		if (data.error) {
			for (const input of this.inputs) {
				if (input.props.name in data.fields) {
					if (input.field) {
						console.log(input.field.element, input.props.name, data.fields[input.props.name])
						input.field.onValidate(data.fields[input.props.name])
					}
				}
			}
		}
	}

	validate(initiatorInputName) {
		let formData = {}
		for (const input of this.inputs) {
			formData[input.props.name] = {
				value          : input.element.value,
				validationType : input.props.validationType || ''
			}
			if (input.props.name === initiatorInputName) {
				break
			}
		}
		if (this.props.validationUrl) {
			Request.post(this.props.validationUrl, formData)
				.then((response) => {
					if (!response.ok) {
						const error      = 'Form validation failed'
						this.state.error = error
						throw new Puer.Error(error, this, 'validate')
					}
					return response.json()
				})
				.then(this.onValidate.bind(this))
				.catch(error => {
					console.error('Validate error', error)
				})
		}
	}

	render() {
		return (
			div([
				h1 ({text: this.props.title}),
				p  ({text: this.props.subtitle}),
				p  ({text: this.state.error, class: 'error form-error'}),
				form ({
					autocomplete : this.props.autocomplete,
					action       : this.props.action,
					method       : this.props.method,
					enctype      : this.props.enctype
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


Puer.define(Form, import.meta.url)
export default Form