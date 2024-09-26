import $ from '../../index.js'


export default class Link extends $.Component {
	constructor(... args) {
		super(... args)
		this.props.default('isSelectable', true)
		this.props.default('selected', false)
		this.props.default('label', '')
		this.props.default('hash', '')
		this.props.default('stopPropagation', false)
		this.props.default('canNavigate', null)
		this.linkSet = null
		this._isSelected = false
	}

	canNavigate() {
		if (this.props.canNavigate) {
			return this.props.canNavigate(this)
		}
		return true
	}

	navigate(e) {
		if (this.canNavigate()) {
			this.props.stopPropagation && e && e.stopPropagation()
			if (this.props.href) {
				window.open(this.props.href, this.props.target)
			} else {
				this.props.hash && $.Router.navigate(this.props.hash)
			}

			if (this.props.isSelectable) {
				this.linkSet.select(this)
			}
		}
	}

	set isSelected(select) {
		this._isSelected = select
		this.toggleCssClass('selected', select)
	}

	get isSelected() {
		return this._isSelected
	}

	onInit() {
		this.linkSet = this.$$$.LinkSet[0]
		if (this.linkSet) {
			this.onRoute = null
			this.linkSet.select(this)
		} else {
			this.selected = this.props.selected
		}
	}

	render() {
		return $.div({onclick : this.navigate}, [
			$.a ({text : this.props.label}),
			... this.children
		])
	}
}

$.define(Link, import.meta.url)
