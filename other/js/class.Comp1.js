import Puer          from '../../class.Puer.js'
import PuerComponent from '../../class.PuerComponent.js'
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
		return div('', {onclick: this._onClick}, [
			Puer.Comp2([
				h1('', {myProp: this.props.myProp}, 'H1')
			])
		])
	}
}

Puer.define(Comp1)
export default Comp1