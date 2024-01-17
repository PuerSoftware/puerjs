import $ from '../../index.js'


export default class LinkSet extends $.Component {
	constructor(... args) {
		super(... args)
		this._selectedLink = null
	}

	select(selected) {
		for (const link of this.$$.Link) {
			link.selected = false
		}
		this._selectedLink          = selected
		this._selectedLink.selected = true
	}

	render() {
		return $.div(this.children)
	}
}

$.define(LinkSet, import.meta.url)