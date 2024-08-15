import $         from '../../index.js'
import {DataOwnerMixin} from '../../library/index.js'


export default class Counter extends $.Component {
	constructor(... args) {
		super(... args)
		this.props.default('count', 0)
		this.props.default('onCountChange', null)
		this.on($.Event.COUNTER_UPDATE, this._onCounterUpdate)
	}

	_onCounterUpdate(e) {
		this.props.count = e.detail.count
	}

	onPropCountChange(count) {
		($.isNumber(count) && count > 0) || ($.isString(count) && count !== '')
			? this.show()
			: this.hide()
		this.props.onCountChange && this.props.onCountChange(count)
	}

	render() {
		return $.div([
			$.div('value', {text: this.props.count})
		])
	}
}

$.define(Counter, import.meta.url)