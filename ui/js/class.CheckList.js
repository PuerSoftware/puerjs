import $             from '../../index.js'
import List          from './class.List.js'
import InputCheckbox from './class.InputCheckbox.js'

export default class CheckList extends List {
	constructor(... args) {
		super(... args)
		this.props.default('header', true)

		this.itemContainer = null
		this.itemRenderer  = 'CheckListItem'

		this._checkedCount   = 0
		this._headerCheckbox = null
		this._isCheckingAll  = false

		this.on($.Event.LIST_ITEM_CHECK, this._onItemCheck)
	}

	_onItemCheck(event) {
		if (event.detail.name === this.props.name && !event.detail.isResend) {
			if (event.detail.targetComponent === this._headerCheckbox) {
				this.checkAll(!Boolean(this._checkedCount))
			} else {
				if (event.detail.isChecked) {
					this._checkedCount ++
				} else {
					this._checkedCount --
				}
				this._updateHeaderCheckbox()
			}
		}
	}

	_updateHeaderCheckbox() {
		if (this._headerCheckbox) {
			if (this._checkedCount > 0) {
				this._headerCheckbox.props.label = 'Unselect all'
				if (!this._isCheckingAll) {
					this._headerCheckbox.input.element.checked = true // check without triggering an event
				}
			} else if (this._checkedCount == 0) {
				this._headerCheckbox.props.label = 'Select all'
				if (!this._isCheckingAll) {
					this._headerCheckbox.input.element.checked = false // check without triggering an event
				}
			}
		}
	}

	_resendCheckEvent() {
		for (const id in this.items) {
			const item = this.items[id]
			item.checkbox.sendCheckEvent(true)
		}
	}

	removeItem(itemId) {
		const itemComponent = this.items[itemId]
		if (itemComponent) {
			itemComponent.checked = false
			itemComponent.remove()
			delete this.items[itemId]
		}
	}

	checkAll(check) {
		this._isCheckingAll = true
		for (const itemId in this.items) {
			const item = this.items[itemId]
			item.checked = check
		}
		this._isCheckingAll = false
	}

	getCheckedItems() {
		const checkedItems = []
		for (const item of this.itemContainer.children) {
			if (item.checked) {
				checkedItems.push(item)
			}
		}
		return checkedItems
	}

	onRoute() {
		super.onRoute()
		this._resendCheckEvent()
	}

	render() {
		this.itemContainer = $.ul('body')
		const checkboxes = []
		if (this.props.header) {
			this._headerCheckbox = $.InputCheckbox({
				label : 'Select all',
				name  : this.props.name
			})
			checkboxes.push(this._headerCheckbox)
		}

		return $.Rows([
			$.Box('head', [
				$.Columns([
					$.Box('left',  checkboxes),
					$.Box('right', this.children)
				])
			]),
			this.itemContainer
		])
	}
}

$.define(CheckList, import.meta.url)
