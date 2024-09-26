import $ from '../../index.js'


export default class LinkSet extends $.Component {
	constructor(... args) {
		super(... args)
		this.selectedLink = null
	}

	_isSelectedCandidate(link, linkToSelect = null) {
		if (linkToSelect && linkToSelect.props.isSelectable) {
			return link === linkToSelect
		}
		if (link.props.isSelectable) {
			const linkHash = link.props.hash
			return Boolean(linkHash) && (
				$.Router.doesContain(linkHash) &&
				$.Router.doesResolve(linkHash)
			)
		}
		return false
	}

	select(linkToSelect = null) {  // If selected link is null, will try to figure it out by hash
		for (const link of this.$$.Link) {
			const isSelected = this._isSelectedCandidate(link, linkToSelect)
			if (isSelected) {
				this.selectedLink = link
			}
			link.isSelected = isSelected
		}
	}

	get selected() {
		return this.selectedLink
	}

	onRoute() {
		if (this.isActive) {
			this.select()
		}
	}

	render() {
		return $.div(this.children)
	}
}

$.define(LinkSet, import.meta.url)
