import Puer, {PuerError} from '../../../puer.js'
import {Page}            from '../../../ui/index.js'

import testPuerProps        from '../tests/testPuerProps.js'
import testPuerComponentSet from '../tests/testPuerComponentSet.js'

class AutoTestPage extends Page {
	constructor(props, children) {
		super(props, children)
		this.tests = {
			testPuerProps        : testPuerProps,
			testPuerComponentSet : testPuerComponentSet
		}
	}

	test(e) {
		this.tests[e.targetComponent.props.testName]()
	}

	render() {
		return div([
			h3({text: this.props.title}),
			ul([
				li([
					h3({text: 'Puer Props'}),
					ul([
						li([
							a({
								text     : 'Test Puer Props',
								href     : 'javascript:void(0)',
								testName : 'testPuerProps',
								onclick  : this.test
							})
						])
					])
				]),
				li([
					h3({text: 'Puer Component Set'}),
					ul([
						li([
							a({
								text     : 'Test Puer Component Set',
								href     : 'javascript:void(0)',
								testName : 'testPuerComponentSet',
								onclick  : this.test
							})
						])
					])
				])
			])
		])
	}
}

Puer.define(AutoTestPage, import.meta.url)
export default AutoTestPage