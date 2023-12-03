import Puer, {PuerComponent}   from '../../../puer.js'


class IndexPage extends PuerComponent{

	onClick(e) {
		Puer.Router.navigate(e.targetComponent.props.routeName)
	}

	render() {
		return Puer.div([
			h3({text: this.props.title}),
			Puer.div({text: 'Because we\'ve "loved" React so much, that decided to brew some Puer...'}),
			img({src: 'img/puer.jpg', width: '200'})
		])
	}
}

Puer.define(IndexPage, import.meta.url)
export default IndexPage