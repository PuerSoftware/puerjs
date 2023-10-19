import Puer, {PuerComponent} from '../puer.js'


class Container extends PuerComponent {
	constructor(props, children) {
		super(props, children)
	}
}

Puer.define(Container)
export default Container