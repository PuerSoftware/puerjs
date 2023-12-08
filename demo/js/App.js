import $, {PuerApp} from '../../puer.js'
import {Link}          from '../../ui/index.js'

import IndexPage       from './components/class.IndexPage.js'
import UnitTestPage    from './components/class.UnitTestPage.js'
import ComponentPage   from './components/class.ComponentsPage.js'
import FormPage        from './components/class.FormPage.js'
import RoutingPage     from './components/class.RoutingPage.js'
import ButtonPage      from './components/class.ButtonPage.js'

$.application(
	class App extends PuerApp {
		render() {
			return $.div({cssMargin: '50px'}, [
				$.div('header', [
					$.h2({text: 'PuerJS'}),

					$.div([
						// $.Link({ label: 'Home',       hash: 'page:index'     }),
						// $.span({text: ' | '}),
						// $.Link({ label: 'Unit Tests', hash: 'page:unit'      }),
						// $.span({text: ' | '}),
						// $.Link({ label: 'Form',       hash: 'page:form'      }),
						// $.span({text: ' | '}),
						// $.Link({ label: 'Component',  hash: 'page:component' }),
						// $.span({text: ' | '}),
						// $.Link({ label: 'Routing',    hash: 'page:routing'   }),
						// $.Link({ label: 'Button',     hash: 'page:button'   }),
					])
				]),
				$.div({cssMargin: '50px'}),
				$.ButtonPage   ({ title: 'Buttons Demo'}),
				// $.IndexPage     ({ title: 'Home',           route: 'page:index'     }),
				// $.UnitTestPage  ({ title: 'Unit Tests',     route: 'page:unit'      }),
				// $.FormPage      ({ title: 'Form Demo',      route: 'page:form'      }),
				// $.ComponentPage ({ title: 'Component Demo', route: 'page:component' }),
				// $.RoutingPage   ({ title: 'Routing Demo',   route: 'page:routing'   }),
			])
		}
	}, import.meta.url
)