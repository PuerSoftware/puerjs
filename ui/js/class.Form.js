import $ from '../../index.js'


class Form extends $.Component {
	constructor(props, children) {
		super(props, children)
		this.props.default('title',         '')
		this.props.default('subtitle',      '')
		this.props.default('buttonCaption', 'Submit')
		this.props.default('action',        '')
		this.props.default('method',        'POST')
		this.props.default('enctype',       'application/json')
		this.props.default('autocomplete',  'off')

		this.props.require('dataSource')

		this.state.error     = ''
		this.isSaving        = false
		this._dataSet        = null
		this._dataSource     = null
		this._errorComponent = null
		this.inputs          = null

		this.on($.Event.FORM_ERROR, this._onError)
	}

	_onData(data) {
		for (const item of data) {
			const input = this.getInput(item.field)
			if (input) {
				input.value = item.value
			}
		}
	}

	_onError(event) {
		this.state.error = event.detail.error
		this._errorComponent.toggle(this.state.error)
		for (const input of this.inputs) {
			if (input.field) {
				input.field.error = event.detail.errors[input.props.name]
			}
		}
	}


	set dataSource(name) {
		this.props.dataSource = name
		this._dataSource = $.DataSource[this.props.dataSource]
		this._dataSet    = this._dataSource.defineDataSet(this.props.name)

		this._dataSet.onData = this._onData.bind(this)
	}

	get dataSource() {
		return this._dataSource
	}

	getInput(name) {
		for (const input of this.inputs) {
			if (input.props.name === name) {
				return input
			}
		}
	}

	
	// setData(data) {
	// 	for (const name in data) {
	// 		const input = this.getInput(name)
	// 		if (input) {
	// 			input.value = data[name]
	// 		}
	// 	}
	// }

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

	onInit() {
		this.inputs     = this.$$.FormInput.toArray()
		this.dataSource = this.props.dataSource
	}

	// onValidate(data) {
	// 	this.state.error = data.error || ''
	// 	for (const input of this.inputs) {
	// 		if (input.field) {
	// 			if (data.error && (input.props.name in data.fields)) {
	// 				input.field.error = data.fields[input.props.name]
	// 			} else {
	// 				input.field.error = ''
	// 			}
	// 		}
	// 	}
	// 	const isSubmitSuccessful = !data.error
	// 	if (isSubmitSuccessful && this.isSaving) {
	// 		this.reset()
	// 	}
	// 	this.isSaving = false
	// }

	validate() {
		const formData = this.getData()
		const headers  = this.getHeaders()
		this._dataSource.validate(formData, headers)
	}

	reset() {
		for (const input of this.inputs) {
			if (!input.isHidden) {
				input.reset()
			}
		}
	}

	submit() {	
		const formData = this.getData()
		const headers  = this.getHeaders()
		this._dataSource.submit(formData, headers)
	}

	render() {
		this._errorComponent = $.p({text: this.state.error, class: 'error form-error'})
		return (
			$.div([
				$.h1 ({text: this.props.title}),
				$.p  ({text: this.props.subtitle}),
				this._errorComponent,
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