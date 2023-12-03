import Puer, {PuerComponent}   from '../../../puer.js'


class RoutingPage extends PuerComponent{

	onClick(e) {
		Puer.Router.navigate(e.targetComponent.props.routeName)
	}

	render() {
		return Puer.div({cssDisplay: 'flex', cssFlexDirection: 'column'}, [
			h3({text: this.props.title}),
			Puer.div({cssDisplay: 'flex', cssFlexDirection: 'row'}, [
				Puer.div({text: 'Green', route: 'tab:green', cssBackgroundColor: 'green', cssFlex: 1}),
				Puer.div({text: 'Blue',  route: 'tab:blue',  cssBackgroundColor: 'blue',  cssFlex: 1}),
				Puer.Link({label: 'Green', hash: 'page:routing[tab:green]'}),
				Puer.Link({label: 'Blue',  hash: 'page:routing[tab:blue]'})
			]),
		])
	}
}

Puer.define(RoutingPage, import.meta.url)
export default RoutingPage