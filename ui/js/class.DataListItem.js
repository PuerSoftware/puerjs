import $ from '../../index.js'


export default class DataListItem extends $.Component {
	constructor(props, children) {
		super(props, children)
		this.props.require('data')
	}

	_select(event) {
		this.trigger($.Event.LIST_ITEM_SELECT, this.props.data)
	}

	/**********************************************************/

	select() {
		this.addCssClass('selected')
	}

	deselect() {
		this.removeCssClass('selected')
	}

	highlight(query) {
		if (!this.isHidden) {
			super.highlight(query)
		}
	}

	unhighlight() {
		if (!this.isHidden) {
			super.unhighlight()
		}
	}

	onReady() {
		this.element.addEventListener('click', this._select.bind(this))
	}

	render() {
		return $.li({text: this.props.data.dataId, onclick: this._select})
	}
}

$.define(DataListItem, import.meta.url)