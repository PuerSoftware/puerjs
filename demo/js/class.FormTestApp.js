import Puer, {PuerComponent} from '../../puer.js'
import PuerFormInput         from '../../ui/class.PuerFormInput.js'
import PuerForm              from '../../ui/class.PuerForm.js'


class FormTestApp extends PuerComponent {
	constructor(props) {
		super(props)
	}

	render() {
		return Puer.PuerForm({
			title         : 'Test puer form',
			subtitle      : 'subtitle',
			buttonCaption : 'Click me'
 		}, [
			Puer.PuerFormInput({type: 'button', value: 'Test Input'})
		])
	}
}

Puer.define(FormTestApp)
export default FormTestApp
