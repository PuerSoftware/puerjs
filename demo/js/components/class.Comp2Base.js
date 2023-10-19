import Puer          from '../../../core/class.Puer.js'
import PuerComponent from '../../../core/class.PuerComponent.js'


class Comp2Base extends PuerComponent {
	constructor(props, children) {
		super(props, children)
	}
}

Puer.define(Comp2Base, import.meta.url)
export default Comp2Base