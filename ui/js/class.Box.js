import Puer, {PuerComponent} from '../../puer.js'


class Box extends PuerComponent {
	constructor(props, children) {
		super(props, children)
	}

	render() {
		return div({...this.props})
	}
}

Puer.define(Box, import.meta.url)
export default Box