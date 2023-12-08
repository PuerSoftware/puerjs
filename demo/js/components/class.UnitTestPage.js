import $, {PuerComponent} from '../../../puer.js'

import testPuerProps         from '../tests/testPuerProps.js'
import testPuerComponentSet  from '../tests/testPuerComponentSet.js'
import testPuerState         from '../tests/testPuerState.js'

class UnitTestPage extends PuerComponent {
	constructor(props, children) {
		super(props, children)
		this.tests = {
			testPuerProps        : testPuerProps,
			testPuerComponentSet : testPuerComponentSet,
			testPuerState        : testPuerState
		}
	}

	test(e) {
		this.tests[e.targetComponent.props.testName]()
	}

	render() {
		return $.div([
			h3({text: this.props.title}),
			$.ul([
				$.li([
					$.a({
						text     : 'Test $ Props',
						testName : 'testPuerProps',
						onclick  : this.test
					})
				]),
				$.li([
					$.a({
						text     : 'Test $ Component Set',
						testName : 'testPuerComponentSet',
						onclick  : this.test
					})
				]),
				$.li([
					$.a({
						text     : 'Test $ State',
						testName : 'testPuerState',
						onclick  : this.test
					})
				])
			])
		])
	}
}

$.define(UnitTestPage, import.meta.url)
export default UnitTestPage