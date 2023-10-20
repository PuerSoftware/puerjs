import Puer, {PuerComponent} from '../../puer.js'


class PageTab extends PuerComponent {
	constructor(props, children) {
		super(props, children)
		this.props.require('route', this)
	}

	navigateToPage() {
		Puer.Router.navigate(this.props.route)
	}

	render() {
		return div([
			a ({
				onclick : this.navigateToPage,
				text    : this.props.label
			})
		])
	}
}

Puer.define(PageTab, import.meta.url)
export default PageTab