import $         from '../../index.js'


export default class Counter extends $.Component {
	constructor(... args) {
		super(... args)
		this.props.require('counter')
		this.props.default('allowZero', false)
	}

	onPropCounterChange(counter) {
		if ($.isNumber(counter)) {
			if (!this.props.allowZero) {
				if (counter <= 0) {
					this.hide()
				} else {
					this.isHidden && this.show()
				}
			}
		}
	}

	render() {
		return $.div([
			$.div('value', {text: this.props.counter})
		])
	}
}

$.define(Counter, import.meta.url)