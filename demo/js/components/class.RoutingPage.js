import Puer, {PuerComponent}   from '../../../puer.js'


class RoutingPage extends PuerComponent{

	onClick(e) {
		Puer.Router.navigate(e.targetComponent.props.routeName)
	}

	render() {
		return div({cssDisplay: 'flex', cssFlexDirection: 'column'}, [
			h3({text: this.props.title}),
			div({cssDisplay: 'flex', cssFlexDirection: 'column'}),
		])
	}
}

Puer.define(RoutingPage, import.meta.url)
export default RoutingPage