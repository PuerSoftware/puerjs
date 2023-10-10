import Puer          from '../../core/class.Puer.js'
import PuerComponent from '../../core/class.PuerComponent.js'
import Comp2Base     from './class.Comp2Base.js'


class Comp2 extends Comp2Base {
	constructor(props) {
		super(props)
		this.state.liText = 'HAHA'
		// console.log(this.state.liText)
	}


	changeState() {
		this.state.liText = this.state.liText + 'HA'
	}

	showChain() {
		// console.log('this.$',                                this.$)                                   // +
		// console.log('this.$.ul',                             this.$.ul)                                // +
		// console.log('this.$.ul[0]',                    this.$.ul[0])                                   // +
		// console.log('this.$.ul[0].$.div',                    this.$.ul[0].$.div)                       // +
		// console.log('this.$$$.Comp1',                        this.$$$.Comp1)                           // +
		// console.log('this.$$$.Comp1[0].$.div',               this.$$$.Comp1[0].$.div)                  // +
		// console.log('this.$$$.Comp1[0].$.div[0].props.text', this.$$$.Comp1[0].$.div[0].props.text)    // +
		// console.log('this.$$$.Comp1[0].$.div[0].toString()',  this.$$$.Comp1[0].$.div[0].toString())   // +
		// console.log('this.$$$.PuerObject',              this.$$$.PuerObject)                           // +
		// console.log('this.$$$.PuerHtmlElement',              this.$$$.PuerHtmlElement)                 // +
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