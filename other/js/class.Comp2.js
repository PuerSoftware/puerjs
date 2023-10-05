import Puer          from '../../class.Puer.js'
import PuerComponent from '../../class.PuerComponent.js'


class Comp2 extends PuerComponent {
	constructor(props) {
		super(props)
		this.state.liText = 'HAHA'
	}

	onClick() {
		this.append(() => div({onclick: this.changeState, text: this.state.liText}))
	}

	changeState() {
		this.state.liText = this.state.liText + 'HA'
	}

	showChain() {
		console.log(this.$.ul.$.button[0])
		console.log(this.$$.Comp1)
		console.log(this.$$.Comp1.$.div.toString())
	}

	render() {
		console.log(this.children, div())
		return ul([
			div(this.children),
			li({text: this.state.liText}),
			li({text: 'haha2'}),
			button({onClick: this.onClick,   text: 'Add Item'}),
			button({onClick: this.showChain, text: 'Show Chain'})
		])
	}
}

Puer.define(Comp2)
export default Comp2