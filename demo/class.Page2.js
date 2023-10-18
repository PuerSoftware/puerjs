import Puer, {PuerComponent} from '../puer.js'
import {Page}                from '../ui/index.js'

class Page2 extends Page {

	goToPage1() {
		Puer.Router.navigate('page1')
	}

	render() {
		return div({text: 'Page2'}, [
			button({text: 'Go to Page1', onclick: this.goToPage1})
		])
	}
}

Puer.define(Page2)
export default Page2