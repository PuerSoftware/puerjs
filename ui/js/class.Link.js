import Puer, {PuerComponent} from '../../puer.js'


class Link extends PuerComponent {
	constructor(props, children) {
		super(props, children)
		// this.props.require('path', this)
	}

	navigate() {
		console.log('NAVIGATE')
		this.route(this.props.path)
		if (this.props.f) {
			this.props.callback(this)
		}
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