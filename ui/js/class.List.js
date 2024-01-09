import $              from '../../index.js'
import ListItem   from './class.ListItem.js'
import DataOwnerMixin from '../../library/class.DataOwnerMixin.js'


export default class List extends $.Component {
	constructor(props, children) {
		super(props, children)
		this.props.require('name')

		this.items         = {}  // { dataStoreId : itemComponent } for easy lookup when applying sort and filter
		this.itemRenderer  = 'ListItem'
		this.itemContainer = this // may be set manually in child class

		this.on($.Event.LIST_ITEM_SELECT, this._onItemSelect)

		this._selectedId  = null
	}

	_onItemSelect(event) {
		// Its mean, that these items is owned by this list
		if (event.detail.name === this.props.name) {
			for (const itemId in this.items) {
				const item = this.items[itemId]
				if (event.detail.targetComponent === item) {
					this._selectedId = itemId
						item.select()
				} else {
					item.deselect()
				}
			}
		}
	}

	_ensureSelection() {
		if (this.length) {
			if (this._selectedId) {
				this.items[this._selectedId]._select()
			} else {
				this._selectFirstItem()
			}
		}
	}

	_selectFirstItem() {
		if (this.length) {
			const item = this.firstItem
			item && item._select()
		}
	}

	/**************************************************************/

	get length() {
		return Object.values(this.items).length
	}

	get firstItem() {
		return Object.values(this.items)[0]
	}

	onRoute() {
		this._ensureSelection()
	}

	renderItem(item) {
		return $[this.itemRenderer]({
			data: item,
			name: this.props.name
		})
	}

	/*****************************************************************/
	/*
	TODO: check if need create no-dataSource mixin for List.
	If need, mixin must implements methods for working with this.items.
	Example: addItem, removeItem, clearItems, sortItems, filterItems etc.
	In this mixin case item will be components.
	*/
	addItem(item) {
		const itemComponent = this.renderItem(item)
		this.itemContainer.append(itemComponent)
		this.items[itemComponent.id] = itemComponent
	}

	removeItem(itemId) {
		const itemComponent = this.items[itemId]
		if (itemComponent) {
			itemComponent.remove()
			delete this.items[itemId]
		}
	}

	clearItems() {
		this.itemContainer.removeChildren()
		this.items = {}
	}
	/*****************************************************************/
	render() {
		return $.ul(this.children)
	}
}

$.define(List, import.meta.url)