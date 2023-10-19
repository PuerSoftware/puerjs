import Puer   from '../../../puer.js'
import {Page} from '../../../ui/index.js'

class IndexPage extends Page {

	navigateOnClick(e) {
		e.preventDefault()
		const routeName = e.targetComponent.props.routeName
		console.log(e)
		Puer.Router.navigate(routeName)
	}

	render() {
		return h2({text: 'Index page'}, [
			ul([
				li([a({text: 'Auto test page', href: '', routeName: 'autotest',  onclick: this.navigateOnClick})]),
				li([a({text: 'Form page',      href: '', routeName: 'form',      onclick: this.navigateOnClick})]),
				li([a({text: 'Component page', href: '', routeName: 'component', onclick: this.navigateOnClick})]),
			])
		])
	}
}

Puer.define(IndexPage)
export default IndexPage