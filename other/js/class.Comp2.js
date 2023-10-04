import Puer          from '../../class.Puer.js'
import PuerComponent from '../../class.PuerComponent.js'


class Comp2 extends PuerComponent {
	constructor(props) {
		super(props)
		this.state.liText = 'HAHA'
	}

	onClick() {
		// console.log('click', this)
		this.append(div('', {onclick: this.changeState, text: this.state.liText}))
	}

	changeState() {
		this.state.liText = this.state.liText + 'HA'
	}

	render() {
		return ul('', [
			div(this.children),
			li('', {text: this.state.liText}),
			li('', 'haha2'),
			button({onClick: this.onClick}, 'Add Item')
		])
	}
}

Puer.define(Comp2)
export default Comp2