import $, {PuerComponent}   from '../../../puer.js'


class IndexPage extends PuerComponent{

	onClick(e) {
		$.Router.navigate(e.targetComponent.props.routeName)
	}

	render() {
		return $.div([
			h3({text: this.props.title}),
			$.div({text: 'Because we\'ve "loved" React so much, that decided to brew some $...'}),
			img({src: 'img/puer.jpg', width: '200'})
		])
	}
}

$.define(IndexPage, import.meta.url)
export default IndexPage