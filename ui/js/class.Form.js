import $              from '../../index.js'
import DataOwnerMixin from '../../library/class.DataOwnerMixin.js'


class Form extends $.Component {
	constructor(props, children) {
		super(props, children)
		this.props.default('title',            '')
		this.props.default('subtitle',         '')
		this.props.default('buttonLabel',      'Submit')
		this.props.default('action',           '')
		this.props.default('method',           'POST')
		this.props.default('enctype',          'application/json')
		this.props.default('autocomplete',     'off')
		this.props.default('doClearOnSave',    false)
		this.props.default('doSubmitOnEnter',  false)
		this.props.default('hasButton',        true)
		this.props.default('saveNotification', 'Form saved successfully!')

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
			this._updateInitialValues()
			$.notify(this.props.saveNotification)
			this._trigger('save')
		}
	}

	_onSubmit(e) {
		e.preventDefault()
		this.submit(true)
	}

	_onAppEnter(e) {
		for (const input of this.inputs) {
			if (document.activeElement === input.input.element) {
				return
			}
		}
		this.submit(true)
	}

	_updateInitialValues() { // copy all values to initial values
		for (const input of this.inputs) {
			input._updateInitialValue()
		}
	}

	get hasChange() {
		for (const input of this.inputs) {
			if (!input._isHidden) {
				if (input.value !== input.initialValue) {
					return true
				}
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
				if (!input.props.isHeader && !input.props.isReadOnly) {
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
			if (!input._isHidden) {
				input.reset()
			}
		}
	}

	submit(save) {
		if (this._isValidateEnabled && this._dataSource) {
			const formData    = this.getData()
			const headers     = this.getHeaders()
			formData.formName = this.props.name
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
		if (this.props.doSubmitOnEnter) {
			this.on($.Event.APP_ENTER, this._onAppEnter)
		}
	}

	_onDataLoad(items) {
		this._isValidateEnabled = false
		for (const item of items) {
			const input = this.getInput(item.field)
			if (input) {
				input.value = item.value
				if (input.initialValue === undefined) {
					input.initialValue = String(item.value)
				}
			}
		}
		this._isValidateEnabled = true
	}

	resetInputs() {
		for (const input of this.inputs) {
			input.initialValue = undefined
		}
	}

	render() {
		this._errorComponent = $.p({text: this.state.error, class: 'error form-error'})
		const formChildren = [... this.children]
		const buttonType   = this.props.doSubmitOnEnter
			? 'button'
			: 'submit'
		if (this.props.hasButton) {
			formChildren.push(
				$.div ('button-panel', [
					this.button = $.InputButton ({
						type    : buttonType,
						onclick : this._onSubmit,
						text    : this.props.buttonLabel,
						value   : this.props.buttonLabel
					})
				])
			)
		}
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
					onsubmit     : this._onSubmit
				}, formChildren)
			])
		)
	}
}


$.define(Form, import.meta.url)
export default Form