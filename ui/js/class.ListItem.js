import $ from '../../index.js'


export default class ListItem extends $.Component {
	constructor(props, children) {
		super(props, children)
		this.props.require('name')
		this.props.require('data')

		this._isClickSubscribed = false
	}

	_triggerSelect() {
		this.trigger($.Event.LIST_ITEM_SELECT, {
			data: this.props.data,
			name: this.props.name
		})
	}

	_select(e) {
		const excludedTagNames = ['a', 'input', 'textarea', 'label', 'select', 'button', 'option']
		const isFromInput      = e && excludedTagNames.includes(e.target.tagName.toLowerCase())
		
		if (!isFromInput) {
			this._triggerSelect()
			this.scrollIntoView()
		}
	}

	/**********************************************************/

	select   () { this.addCssClass    ('selected') }
	deselect () { this.removeCssClass ('selected') }

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

	scrollIntoView() {
		this.element.scrollIntoView({ behavior: 'smooth', block: 'start' })
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

$.define(ListItem, import.meta.url)