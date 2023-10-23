import Puer, {PuerComponent} from '../../puer.js'


class Link extends PuerComponent {
	constructor(props, children) {
		super(props, children)
		this.props.require('path', this)
	}

	navigate() {
		this.route(this.props.path, this.props.relative)
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

Puer.define(Link, import.meta.url)
export default Link