import Puer   from '../../../puer.js'
import {Page} from '../../../ui/index.js'

class IndexPage extends Page {

	onClick(e) {
		Puer.Router.navigate(e.targetComponent.props.routeName)
	}

	render() {
		return div([
			h3({text: this.props.title}),
			div({text: 'Because we\'ve loved React so much, we\'ve decided to brew some Puer...'}),
			img({src: 'img/puer.jpg', width: '200'})
		])
	}
}

Puer.define(IndexPage, import.meta.url)
export default IndexPage