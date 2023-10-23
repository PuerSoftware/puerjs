import Puer, {PuerComponent} from '../../../puer.js'

import testPuerProps         from '../tests/testPuerProps.js'
import testPuerComponentSet  from '../tests/testPuerComponentSet.js'

class UnitTestPage extends PuerComponent {
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

Puer.define(UnitTestPage, import.meta.url)
export default UnitTestPage