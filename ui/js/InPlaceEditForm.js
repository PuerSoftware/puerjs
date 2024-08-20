import $           from '../../index.js'
import Form        from './Form.js'
import InputSelect from './InputSelect.js'


export default class InPlaceEditForm extends Form {
	constructor(... args) {
		super(... args)
		this.props.onDataLoad = this.onDataLoad.bind(this)
		this.currentInput = null
		this.changedInput = null
	}

	edit(input) {
		if (this.currentInput) {
			this.currentInput.props.isEditable = false
		}

		this.currentInput = input
		this.currentInput.props.isEditable = true
	}

	submit(save) {
		if (this._isValidateEnabled && this._dataSource) {
			let value = this.changedInput.value || null
			if (value === 'undefined') {
				value = null
			}
			const formData     = {[this.changedInput.props.name]: value}
			const headers      = this.getHeaders()
			formData.form_name = this.props.name
			formData.is_saving = save
			this._dataSource.submit(formData, this.props.doClearOnSave, headers)
		}
	}

	onInit() {
		super.onInit()
		const _this = this
		for (const input of this.inputs) {
			if (!input._isHidden && !input.props.isReadOnly) {
				input.inPlaceLabel._on('click', (e) => {
					_this.edit(input)
				})
				input._on('focus', input.onFocus.bind(input))
				input._on('blur',  input.onBlur.bind(input))
			}
		}
	}

	onDataLoad(items) {
		for (const input of this.inputs) {
			input.props.isEditable = false
		}
	}

	onInputChange(event) {
		this.changedInput = event.targetComponent
		this.submit(true)
	}

}

$.define(InPlaceEditForm, import.meta.url)
