import Puer, {PuerComponent} from '../../puer.js'


class LinkSet extends PuerComponent {
	constructor(props, children) {
		super(props, children)
		// this.props.require('path', this)
	}

	render() {
		return div([
			a ({
				onClick : this.navigate,
				text    : this.props.label
			})
		])
	}
}

Puer.define(LinkSet, import.meta.url)
export default LinkSet