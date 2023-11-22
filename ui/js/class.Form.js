import Puer, {PuerComponent} from '../../puer.js'


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

	getInput(name) {
		let input = null
		this.$$.FormInput.forEach(ipt => {
			if (ipt.props.name === name) {
				input = ipt
			} 
		})
		return input
	}
	// onUpdate() {
	// 	this.inputs = this.$$.FormInput
	// 	this.fields = this.$$.FormField
	// }

	onValidate(data) {
		// console.log('Validated data', data)
		this.state.error = data.error || ''
		if (data.error) {
			for (const input of this.$$.FormInput) {
				if (input.props.name in data.fields) {
					const inputField = input.$$$.FormField[0]
					if (inputField) {
						// console.log(inputField.element, input.props.name, data.fields[input.props.name])
						inputField.onValidate(data.fields[input.props.name])
					}
				}
			}
		}
	}

	validate(initiatorInputName) {
		let formData = {}
		for (const input of this.$$.FormInput) {
			formData[input.props.name] = {
				value          : input.element.value,
				validationType : input.props.validationType || ''
			}
			if (input.props.name === initiatorInputName) {
				break
			}
		}
		if (this.props.validationUrl) {
			Puer.Request.apost(this.props.validationUrl, formData)
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