import Puer, {PuerComponent} from '../../puer.js'

class Pagination extends PuerComponent {
	constructor(props, children) {
		super(props, children)
		this.state.page    = 1
		this.state.display = 'none' 
		// this.props.require('hash', this)
	}

	navigate(page) {
		this.state.page = page
		this.trigger(Puer.Event.PAGINATE, {page: this.state.page})
	}

	prev(event) {
		if (this.state.page > 1) {
			this.state.page -= 1
			this.trigger(Puer.Event.PAGINATE, {page: this.state.page})
		}
	}

	next(event) {
		if (this.state.page < this.props.pages) {
			this.state.page += 1
			this.trigger(Puer.Event.PAGINATE, {page: this.state.page})
		}
	}

	onUpdate() {
		this.state.display = this.props.pages > 1
			? 'block'
			: 'none'
	}

	render() {
		return div({cssDisplay: this.state.display}, [
			a ({text : '&laquo; previous', onClick: this.prev}),
			span('pages', [
				span({'text': this.state.page}),
				span({'text': 'of'}),
				span({'text': this.props.pages})
			]),
			a ({text : 'next &raquo;', onClick: this.next})
		])
	}
}

Puer.Events.define(['PAGINATE'])
Puer.define(Pagination, import.meta.url)
export default Pagination