import $, {PuerComponent}  from '../../../puer.js'

import Comp1 from './class.Comp1.js'

class ComponentPage extends PuerComponent {

	constructor(props, children) {
		super(props, children)
		this.state.stateValue = 'sv'
	}

	changeState(e) {
		console.log('changeState', this.state.references['stateValue'].id)
		this.state.stateValue = this.state.stateValue + 'sv'
	}

	render() {
		return $.div([
			h3({text: this.props.title}),
			$.Comp1({myProp: 'xd'})
		])
	}
}

$.define(ComponentPage, import.meta.url)
export default ComponentPage