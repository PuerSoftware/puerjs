import $, {PuerComponent} from '../../puer.js'


class Button extends PuerComponent {
	constructor( ... args ) {
		super( ... args )

		this.PRIMARY   = 'primary'
		this.SECONDARY = 'secondary'
		this.INLINE    = 'inline'
	}

	render() {
		return $.button()
	}
}

$.define(Button, import.meta.url)
export default Button