import $         from '../../index.js'


export default class Counter extends $.Component {
	constructor(... args) {
		super(... args)
		this.props.require('counter')
	}

	onPropCounterChange(counter) {
		($.isNumber(counter) && counter > 0) || ($.isString(counter) && counter !== '')
			? this.show()
			: this.hide()
	}

	render() {
		return $.div([
			$.div('value', {text: this.props.counter})
		])
	}
}

$.define(Counter, import.meta.url)