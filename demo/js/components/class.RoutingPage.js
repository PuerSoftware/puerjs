import $, {PuerComponent}   from '../../../puer.js'


class RoutingPage extends PuerComponent{

	onClick(e) {
		$.Router.navigate(e.targetComponent.props.routeName)
	}

	render() {
		return $.div({cssDisplay: 'flex', cssFlexDirection: 'column'}, [
			h3({text: this.props.title}),
			$.div({cssDisplay: 'flex', cssFlexDirection: 'row'}, [
				$.div({text: 'Green', route: 'tab:green', cssBackgroundColor: 'green', cssFlex: 1}),
				$.div({text: 'Blue',  route: 'tab:blue',  cssBackgroundColor: 'blue',  cssFlex: 1}),
				$.Link({label: 'Green', hash: 'page:routing[tab:green]'}),
				$.Link({label: 'Blue',  hash: 'page:routing[tab:blue]'})
			]),
		])
	}
}

$.define(RoutingPage, import.meta.url)
export default RoutingPage