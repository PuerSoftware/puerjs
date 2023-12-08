import $, {PuerComponent}   from '../../../puer.js'

class SimpleComponent extends PuerComponent {
	constructor(props, children) {
		super(props, children)
	}

	render() {
		return $.div({text: this.props.value})
	}
}

$.define(SimpleComponent)
export default SimpleComponent