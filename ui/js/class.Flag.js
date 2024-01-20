import $ from '../../index.js'


class Flag extends $.Component {
	constructor(... args) {
		super(... args)
		this.props.default('square', false)
		this.props.default('code',   'US')
		this.props.default('label', this.props.code)

		this.state.imgUrl = null

		this._imgUrl  = 'https://cdn.jsdelivr.net/gh/lipis/flag-icons@7.0.0/flags/'
		this._imgSize = this.props.square ? '1x1/' : '4x3/'
	}

	set code(code) {
		this.props.code   = code.toLowerCase()
		debugger
		const c = this.props.code
		this.state.imgUrl = `url(${this._imgUrl}${this._imgSize}${this.props.code}.svg)`
		this.props.square && this.addCssClass('square')
	}

	get code() {
		return this.props.code
	}

	onInit() {
		this.code = this.props.code
	}

	render() {
		return $.div({
			cssBackgroundImage : this.state.imgUrl,
			text               : this.props.label
		})
	}
}

$.define(Flag, import.meta.url)
export default Flag