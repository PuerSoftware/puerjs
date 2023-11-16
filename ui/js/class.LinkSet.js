import Puer, {PuerComponent} from '../../puer.js'


class LinkSet extends PuerComponent {
	constructor(props, children) {
		super(props, children)
		this.selected = null
		// this.props.require('path', this)
	}

	select(selected) {
		for (const link of this.$$.Link) {
			console.log('link', link)
			link.removeCssClass('selected')
		}
		this.selected = selected
		this.selected.addCssClass('selected')
		console.log('SELECTED', this.selected)
	}

	render() {
		return div(this.children)
	}
}

Puer.define(LinkSet, import.meta.url)
export default LinkSet