import Puer, {PuerComponent} from '../puer.js'

class Page extends PuerComponent {
	constructor(props, children) {
		super(props, children)
	}

	activate() {
		console.log('activate', this.className)
		this.show()
	}

	deactivate() {
		console.log('deactivate', this.className)
		this.hide()
	}
}

Puer.define(Page)
export default Page