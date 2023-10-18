import Puer, {PuerComponent, PuerRouter} from '../../puer.js'
import Page1                             from '../class.Page1.js'
import Page2                             from '../class.Page2.js'

class RouterApp extends PuerComponent {
	constructor(props, children) {
		super(props, children)
	}

	render() {
		return div([
			Puer.Page1(),
			Puer.Page2()
		])
	}
}

Puer.define(RouterApp)
Puer.init().app('#demo', Puer.RouterApp())
Puer.Router.define((appRoot) => {
	return {
		page1: {path: '#page1', component: appRoot.$.Page1[0]},
		page2: {path: '#page2', component: appRoot.$.Page2[0]}
	}
	},
	'page1'
)