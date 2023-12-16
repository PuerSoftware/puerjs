import $         from '../../index.js'
import FormInput from './class.FormInput.js'


class InputSelect extends FormInput {
	constructor(props, children) {
		super(props, children)
		this.props.default('tagName', 'select')
		this.props.default('allowEmpty', true)
		this.hasData = false
	}

	onUrlChange(value) {
		// value && $.DataSet.load(value, this.onData.bind(this))
	}

	onSelectedChange(value) {
		if (this.hasData) {
			this.value = value
		}
	}

	onData(dataSet) {
		this.events.load && this.events.load(dataSet)
		let data = dataSet.data
		if (this.props.filter) {
			data = dataSet.filter(this.props.filter)
		}
		this.input.removeChildren()
		this.addOptions(data)
		this.hasData = true
		this.onSelectedChange(this.props.selected)
		this.events.change && this.events.change(event)
	}

	addOptions(data) {
		if (this.props.allowEmpty) {
			this.addOption('0', ' - ', !this.props.selected)
		}
		for (let item of data) {
			this.addOption(
				item.value,
				item.text,
				this.props.selected && this.props.selected == item.value
			)
		}
	}

	addOption(value, text, selected=false) {
		const props = {
			value : value,
			text  : text
		}
		if (selected) {
			props.selected = true
		}
		this.input.append($.option(props))
	}

	reset() {
		if (this.props.selected) {
			this.value = this.props.selected
		} else {
			if (this.props.allowEmpty) {
				this.value = '0'
			} else {
				this.value = null
			}
		}
	}
}

$.define(InputSelect, import.meta.url)
export default InputSelect