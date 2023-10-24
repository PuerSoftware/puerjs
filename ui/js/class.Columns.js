import Puer from '../../puer.js'
import Box  from './class.Box.js'

class Columns extends Box {
	constructor(props, children) {
		super(props, children)
		this.props.default('text', '')
	}

	render() {
		return div(this.children)
	}
}

Puer.define(Columns, import.meta.url)
export default Columns