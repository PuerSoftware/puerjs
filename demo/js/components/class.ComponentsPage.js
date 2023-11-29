import Puer, {PuerComponent}  from '../../../puer.js'

import SimpleComponent from './class.SimpleComponent.js'


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
		return div([
			// h3({text: this.props.title}),
			div([
				// p({text: 'State value'}),
				p({text: this.state.stateValue}),
			]),
			Puer.SimpleComponent({value: this.state.stateValue}),
			button({text: 'change state' , onclick: this.changeState})
		])
	}
}

Puer.define(ComponentPage, import.meta.url)
export default ComponentPage