import Puer          from '../../core/class.Puer.js'
import PuerComponent from '../../core/class.PuerComponent.js'


class Comp2 extends PuerComponent {
	constructor(props) {
		super(props)
		this.state.liText = 'HAHA'
		// console.log(this.state.liText)
	}


	changeState() {
		this.state.liText = this.state.liText + 'HA'
	}

	showChain() {
		// console.log('showChain', this.$)
		// console.log(this.$.ul.$.div)
		console.log('$$', this.$$$.Comp1[0].$.div)
		// console.log(this.$$.Comp1.$.div.toString())
		console.log('PuerHtmlElement', this.$$$.PuerHtmlElement)
	}

	renderItem() {
		this.append(div({onclick: this.changeState, text: this.state.liText}))
	}

	render() {
		return ul([
			div(this.children),
			li({text: this.state.liText}),
			li({text: 'haha2'}),
			button({onClick: this.renderItem, text: 'Add Item'}),
			button({onClick: this.showChain,  text: 'Show Chain'})
		])
	}
}

Puer.define(Comp2)
export default Comp2