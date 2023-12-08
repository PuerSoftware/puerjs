import $, {PuerComponent} from '../../puer.js'


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
		this.isSaving    = false
	}

	getInput(name) {
		for (const input of this.inputs) {
			if (input.props.name === name) {
				return input
			}
		}
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
		for (const input of this.inputs) {
			if (!input.props.isHeader) {
				data[input.props.name] = input.value
			}
		}
		return data
	}

	getHeaders() {
		let headers = {}
		for (const input of this.inputs) {
			if (input.props.isHeader) {
				headers[input.props.name] = input.value
			}
		}
		return headers
	}

	onReady() {
		this.inputs = this.$$.FormInput.toArray()
	}

	onValidate(data) {
		this.state.error = data.error || ''
		for (const input of this.inputs) {
			if (input.field) {
				if (data.error && (input.props.name in data.fields)) {
					input.field.error = data.fields[input.props.name]
				} else {
					input.field.error = ''
				}
			}
		}
		const isSubmitSuccessful = !data.error
		if (isSubmitSuccessful && this.isSaving) {
			this.reset()
		}
		this.isSaving = false
	}

	validate(url) {
		url = url || this.props.action
		const formData = this.getData()
		const headers  = this.getHeaders()
		if (this.props.action) {
			$.Request.post(url, this.onValidate.bind(this), formData, headers)
		}
	}

	reset() {
		for (const input of this.inputs) {
			if (!input.isHidden) {
				input.reset()
			}
		}
	}

	submit() {	
		this.validate(this.props.action + '1')
	}

	render() {
		return (
			$.div([
				$.h1 ({text: this.props.title}),
				$.p  ({text: this.props.subtitle}),
				$.p  ({text: this.state.error, class: 'error form-error'}),
				$.form ({
					autocomplete : this.props.autocomplete,
					action       : this.props.action,
					method       : this.props.method,
					enctype      : this.props.enctype
				}, [
					... this.children,
					$.div ('button-panel', [
						$.InputButton ({
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


$.define(Form, import.meta.url)
export default Form