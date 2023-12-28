import $ from '../../index.js'


export default class DataListItem extends $.Component {
	constructor(props, children) {
		super(props, children)
		this.props.require('data')
		this.props.require('name')

		this._isClickSubscribed = false
	}

	_select(event) {
		this.trigger($.Event.LIST_ITEM_SELECT, {
			data: this.props.data,
			name: this.props.name
		})
	}

	/**********************************************************/

	select() {
		this.addCssClass('selected')
	}

	deselect() {
		this.removeCssClass('selected')
	}

	highlight(words) {
		if (!this.isHidden) {
			super.highlight(words)
		}
	}

	unhighlight() {
		if (!this.isHidden) {
			super.unhighlight()
		}
	}

	onInit() {
		if (!this._isClickSubscribed) {
			this._on('click', this._select)
			this._isClickSubscribed = true
		}
	}

	render() {
		return $.li({ text: this.props.data.dataId })
	}
}

$.define(DataListItem, import.meta.url)