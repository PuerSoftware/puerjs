import Puer   from '../../../puer.js'
import {Page} from '../../../ui/index.js'

import Comp1  from '../components/class.Comp1.js'


class ComponentPage extends Page {
	render() {
		return Puer.Comp1({myProp: 'xd'})
	}
}

Puer.define(ComponentPage)
export default ComponentPage