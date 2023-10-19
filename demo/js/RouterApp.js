import Puer, {PuerApp} from '../../puer.js'
import Page1           from '../class.Page1.js'
import Page2           from '../class.Page2.js'

Puer.application(
	class RouterApp extends PuerApp {
		render() {
			return div([
				Puer.Page1(),
				Puer.Page2()
			])
		}
	}
).router((app) => {
	return {
		page1: {path: '#page1', component: app.$$.Page1[0]},
		page2: {path: '#page2', component: app.$$.Page2[0]}
	}
}).navigate('page1')