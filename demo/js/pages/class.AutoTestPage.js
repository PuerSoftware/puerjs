import Puer, {PuerError} from '../../../puer.js'
import {Page}            from '../../../ui/index.js'

import testPuerProps        from '../tests/testPuerProps.js'
import testPuerComponentSet from '../tests/testPuerComponentSet.js'

class AutoTestPage extends Page {

	testOnClick(e) {
		e.preventDefault()
		const componentId = e.target.id
		console.clear()
		switch (componentId) {
			case 'test-puer-props':
				testPuerProps()
				return
			case 'test-puer-component-set':
				testPuerComponentSet()
				return
			default:
				throw new PuerError('Unknown testing case id!')
		}
	}

	render() {
		return div([
			h1({text: 'Puer Auto Tests'}),
			ul([
				li([
					h3({text: 'Puer Props'}),
					ul([
						li([
							a({text: 'Test Puer Props', href: '', id: 'test-puer-props', onclick: this.testOnClick})
						])
					])
				]),
				li([
					h3({text: 'Puer Component Set'}),
					ul([
						li([
							a({text: 'Test Puer Component Set', href: '',  id: 'test-puer-component-set', onclick: this.testOnClick})
						])
					])
				])
			])
		])
	}
}

Puer.define(AutoTestPage, import.meta.url)
export default AutoTestPage