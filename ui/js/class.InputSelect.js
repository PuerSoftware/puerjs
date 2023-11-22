import Puer, {PuerComponent} from '../../puer.js'

import FormInput from './class.FormInput.js'


class InputSelect extends FormInput {

	constructor(props, children) {
		super(props, children)
		this.dataSet = new Puer.DataSet(Puer.DataSet.CACHE_NAME)
	}

	_onChange() {
		super._onChange()
		this.props.onChange && this.props.onChange()
	}

	onUrlChange(value) {
		console.log('onUrlChange', this.className)
		this.dataSet.load(value, this.onData.bind(this))
		console.log('onDataSourceChange', value)
	}

	onData(data) {
		if (this.props.filter) {
			data = this.dataSet.filter(this.props.filter)
		}
		console.log(data)
		data.forEach((item) => {
			this.addOption(item.value, item.text, this.props.selected && this.props.selected == item.value)
		})
	}

	addOption(value, text, selected=false) {
		this.append(option({value: value, text: text, selected: selected}))
	}

	render() {
		return select({
            ... this.props,
            onchange: this._onChange,
        })
	}
}

Puer.define(InputSelect, import.meta.url)
export default InputSelect