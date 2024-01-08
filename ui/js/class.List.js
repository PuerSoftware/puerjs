import $              from '../../index.js'
import ListItem   from './class.ListItem.js'
import DataOwnerMixin from '../../library/class.DataOwnerMixin.js'


export default class List extends $.Component {
	constructor(props, children) {
		super(props, children)
		this.props.require('name')

		this.items         = {}  // { dataStoreId : itemComponent } for easy lookup when applying sort and filter
		this.itemRenderer  = 'ListItem'
		// this.itemProps     = {}
		this.itemContainer = this // may be set manually in child class

		this.on($.Event.LIST_ITEM_SELECT, this._onItemSelect)
		// this.on($.Event.PROVOKE_EVENT,    this._onProvokeEvent)


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

	// _onProvokeEvent(event) {
	// 	if (event.detail.name === this.props.name) {
	// 		if (event.detail.type === $.Event.LIST_ITEM_SELECT) {
	// 			if (this._selectedId) {
	// 				this.items[this._selectedId]._select()
	// 			}
	// 		}
	// 	}
	// }

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

	onActivate() {
		this._ensureSelection()
	}

	renderItem(item) {
		return $[this.itemRenderer]({
			data: item,
			name: this.props.name
		})
	}

	render() {
		return $.ul(this.children)
	}
}

$.define(List, import.meta.url)