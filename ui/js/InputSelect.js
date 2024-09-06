import $         from '../../index.js'
import FormInput from './FormInput.js'


export default class InputSelect extends FormInput {
	constructor(props, children) {
		super(props, children)
		this.props.default('tagName', 'select')
		this.props.default('allowEmpty', true)

		this.hasData           = false
		this._previewModeValue = null
		this._options          = {}
		this._optionsLabels    = null
	}

	_updateLabelValue() {
		if (this.props.isPreviewMode && this._optionsLabels && this._previewModeValue) {
			this.state.value = this._optionsLabels[this._previewModeValue]
		}
	}

	onPropSelectedChange(value) {
		if (this.hasData) {
			this.value = value
		}
	}

	_onDataFilter(map) {
		this.empty()
		this.addOptions(this.dataSet.filteredItems)
	}

	_onDataLoad(data) {
		if (!this.props.isPreviewMode) {
			this.input.removeChildren()
			this.addOptions(data)
			this.hasData = true
			this.events.change && this.events.change()
		} else {
			this._optionsLabels = {}
			for (const item of data) {
				this._optionsLabels[item.value] = item.text
			}
			this._updateLabelValue()
		}
	}

	addOptions(data) {
		if (this.props.allowEmpty) {
			this.addOption('', ' - ', !this.props.selected)
		}
		for (let item of data) {
			this.addOption(
				item,
				this.props.selected && (this.props.selected === item.value)
			)
		}
	}

	addOption(item, selected=false) {
		const props = {
			value : item.value,
			text  : item.text
		}
		if (selected) {
			props.selected = true
		}
		const option = $.option(props)
		this._options[item.dataId] = option
		this.input.append(option)
	}

	set value(value) {
		if (this.props.isPreviewMode) {
			this._previewModeValue = value
			this._updateLabelValue()
		} else {
			this.state.value = value
		}
		if (this.input) {
			value            = value || ''
			const oldValue   = this.input.element.value
			this.input.element.value = value
			this._triggerChange(oldValue, value)
		}
	}

	get value() {
		return this.input && this.input.element
			? this.input.element.value
			: null
	}

	get stringValue() {
		const selected = this.input.element.options[this.input.element.selectedIndex]
		return selected
			? selected.innerText
			: ''
	}

	empty() {
		this.input.removeChildren()
		this._options = {}
	}

	load(query) {
		this.dataSource.load('GET', query)
	}

	onInit() {
		super.onInit()
		this.mixin($.DataOwnerMixin)
	}
}

$.define(InputSelect, import.meta.url)
