import Puer, {PuerComponent} from '../../puer.js'

import FormInput from './class.FormInput.js'


class InputSelect extends FormInput {

	constructor(props, children) {
		super(props, children)
		this.dataSet = new Puer.DataSet(Puer.DataSet.CACHE_NAME)
	}

	onUrlChange(value) {
		value && this.dataSet.load(value, this.onData.bind(this))
	}

	onSelectedChange(value) {
		this.select()
	}

	onData(data) {
		if (this.props.filter) {
			data = this.dataSet.filter(this.props.filter)
		}
		this.removeChildren()
		data.forEach((item) => {
			this.addOption(item.value, item.text, this.props.selected && this.props.selected == item.value)
		})
	}

	addOption(value, text, selected=false) {
		this.append(option({value: value, text: text, selected: selected}))
	}

	select() {
		this.$$.select[0].element.dispatchEvent(new Event('change'))
	}

	render() {
		return select({
            ... this.props,
            onChange: this._onChange
		})
	}
}

Puer.define(InputSelect, import.meta.url)
export default InputSelect