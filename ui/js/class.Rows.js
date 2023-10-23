import Puer from '../../puer.js'
import Box  from './class.Box.js'

class Rows extends Box {
	constructor(props, children) {
		super(props, children)
		console.log(this.children.toArray())
		this.props.default('text', '')
	}

	render() {
		return div({
			cssDisplay       : 'flex',
			cssFlexDirection : 'column'
		}, this.children)
	}
}

Puer.define(Rows, import.meta.url)
export default Rows