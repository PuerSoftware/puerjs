import $ from '../../index.js'

class Pagination extends $.Component {
	constructor(props, children) {
		super(props, children)
		this.props.default('page', 1)
		this.state.display = 'none'
	}

	setPage(page) {
		this.props.page = page
		this.trigger($.Event.PAGINATE, {page: this.props.page})
	}

	prev(event) {
		if (this.props.page > 1) {
			this.setPage(this.props.page - 1)
		}
	}

	next(event) {
		if (this.props.page < this.props.pages) {
			this.setPage(this.props.page + 1)
		}
	}

	updateDisplay() {
		this.state.display = this.props.pages > 1
			? 'block'
			: 'none'
	}

	render() {
		return $.div({cssDisplay: this.state.display}, [
			$.a ('prev' , {text : '', onClick: this.prev}),
			$.span('pages', [
				$.span('current', {'text': this.props.page}),
				$.span('divider'),
				$.span('total', {'text': this.props.pages})
			]),
			$.a ('next', {text : '', onClick: this.next})
		])
	}
}

$.define(Pagination, import.meta.url)
export default Pagination