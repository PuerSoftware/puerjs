import $ from '../../index.js'


export default class Link extends $.Component {
	constructor(... args) {
		super(... args)
		this.props.default('selected', false)
		this.props.default('label', '')
		this.props.default('hash', '')
		this.props.default('stopPropagation', false)
		this._linkSet = null
	}

	_navigate(e) {
		this.props.stopPropagation && e.stopPropagation()
		this.trigger($.Event.CLICK, {
			data: {},
			name: this.name
		})
        if (this.props.href) {
            window.open(this.props.href, this.props.target)
        } else {
			this.props.hash && $.Router.navigate(this.props.hash, null)
        }
	}

	set selected(select) {
		select
			? this.addCssClass('selected')
			: this.removeCssClass('selected')
	}

	onInit() {
		this._linkSet = this.$$$.LinkSet[0]
		if (this._linkSet) {
			this.onRoute = null
		}
		this.selected = this.props.selected
	}

	render() {
		return $.div({onclick : this._navigate}, [
			$.a ({text : this.props.label}),
			... this.children
		])
	}
}

$.define(Link, import.meta.url)
