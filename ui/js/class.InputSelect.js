import Puer, {PuerComponent} from '../../puer.js'

import FormInput from './class.FormInput.js'

window.perf = {
	ms: 0,
	count: 0
}



class InputSelect extends FormInput {

	constructor(props, children) {
		super(props, children)
		this.dataSet = new Puer.DataSet(Puer.DataSet.CACHE_NAME)
		this.hasData = false
	}

	onUrlChange(value) {
		console.log(this.props.name, 'onUrlChange !!!', value)
		const t = Date.now()
		value && this.dataSet.load(value, this.onData.bind(this))
		window.perf.ms += Date.now() - t
		window.perf.count ++
	}

	onSelectedChange(value) {
		console.log(this.props.name, 'onSelectedChange !!! NO DATA')
		if (this.hasData) {
			console.log(this.props.name, 'onSelectedChange !!! With DATA')
			this.select(value)
		}
	}

	onData(data) {
		if (this.props.filter) {
			data = this.dataSet.filter(this.props.filter)
		}
		console.log('onData', data)
		this.removeChildren()
		for (let item of data) {
			this.addOption(item.value, item.text, this.props.selected && this.props.selected == item.value)
		}
		this.hasData = true
		this.select()
	}

	select(value) {
		console.log(this.props.name, 'select()', value)
		if (value) {
			this.element.value = value
		}
		this._onChange()
	}

	addOption(value, text, selected=false) {
		this.append(option({value: value, text: text, selected: selected}))
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