import Puer from '../../puer.js'

import FormInput from './class.FormInput.js'


class InputText extends FormInput {
	render() {
		return input({
			... this.props,
			type     : 'text'
		})
	}
}

Puer.define(InputText, import.meta.url)
export default InputText