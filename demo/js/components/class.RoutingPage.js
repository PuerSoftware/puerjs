import Puer, {PuerComponent}   from '../../../puer.js'


class RoutingPage extends PuerComponent{

	onClick(e) {
		Puer.Router.navigate(e.targetComponent.props.routeName)
	}

	render() {
		return div({cssDisplay: 'flex', cssFlexDirection: 'column'}, [
			h3({text: this.props.title}),
			div({cssDisplay: 'flex', cssFlexDirection: 'row'}, [
				div({text: 'Green', route: 'green', cssBackgroundColor: 'green', cssFlex: 1}),
				div({text: 'Blue',  route: 'blue',  cssBackgroundColor: 'blue',  cssFlex: 1}),
				Puer.Link({label: 'Green', path: 'green'}),
				Puer.Link({label: 'Blue',  path: 'blue'})
			]),
		])
	}
}

Puer.define(RoutingPage, import.meta.url)
export default RoutingPage