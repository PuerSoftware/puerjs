import Puer, {PuerComponent} from '../../../puer.js'

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
		return Puer.div([
			h3({text: this.props.title}),
			Puer.ul([
				Puer.li([
					Puer.a({
						text     : 'Test Puer Props',
						testName : 'testPuerProps',
						onclick  : this.test
					})
				]),
				Puer.li([
					Puer.a({
						text     : 'Test Puer Component Set',
						testName : 'testPuerComponentSet',
						onclick  : this.test
					})
				]),
				Puer.li([
					Puer.a({
						text     : 'Test Puer State',
						testName : 'testPuerState',
						onclick  : this.test
					})
				])
			])
		])
	}
}

Puer.define(UnitTestPage, import.meta.url)
export default UnitTestPage