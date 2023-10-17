import Puer          from '../../core/class.Puer.js'
import PuerComponent from '../../core/class.PuerComponent.js'


class Comp3 extends PuerComponent {
	render() {
		return h3([text(this.props.myProp)])
	}
}

Puer.define(Comp3)
export default Comp3