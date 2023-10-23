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
						Puer.Link({ label: 'Home',       path: 'index'     }),
						Puer.Link({ label: 'Unit Tests', path: 'unit'      }),
						Puer.Link({ label: 'Form',       path: 'form'      }),
						Puer.Link({ label: 'Component',  path: 'component' }),
						Puer.Link({ label: 'Routing',    path: 'routing'   }),
					])
				]),
				Puer.IndexPage     ({ title: 'Home',           route: 'index'     }),
				Puer.UnitTestPage  ({ title: 'Unit Tests',     route: 'unit'      }),
				Puer.FormPage      ({ title: 'Form Demo',      route: 'form'      }),
				Puer.ComponentPage ({ title: 'Component Demo', route: 'component' }),
				Puer.RoutingPage   ({ title: 'Routing Demo',   route: 'routing'   }),
			])
		}
	}, import.meta.url
).Router.default('index')