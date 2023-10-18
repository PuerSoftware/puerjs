import Puer, {PuerComponent} from '../../puer.js'
import Comp1                 from './class.Comp1.js'

Puer.application(
	class BasicApp extends PuerComponent {
		render() {
			return Puer.Comp1({myProp: 'xd'})
		}
	}
)