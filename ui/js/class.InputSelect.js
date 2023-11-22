import Puer, {PuerComponent} from '../../puer.js'

import FormInput from './class.FormInput.js'


class InputSelect extends FormInput {

	constructor(props, children) {
		super(props, children)
		this.dataSet = new Puer.DataSet(Puer.DataSet.CACHE_NAME)

		console.log('constructor', this.dataSet)
	}

	_onChange() {
		super._onChange()
		this.props.onChange && this.props.onChange()
	}

	onUrlChange(value) {
		// Puer.Request.get(value, this.onDataSourceChanged.bind(this))
		console.log('onUrlChange', this.className)
		this.dataSet.load(value, this.onDataSourceChanged.bind(this), true)
		console.log('onDataSourceChange', value)
	}

	onDataSourceChanged(data) {
		if (this.props.filter) {
			data = this.props.filter(data)
		}
		console.log('onDataSourceChanged', data)
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