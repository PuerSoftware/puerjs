import $ from '../../index.js'


class LinkSet extends $.Component {
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
		return $.div(this.children)
	}
}

$.define(LinkSet, import.meta.url)
export default LinkSet