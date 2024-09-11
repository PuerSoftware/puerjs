import $ from '../../index.js'


export default class LinkSet extends $.Component {
	constructor(... args) {
		super(... args)
		this._selectedLink = null
	}

	select(selected) {
		this._selectedLink          = selected
		this._selectedLink.selected = true
	}

	get selected() {
		return this._selectedLink
	}

	onRoute(hash, resolvedHash) {
		if (this.isActive) {
			for (const link of this.$$.Link) {
				const linkHash = link.props.hash
				if (linkHash && ($.Router.doesContain(linkHash) || $.Router.doesResolve(linkHash))) {
					this.select(link)
				} else {
					link.selected = false
				}
			}
		}
	}

	render() {
		return $.div(this.children)
	}
}

$.define(LinkSet, import.meta.url)
