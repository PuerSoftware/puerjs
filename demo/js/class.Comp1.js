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

	myFunc() {
		this.root.onclick = null
	}

	render() {
		return div('', {onclick: this._onClick, text: 'Some Div'}, [
			Puer.Comp2([
				h1('', {myProp: 'test', text: 'H1'})
			])
		])
	}
}

Puer.define(Comp1)
export default Comp1