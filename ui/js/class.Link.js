import Puer, {PuerComponent} from '../../puer.js'


class Link extends PuerComponent {
	constructor(props, children) {
		super(props, children)
		// this.props.require('hash', this)
	}

	navigate() {
		const linkSet = this.$$$.LinkSet[0]
		if (linkSet) {
			linkSet.select(this)
		}
		this.route(this.props.hash)
		if (this.props.f) {
			this.props.callback(this)
		}
	}

	render() {
		return Puer.div({onClick : this.navigate}, [
			Puer.a ({text : this.props.label})
		])
	}
}

Puer.define(Link, import.meta.url)
export default Link