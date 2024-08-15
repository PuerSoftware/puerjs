import $ from    '../../index.js'
import Box  from './Box.js'

class Columns extends Box {
	constructor(props, children) {
		super(props, children)
		this.props.default('text', '')
	}

	render() {
		return super.render()
	}
}

$.define(Columns, import.meta.url)
export default Columns
