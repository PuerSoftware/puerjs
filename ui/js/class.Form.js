import $              from '../../index.js'
import DataOwnerMixin from '../../library/class.DataOwnerMixin.js'



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
		this.props.default('doClearOnSave', false)

		this.state.error        = ''
		this._errorComponent    = null
		this._isValidateEnabled = true
		this.inputs             = null
		this.button             = null
	}

	_onResponse(event) {
		this.state.error = event.detail.error
		this._errorComponent.toggle(this.state.error)
		for (const input of this.inputs) {
			if (input.field) {
				input.field.error = event.detail.errors[input.props.name]
			}
		}
		if (event.detail.isSaved) {
			this._trigger('save')
		}
	}

	_onSubmit() {
		this.submit(true)
	}

	get hasChange() {
		for (const input of this.inputs) {
			if (input.value !== String(input.initialValue) && !input.isHidden) {
				return true
			}
		}
		return false
	}

	getInput(name) {
		for (const input of this.inputs) {
			if (input.props.name === name) {
				return input
			}
		}
	}

	getData() {
		let data = {}
		if (this.inputs) {
			for (const input of this.inputs) {
				if (!input.props.isHeader) {
					data[input.props.name] = input.value 
				}
			}
		}
		return data
	}

	getHeaders() {
		let headers = {}
		if (this.inputs) {
			for (const input of this.inputs) {
				if (input.props.isHeader) {
					headers[input.props.name] = input.value
				}
			}
		}
		return headers
	}

	reset() {
		for (const input of this.inputs) {
			if (!input.isHidden) {
				input.reset()
			}
		}
	}

	submit(save) {
		if (this._isValidateEnabled && this._dataSource) {
			const formData = this.getData()
			const headers  = this.getHeaders()
			this._dataSource.submit(formData, save, this.props.doClearOnSave, headers)
		}
	}

	onInputChange(event) {
		this.submit(false)
	}

	onInit() {
		this.inputs = this.$$.FormInput.toArray()
		this.mixin(DataOwnerMixin)
		this.on($.Event.FORM_RESPONSE, this._onResponse, this.props.dataSource)
	}

	onDataChange(items) {
		this._isValidateEnabled = false
		for (const item of items) {
			const input = this.getInput(item.field)
			if (input) {
				input.value = item.value
				if (input.initialValue === null) {
					input.initialValue = item.value
				}
			}
		}
		this._isValidateEnabled = true
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
					enctype      : this.props.enctype,
				}, [
					... this.children,
					$.div ('button-panel', [
						this.button = $.InputButton ({
							type    : 'button',
							onclick : this._onSubmit,
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