import Puer, {PuerComponent} from '../../puer.js'

class Pagination extends PuerComponent {
	constructor(props, children) {
		super(props, children)
		this.state.page    = 1
		this.state.display = 'none' 
		// this.props.require('hash', this)
	}

	setPage(page) {
		this.state.page = page
		this.trigger(Puer.Event.PAGINATE, {page: this.state.page})
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
		return Puer.div({cssDisplay: this.state.display}, [
			Puer.a ({text : '&laquo; previous', onClick: this.prev}),
			Puer.span('pages', [
				Puer.span({'text': this.state.page}),
				Puer.span({'text': 'of'}),
				Puer.span({'text': this.props.pages})
			]),
			Puer.a ({text : 'next &raquo;', onClick: this.next})
		])
	}
}

Puer.Events.define(['PAGINATE'])
Puer.define(Pagination, import.meta.url)
export default Pagination