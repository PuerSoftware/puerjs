import $ from '../../index.js'


class Flag extends $.Component {
	constructor(... args) {
		super(... args)
		this.props.default('square', false)
		this.props.require('code',   'US')
		this.props.default('label',  '')

		this.state.imgUrl = null

		this._imgUrl  = 'https://cdn.jsdelivr.net/gh/lipis/flag-icons@7.0.0/flags/'
		this._imgSize = this.props.square ? '1x1/' : '4x3/'
	}

	set code(code) {
		this.props.code = code
	}

	get code() {
		return this.props.code
	}

	onPropCodeChange(code) {
		if (code) {
			code = code.toLowerCase()
			this.state.imgUrl = `url(${this._imgUrl}${this._imgSize}${code}.svg)`
			this.props.square && this.addCssClass('square')
		}
	}

	// onInit() {
	// 	this.code = this.props.code
	// }

	render() {
		return $.div({
			cssBackgroundImage : this.state.imgUrl,
			text               : this.props.label
		})
	}
}

$.define(Flag, import.meta.url)
export default Flag