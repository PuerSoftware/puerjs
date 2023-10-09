import Puer          from '../../core/class.Puer.js'
import PuerComponent from '../../core/class.PuerComponent.js'
import Comp2         from './class.Comp2.js'


class Comp1 extends PuerComponent {
	constructor(props) {
		super(props)
	}

	init() {
		Puer.Events.send('Event', {})
	}

	_onClick(e) {

	}

	showChain() {
		console.log('this.$$.Comp2Base', this.$$.Comp2Base)
		console.log('this.$$.Comp2',     this.$$.Comp2)
	}

	render() {
		return div('', {onclick: this._onClick, text: 'Some Div'}, [
			Puer.Comp2([
				h1('', {myProp: 'test', text: 'H1'})
			]),
			// console.log('render in Comp1', Puer.renderOwner),
			button({onClick: this.showChain,  text: 'Show Chain in Comp1'})
		])
	}
}

Puer.define(Comp1)
export default Comp1