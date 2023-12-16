import $ from '../../index.js'


class Link extends $.Component {
	constructor(props, children) {
		super(props, children)
		// this.props.require('hash')
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
		return $.div({onClick : this.navigate}, [
			$.a ({text : this.props.label})
		])
	}
}

$.define(Link, import.meta.url)
export default Link