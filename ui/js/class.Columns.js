import Puer from '../../puer.js'
import Box  from './class.Box.js'

class Columns extends Box {
	constructor(props, children) {
		super(props, children)
	}

	render() {
		return div({cssFlex: true, cssDirection: 'rows'}, this.children)
	}
}

Puer.define(Columns, import.meta.url)
export default Columns