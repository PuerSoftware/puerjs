import Puer          from '../../../core/class.Puer.js'
import PuerComponent from '../../../core/class.PuerComponent.js'
import Comp2         from './class.Comp2.js'


class Comp1 extends PuerComponent {
	constructor(props, children) {
		super(props, children)
		this.state.randomColor = '#000'
	}

	init() {
		Puer.Events.send('Event', {})
	}

	_onClick(e) {

	}

	showChain() {
		// console.log('this.$$.Comp2Base', this.$$.Comp2Base) // +
		// console.log('this.$$.Comp2',     this.$$.Comp2)     // +
	}

	changeMyProp() {
		this.props.myProp = this.props.myProp + 'xd'
	}

	setRandomColor() {
		this.state.randomColor = '#' + Puer.String.randomHex(6)
	}

	render() {
		return div('', {text: 'Some Div', onclick: this._onClick}, [
			Puer.Comp2({myProp: this.props.myProp},[
				h1({myProp: 'test', cssBackgroundColor: this.state.randomColor}, [text('H1')])
			]),
			button({onClick: this.showChain}, [text('Show Chain in Comp1')]),
			button({onClick: this.changeMyProp}, [text('Change prop')]),
			button({onClick: this.setRandomColor}, [text('Change color')]),
		])
	}
}

Puer.define(Comp1, import.meta.url)
export default Comp1