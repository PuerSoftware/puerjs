import Puer from '../../puer.js'

import FormInput from './class.FormInput.js'


class InputSelect extends FormInput {
	constructor(props, children) {
		super(props, children)
		this.props.default('tagName', 'select')
		this.hasData = false
	}

	onUrlChange(value) {
		value && Puer.DataSet.load(value, this.onData.bind(this))
	}

	onSelectedChange(value) {
		if (this.hasData) {
			this.value = value
		}
	}

	onData(dataSet) {
		let data = dataSet.data
		if (this.props.filter) {
			data = dataSet.filter(this.props.filter)
		}
		this.input.removeChildren()
		for (let item of data) {
			this.addOption(item.value, item.text, this.props.selected && this.props.selected == item.value)
		}
		this.hasData = true
		this.onSelectedChange(this.props.selected)
		this.events.change && this.events.change(event)
	}

	addOption(value, text, selected=false) {
		this.input.append(option({value: value, text: text, selected: selected}))
	}
}

Puer.define(InputSelect, import.meta.url)
export default InputSelect