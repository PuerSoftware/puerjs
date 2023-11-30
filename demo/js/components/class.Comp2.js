import Puer          from '../../../core/class.Puer.js'
import PuerComponent from '../../../core/class.PuerComponent.js'
import Comp3         from './class.Comp3.js'

class Comp2 extends PuerComponent {
	constructor(props, children) {
		super(props, children)
		this.state.liText = 'HAHA'
	}


	changeState() {
		this.state.liText = this.state.liText + 'HA'
		this.$$$.Comp1[0].setRandomColor()
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
		// console.log('this.$$$.PuerObject',                    this.$$$.PuerObject)                           // +
		// console.log('this.$$$.PuerHtmlElement',              this.$$$.PuerHtmlElement)                 // +
		console.log('this.$$$.Comp1[0].$.div[0].$.text[0].props.text', this.$$$.Comp1[0].$.div[0].$.text[0].props.text)
		console.log('this.$$$.Comp1[0].$.div[0].props.text', this.$$$.Comp1[0].$.div[0].props.text)
	}

	renderItem() {
		this.$.ul[0].$.div[0].prepend(div({onclick: this.changeState, text: this.state.liText}))
	}

	removeItem() {
		this.$.ul[0].$.div[0].remove()
	}

	render() {
		return ul ({text: this.props.myProp}, [
			div    (this.children),
			li     ([text(this.state.liText)]),
			li     ([text(this.state.liText + 'myText with data')]),
			li     ([text(`${this.props.myProp} myText with props`)]),
			li     ([text(this.props.myProp)]),
			li     ([text(this.props.myProp)]),
			Puer.Comp3({myProp: this.props.myProp}),
			button ({onClick: this.changeState}, [text('Change state')]),
			button ({onClick: this.renderItem},  [text('Add Item')]),
			button ({onClick: this.removeItem},  [text('Remove Item')]),
			button ({onClick: this.showChain},   [text('Show Chain')])
		])
	}
}

Puer.define(Comp2, import.meta.url)
export default Comp2