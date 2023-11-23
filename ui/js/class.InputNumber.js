import Puer from '../../puer.js'

import InputText from './class.FormInput.js'


class InputNumber extends InputText {
	render() {
		return input({
			... this.props,
			type     : 'number'
		})
	}
}

Puer.define(InputNumber, import.meta.url)
export default InputNumber