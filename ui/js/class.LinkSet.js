import Puer, {PuerComponent} from '../../puer.js'


class LinkSet extends PuerComponent {
	constructor(props, children) {
		super(props, children)
		this.selected = null
	}

	select(selected) {
		for (const link of this.$$.Link) {
			link.removeCssClass('selected')
		}
		this.selected = selected
		this.selected.addCssClass('selected')
	}

	render() {
		return Puer.div(this.children)
	}
}

Puer.define(LinkSet, import.meta.url)
export default LinkSet