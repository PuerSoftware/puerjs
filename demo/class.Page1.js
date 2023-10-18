import Puer, {PuerComponent} from '../puer.js'
import {Page}                from '../ui/index.js'

class Page1 extends Page {

	goToPage2() {
		Puer.Router.navigate('page2')
	}

	render() {
		return div({text: 'Page1'}, [
			button({text: 'Go to Page2', onclick: this.goToPage2})
		])
	}
}

Puer.define(Page1)
export default Page1