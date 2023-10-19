import Puer, {PuerApp} from '../../puer.js'
import Comp1           from './class.Comp1.js'

Puer.application(
	class BasicApp extends PuerApp {
		render() {
			return Puer.Comp1({myProp: 'xd'})
		}
	}
)

console.log(Puer.app.toTreeString())