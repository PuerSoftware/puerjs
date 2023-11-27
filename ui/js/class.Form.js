import Puer, {PuerComponent} from '../../puer.js'


class Form extends PuerComponent {
	constructor(props, children) {
		super(props, children)
		this.props.default('title',         '')
		this.props.default('subtitle',      '')
		this.props.default('buttonCaption', 'Submit')
		this.props.default('action',        '')
		this.props.default('method',        'POST')
		this.props.default('enctype',       'application/json')
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

	
	setData(data) {
		for (const name in data) {
			const input = this.getInput(name)
			if (input) {
				input.value = data[name]
			}
		}
	}

	getData() {
		let data = {}
		this.$$.FormInput.forEach(input => {
			if (!input.props.isHeader) {
				data[input.props.name] = input.value
			}
		})
		return data
	}

	getHeaders() {
		let headers = {}
		this.$$.FormInput.forEach(input => {
			if (input.props.isHeader) {
				headers[input.props.name] = input.value
			}
		})
		return headers
	}

	onValidate(data) {
		this.state.error = data.error || ''
		for (const input of this.$$.FormInput) {
			const inputField = input.$$$.FormField[0]
			if (inputField) {
				if (data.error && (input.props.name in data.fields)) {
					if (inputField) {
						inputField.setError(data.fields[input.props.name])
					}
				} else {
					inputField.setError('')
				}
			}
		}
	}

	validate(url) {
		url = url || this.props.action
		const formData = this.getData()
		const headers  = this.getHeaders()
		if (this.props.action) {
			Puer.Request.post(url, this.onValidate.bind(this), formData, headers)
		}
	}

	submit() {	
		this.validate(this.props.action + '1')
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
					div ('button-panel', [
						Puer.InputButton ({
							type    : 'button',
							onclick : this.submit,
							text    : this.props.buttonCaption,
							value   : this.props.buttonCaption
						})
					])
				])
			])
		)
	}
}


Puer.define(Form, import.meta.url)
export default Form