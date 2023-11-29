import Puer, {PuerComponent}   from '../../../puer.js'

class SimpleComponent extends PuerComponent {
	constructor(props, children) {
		super(props, children)
		// console.clear()
		console.log('constructor', this.props.value.id)
	}

	render() {
		console.log('render', this.props.value.id)
		return div({text: this.props.value})
	}
}

Puer.define(SimpleComponent)
export default SimpleComponent