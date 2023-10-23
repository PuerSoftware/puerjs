import Puer from '../../puer.js'
import Box  from './class.Box.js'

class Rows extends Box {
	constructor(props, children) {
		super(props, children)
	}

	render() {
		return div({cssFlex: true, cssDirection: 'columns'}, this.children)
	}
}

Puer.define(Rows, import.meta.url)
export default Rows