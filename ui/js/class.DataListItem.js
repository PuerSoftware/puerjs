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

	onReady() {
		if (!this._isClickSubscribed) {
			this.element.addEventListener('click', this._select.bind(this))
			this._isClickSubscribed = true
		}
	}

	render() {
		return $.li({text: this.props.data.dataId, onclick: this._select})
	}
}

$.define(DataListItem, import.meta.url)