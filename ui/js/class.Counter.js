import $         from '../../index.js'
import {DataOwnerMixin} from '../../library/index.js'


export default class Counter extends $.Component {
	constructor(... args) {
		super(... args)
		this.props.default('count', 0)
		this.props.default('dataSource',  null)
		this.props.default('itemReducer', null)
	}

	_updateCount() {
		this.props.count = this.dataSet.reduce(this.props.itemReducer)
	}

	onPropCountChange(count) {
		($.isNumber(count) && count > 0) || ($.isString(count) && count !== '')
			? this.show()
			: this.hide()
	}

	onDataChange(items)    { this._updateCount() }

	onDataItemAdd(item)    { this._updateCount() }

	onDataItemChange(item) { this._updateCount(); console.log('onDataItemChange', this.props.count) }

	onInit() {
		if (this.props.dataSource && !this.dataSource) {
			this.mixin(DataOwnerMixin)
		}
	}

	render() {
		return $.div([
			$.div('value', {text: this.props.count})
		])
	}
}

$.define(Counter, import.meta.url)