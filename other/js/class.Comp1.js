import Puer          from '../../class.Puer.js'
import PuerComponent from '../../class.PuerComponent.js'
import Comp2         from './class.Comp2.js'


class Comp1 extends PuerComponent {
	constructor(props) {
		super(props)
	}

	render() {
		return div('', [
			Puer.Comp2([
				h1('', 'H1')
			])
		])
	}
}

Puer.define(Comp1)
export default Comp1