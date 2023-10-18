import Puer, {PuerComponent} from '../puer.js'

class Page extends PuerComponent {
	constructor(props, children) {
		super(props, children)
	}

	activate() {
		this.show()
	}

	deactivate() {
		this.hide()
	}
}

Puer.define(Page)
export default Page