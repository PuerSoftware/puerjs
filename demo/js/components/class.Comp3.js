import $          from '../../../core/class.Puer.js'
import PuerComponent from '../../../core/class.PuerComponent.js'


class Comp3 extends PuerComponent {
	render() {
		return h3([text(this.props.myProp)])
	}
}

$.define(Comp3, import.meta.url)
export default Comp3