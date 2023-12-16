import $ from '../../index.js'

class Pagination extends $.Component {
	constructor(props, children) {
		super(props, children)
		this.state.page    = 1
		this.state.display = 'none' 
		// this.props.require('hash', this)
	}

	setPage(page) {
		this.state.page = page
		this.trigger($.Event.PAGINATE, {page: this.state.page})
	}

	prev(event) {
		if (this.state.page > 1) {
			this.setPage(this.state.page - 1)
		}
	}

	next(event) {
		if (this.state.page < this.props.pages) {
			this.setPage(this.state.page + 1)
		}
	}

	onUpdate() {
		this.state.display = this.props.pages > 1
			? 'block'
			: 'none'
	}

	render() {
		return $.div({cssDisplay: this.state.display}, [
			$.a ({text : '&laquo; previous', onClick: this.prev}),
			$.span('pages', [
				$.span({'text': this.state.page}),
				$.span({'text': 'of'}),
				$.span({'text': this.props.pages})
			]),
			$.a ({text : 'next &raquo;', onClick: this.next})
		])
	}
}

$.Events.define(['PAGINATE'])
$.define(Pagination, import.meta.url)
export default Pagination