import Puer, {PuerApp} from '../../puer.js'
import {Link}          from '../../ui/index.js'

import IndexPage       from './components/class.IndexPage.js'
import UnitTestPage    from './components/class.UnitTestPage.js'
import ComponentPage   from './components/class.ComponentsPage.js'
import FormPage        from './components/class.FormPage.js'
import RoutingPage     from './components/class.RoutingPage.js'

Puer.application(
	class App extends PuerApp {
		render() {
			return div([
				div('header', [
					h2({text: 'PuerJS'}),
					div([
						Puer.Link({ label: 'Home',       hash: 'page:index'     }),
						span({text: ' | '}),
						Puer.Link({ label: 'Unit Tests', hash: 'page:unit'      }),
						span({text: ' | '}),
						Puer.Link({ label: 'Form',       hash: 'page:form'      }),
						span({text: ' | '}),
						Puer.Link({ label: 'Component',  hash: 'page:component' }),
						span({text: ' | '}),
						Puer.Link({ label: 'Routing',    hash: 'page:routing'   }),
					])
				]),
				Puer.IndexPage     ({ title: 'Home',           route: 'page:index'     }),
				Puer.UnitTestPage  ({ title: 'Unit Tests',     route: 'page:unit'      }),
				Puer.FormPage      ({ title: 'Form Demo',      route: 'page:form'      }),
				Puer.ComponentPage ({ title: 'Component Demo', route: 'page:component' }),
				Puer.RoutingPage   ({ title: 'Routing Demo',   route: 'page:routing'   }),
			])
		}
	}, import.meta.url
).Router.default('page:form')