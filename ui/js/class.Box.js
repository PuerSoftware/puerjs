import Puer, {PuerComponent} from '../../puer.js'


class Box extends PuerComponent {
	constructor(props, children) {
		super(props, children)
		this.props.default('tagName', 'div')
	}

	render() {
		return Puer[this.props.tagName]({}, this.children)
	}
}

Puer.define(Box, import.meta.url)
export default Box