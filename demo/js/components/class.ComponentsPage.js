import Puer, {PuerComponent}  from '../../../puer.js'

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
		return Puer.div([
			h3({text: this.props.title}),
			Puer.Comp1({myProp: 'xd'})
		])
	}
}

Puer.define(ComponentPage, import.meta.url)
export default ComponentPage