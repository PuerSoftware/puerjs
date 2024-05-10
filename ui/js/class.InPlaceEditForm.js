import $           from '../../index.js'
import Form        from './class.Form.js'
import InputSelect from './class.InputSelect.js'

export default class InPlaceEditForm extends Form {
	constructor(... args) {
		super(... args)
		this.props.onDataChange = this.onDataChange.bind(this)
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
			const formData    = {[this.changedInput.props.name]: this.changedInput.value}
			const headers     = this.getHeaders()
			formData.formName = this.props.name
			this._dataSource.submit(formData, save, this.props.doClearOnSave, headers)
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
				input._on('blur', input.onBlur.bind(input))
			}
		}
	}

	onDataChange(items) {
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