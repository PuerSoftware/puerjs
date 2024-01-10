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

		this.on($.Event.LIST_ITEM_CHECK, this._onItemCheck)
	}

	_onItemCheck(event) {
		if (event.detail.name === this.props.name) {
			if (event.detail.targetComponent === this._headerCheckbox) {
				this.checkAll(!Boolean(this._checkedCount))
			} else {
				if (event.detail.isChecked) {
					this._checkedCount ++
					if (this._checkedCount >= 0) {
						this._checkHeader(true)
					}
				} else {
					this._checkedCount --
					if (this._checkedCount <= 0) {
						this._checkHeader(false)
					}
				}
			}
		}
	}

	_checkHeader(check) {
		if (this._headerCheckbox) {
			this._headerCheckbox.input.element.checked = check
		}
	}

	_resendCheckEvent() {
		for (const id in this.items) {
			const item = this.items[id]
			item.checkbox.sendCheckEvent()
		}
	}

	checkAll(check) {
		for (const itemId in this.items) {
			const item = this.items[itemId]
			item.checkbox.value = check
		}
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
			this._headerCheckbox = $.InputCheckbox({label: 'Select All', name: this.props.name})
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
