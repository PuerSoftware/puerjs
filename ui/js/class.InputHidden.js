import Puer from '../../puer.js'

import FormInput from './class.FormInput.js'

class InputHidden extends FormInput {

	validate() {}

	onReady() {}

	render() {
		this.input = input({ ... this.props, type: 'hidden' })
		return this.input
	}
}

Puer.define(InputHidden)
export default InputHidden