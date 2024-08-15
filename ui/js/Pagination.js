import $ from '../../index.js'

class Pagination extends $.Component {
	constructor(props, children) {
		super(props, children)
		this.props.default('page', 1)
		this.props.default('pages', 1)
		this._prev = null
		this._next = null
	}

	reset() {
		this._next.removeCssClass('disabled')
		this._prev.addCssClass('disabled')
		this.setPage(1)
	}

	setPage(page) {
		this.props.page = page
		this.trigger($.Event.PAGINATE, {page: this.props.page})
	}

	prev(event) {
		if (this.props.page > 1) {
			this.setPage(this.props.page - 1)
			this._next.removeCssClass('disabled')
		}
		if (this.props.page == 1) {
			this._prev.addCssClass('disabled')
		}
	}

	next(event) {
		if (this.props.page < this.props.pages) {
			this.setPage(this.props.page + 1)
			this._prev.removeCssClass('disabled')
		}
		if (this.props.page == this.props.pages) {
			this._next.addCssClass('disabled')
		}
	}

	onPropPagesChange() {
		this.toggleCssClass('hidden', this.props.pages <= 1)
	}

	render() {
		return $.div('hidden', [
			this._prev = $.a ('prev disabled' , {text : '', onClick: this.prev}),
			$.span('pages', [
				$.span('current', {'text': this.props.page}),
				$.span('divider'),
				$.span('total', {'text': this.props.pages})
			]),
			this._next = $.a ('next', {text : '', onClick: this.next})
		])
	}
}

$.define(Pagination, import.meta.url)
export default Pagination