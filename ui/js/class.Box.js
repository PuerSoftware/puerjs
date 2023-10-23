import Puer, {PuerComponent} from '../../puer.js'


class Box extends PuerComponent {
	constructor(props, children) {
		super(props, children)
		if (!this.children.length) {
			this.props.default('text','Box')
		}
		this.props.default('cssFlex', '1')
	}

	render() {
		return div({...this.props})
	}
}

Puer.define(Box, import.meta.url)
export default Box