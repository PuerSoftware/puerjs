import Puer          from '../../class.Puer.js'
import PuerComponent from '../../class.PuerComponent.js'


class Comp2 extends PuerComponent {
	constructor(props) {
		super(props)
	}

	onClick() {
		console.log('click', this)
		this.append(div('', 'dynamically appended'))
	}

	render() {
		return ul('', [
			div(this.children),
			li('', 'haha1'),
			li('', 'haha2'),
			button({onClick: this.onClick}, 'Add Item')
		])
	}
}

Puer.define(Comp2)
export default Comp2