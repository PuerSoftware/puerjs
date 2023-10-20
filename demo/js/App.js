import Puer, {PuerApp} from '../../puer.js'

import {PageTab} from '../../ui/index.js'

import IndexPage     from './pages/class.IndexPage.js'
import AutoTestPage  from './pages/class.AutoTestPage.js'
import ComponentPage from './pages/class.ComponentsPage.js'
import FormPage      from './pages/class.FormPage.js'

Puer.application(
	class App extends PuerApp {
		render() {
			return div([
				div('header', [
					h2({text: 'PuerJS'}),
					div([
						Puer.PageTab({ label: 'Home',           route: 'index'     }),
						Puer.PageTab({ label: 'Unit Tests',     route: 'auto'      }),
						Puer.PageTab({ label: 'Form Demo',      route: 'form'      }),
						Puer.PageTab({ label: 'Component Demo', route: 'component' }),
					])
				]),
				Puer.IndexPage     ({ title: 'Home'           }),
				Puer.AutoTestPage  ({ title: 'Unit Tests'     }),
				Puer.FormPage      ({ title: 'Form Demo'      }),
				Puer.ComponentPage ({ title: 'Component Demo' }),
			])
		}
	}, import.meta.url
).router((app) => {
	return {
		index     : { path: 'index',     component: app.$$.IndexPage[0]     },
		auto      : { path: 'auto',      component: app.$$.AutoTestPage[0]  },
		form      : { path: 'form',      component: app.$$.FormPage[0]      },
		component : { path: 'component', component: app.$$.ComponentPage[0] }
	}
}).default('index')