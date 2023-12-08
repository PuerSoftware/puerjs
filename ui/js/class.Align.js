import $ from '../../puer.js'
import Box  from './class.Box.js'

class Align extends Box {
	constructor(props, children) {
		super(props, children)
		this.props.default('text', '')
	}

	render() {
		let margin_t  = 'auto'
		let margin_r  = 'auto'
		let margin_b  = 'auto'
		let margin_l  = 'auto'
		let textAlign = 'center'
		let margin    = `${margin_t} ${margin_r} ${margin_b} ${margin_l}`
		
		return $.div({ cssMargin: margin, cssTextAlign: textAlign }, this.children)
	}
}

$.define(Align)
export default Align