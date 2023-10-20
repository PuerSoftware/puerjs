import Puer, {PuerComponent}  from '../../../puer.js'

import Comp1  from './class.Comp1.js'


class ComponentPage extends PuerComponent {
	render() {
		return div([
			h3({text: this.props.title}),
			Puer.Comp1({myProp: 'xd'})
		])
	}
}

Puer.define(ComponentPage, import.meta.url)
export default ComponentPage