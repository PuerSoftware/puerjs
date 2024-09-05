import $         from '../../index.js'
import FormInput from './FormInput.js'


export default class InputSelect extends FormInput {
	constructor(props, children) {
		super(props, children)
		this.props.default('tagName', 'select')
		this.props.default('allowEmpty', true)

		this.hasData  = false
		this._options = {}
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
