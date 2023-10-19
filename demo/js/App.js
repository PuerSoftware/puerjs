import Puer, {PuerApp} from '../../puer.js'

import IndexPage     from './pages/class.IndexPage.js'
import AutoTestPage  from './pages/class.AutoTestPage.js'
import ComponentPage from './pages/class.ComponentsPage.js'
import FormPage      from './pages/class.FormPage.js'

Puer.application(
	class App extends  PuerApp {
		render() {
			return div([
				h1({text: 'Puer Demo App'}),
				Puer.IndexPage(),
				Puer.AutoTestPage(),
				Puer.FormPage(),
				Puer.ComponentPage(),
			])
		}
	}, import.meta.url
).router((app) => {
	return {
		index     : {path: 'index',     component: app.$$.IndexPage[0]     },
		autotest  : {path: 'autotest',  component: app.$$.AutoTestPage[0]  },
		form      : {path: 'form',      component: app.$$.FormPage[0]      },
		component : {path: 'component', component: app.$$.ComponentPage[0] }
	}
}).navigate('index')