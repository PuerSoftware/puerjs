import Puer, {PuerComponent} from '../../puer.js'


class Pagination extends PuerComponent {
	constructor(props, children) {
		super(props, children)
		this.state.page = 1
		// this.props.require('hash', this)
	}

	prev() {
		if (this.state.page > 1) {
			this.state.page -= 1
			this.trigger('PAGINATE', {page: this.state.page})
		}
	}

	next() {
		if (this.state.page < this.props.pages) {
			this.state.page += 1
			this.trigger('PAGINATE', {page: this.state.page})
		}
	}

	render() {
		return div([
			a ({text : '&laquo; previous', onClick: this.prev()}),
			span('pages', [
				span({'text': this.state.page}),
				span({'text': 'of'}),
				span({'text': this.props.pages})
			]),
			a ({text : 'next &raquo;', onClick: this.next()})
		])
	}
}

Puer.define(Pagination, import.meta.url)
export default Pagination