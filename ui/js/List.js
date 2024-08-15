import $              from '../../index.js'
import ListItem       from './ListItem.js'
import DataOwnerMixin from '../../library/DataOwnerMixin.js'


export default class List extends $.Component {
	constructor(props, children) {
		super(props, children)
		this.props.require('name')
		this.props.default('isSelectable', true)
		this.props.default('pageSize',     null)
		this.props.default('onBuffer',     null)
		this.props.default('ensureSelection', this.props.isSelectable)
		this.props.default('itemRenderer', 'ListItem')

		this.items            = {} // { id : itemComponent } for easy lookup when applying sort and filter
		this.disabledItems    = new Set() // [id, ...]
		this.buffer           = [] // [id]
		this.itemData         = [] // [data, ...] data is list item data
		this.filteredItemData = [] // [data, ...] data is list item data
		this.idxToId          = {} // {idx: id} idx is index of data in in filteredItemData
		this.idToIdx          = {} // {id: idx} idx is index of data in in filteredItemData

		this.itemRenderer     = this.props.itemRenderer
		this.itemContainer    = null // may be set manually in child class

		this._selectedId       = null
		this._filterMap    	   = null
		this._sortMap      	   = null
		this._numRenderedItems = 0

		this.on($.Event.LIST_ITEM_SELECT, this._onItemSelect, this.name)
	}

	_onScroll(e) {
		const up = this._isDirectionUp()
		if (this._canBuffer(up)) {
			this._buffer(up)
		}
	}

	_onItemSelect(e) {
		// Its mean, that these items is owned by this list
		if (this.props.isSelectable) {
			for (const itemId in this.items) {
				const item = this.items[itemId]
				if (e.detail.target === item) {
					this._selectedId = itemId
					item.select()
				} else {
					item  && item.deselect()
				}
			}
		}
	}

	_ensureSelection() {
		if (this.length && this.props.isSelectable) {
			if (this._selectedId && this.items[this._selectedId]) {
				this.items[this._selectedId]._select()
			} else {
				this._selectFirstItem()
			}
		}
	}

	_selectFirstItem() {
		const item = this.firstItem
		item && this.props.ensureSelection && item._select()
	}

	/**************************************************************/
	_isDirectionUp() {
		const [ t, b ] = this.extremeItems
		const centerIdx = this.buffer.indexOf(b.bufferId) - this.buffer.indexOf(t.bufferId)
		return centerIdx > this.buffer.length / 2
	}

	_canBuffer(up) {
		return up
			? this.buffer[0] !== this.idxToId[0]
			: this.buffer[this.buffer.length - 1] !== this.idxToId[this.itemData.length - 1]
	}

	_adjustPageSize() {
		const minPageSize = 20
		if (this.props.pageSize < minPageSize) {
			this.props.pageSize = minPageSize
		}
	}

	_bufferItem(id, up) {
		const itemComponent = this.items[id] || this.renderItem(this.filteredItemData[this.idToIdx[id]])
		this.isItemDisabled(id) && this.disableItem(id, true)
		itemComponent.bufferId = id
		if (up) {
			this.itemContainer.prepend(itemComponent)
			this.buffer.unshift(id)
		} else {
			this.itemContainer.append(itemComponent)
			this.buffer.push(id)
		}
		this.items[id] = itemComponent
	}

	_unbufferItem(id) {
		if (this.items[id]) {
			this.items[id].remove()
			this.buffer.splice(this.buffer.indexOf[id], 1)
		}
	}

	_fillBuffer() {
		if (this.props.pageSize) {
			for (let idx=0; idx<this.props.pageSize; idx++) {
				if (idx >= this.filteredItemData.length) {
					break
				}
				this._bufferItem(this.idxToId[idx], false)
			}
		} else {
			for (const idx in this.filteredItemData) {
				this._bufferItem(this.idxToId[idx], false)
			}
		}
	}

	_scrollBuffer(up) {
		const direction = up ? -1 : 1
		const bufferIdx = up ? 0 : this.buffer.length - 1
		const pageSize  = Math.round(this.props.pageSize / 2)

		let idx = this.idToIdx[this.buffer[bufferIdx]]
		for (let n=0; n<pageSize; n++) {
			idx += direction
			if (!this.filteredItemData[idx]) {
				break
			}
			const id = this.idxToId[idx]

			this._bufferItem(id, up)
		}

		idx = this.buffer[up ? this.buffer.length - 1 : 0]
		for (let n=0; n<pageSize; n++) {
			idx += direction
			this._unbufferItem(this.idxToId[idx])
		}
	}

	_buffer(up) {
		if (this.filteredItemData) {
			if (this.buffer.length) {
				this._scrollBuffer(up)
			} else {
				this._fillBuffer()
			}
			this.onBuffer()
			this.props.onBuffer && this.props.onBuffer()
		}
	}

	_unbuffer() {
		while (this.buffer.length) {
			this._unbufferItem(this.buffer[0])
		}
	}

	_rebuffer() {
		this._unbuffer()
		this._buffer()
	}

	/**************************************************************/

	get length() {
		return this.itemData.length
	}

	get firstItem() {
		return this.items[this.buffer[0]]
	}

	get selectedItem() {
		return this.items[this._selectedId]
	}

	set selectedItem(itemId) {
		this.items[itemId]._select()
	}

	get extremeItems() {
		const scrollTop    = this.element.scrollTop
		const scrollBottom = scrollTop + this.element.clientHeight;

		let topVisibleItem    = null
		let bottomVisibleItem = null
		let minTopDistance    = Number.POSITIVE_INFINITY
		let minBottomDistance = Number.POSITIVE_INFINITY

		for (const itemId in this.items) {
			const item             = this.items[itemId]
			if (item) {
				const itemOffsetTop    = item.element.offsetTop
				const itemOffsetBottom = itemOffsetTop + item.element.clientHeight

				const topDistance = Math.abs(itemOffsetTop - scrollTop)
				if (topDistance < minTopDistance) {
					minTopDistance = topDistance
					topVisibleItem = item
				}

				const bottomDistance = Math.abs(itemOffsetBottom - scrollBottom)
				if (bottomDistance < minBottomDistance) {

					minBottomDistance = bottomDistance
					bottomVisibleItem = item
				}
			}
		}

		return [ topVisibleItem, bottomVisibleItem ]
	}

	/**************************************************************/

	onRoute() {
		this.props.ensureSelection && this._ensureSelection()
	}

	onRender() {
		if (this.props.pageSize) {
			this._on('scroll', this._onScroll)
		}
	}

	renderItem(item) {
		let renderer = this.itemRenderer
		if ($.isString(this.itemRenderer)) {
			renderer = $[this.itemRenderer]
		}
		return renderer({
			data: item,
			name: this.props.name
		})
	}

	/*****************************************************************/
	addItem(item, id=null) {
		id = id || $.String.random(5)

		this.itemData.push(item)
		this.filteredItemData.push(item)
		this.idxToId[this.filteredItemData.length - 1] = id
		this.idToIdx[id] = this.filteredItemData.length - 1
		this.items[id]   = null

		if (this.props.pageSize) {
			if (this.props.pageSize * 2 > this.buffer.length) {
				this._bufferItem(id, false)
			}
			if (this.buffer.length === 1) {
				this._adjustPageSize()
			}
		} else {
			this._bufferItem(id, false)
		}
		return id
	}

	removeItem(id) {
		this._unbufferItem(id)
		const idx  = this.idToIdx[id]
		const data = this.filteredItemData[idx]
		this.itemData.splice(this.itemData.indexOf(data), 1)
		this.filteredItemData.splice(idx, 1)
		delete this.idToIdx[id]
		delete this.idxToId[idx]
	}

	disableItem(id, disabled) {
		if (this.items[id]) {
			this.items[id].toggleCssClass('disabled', disabled)
		}
		if (disabled) {
			this.disabledItems.add(id)
		} else {
			this.disabledItems.delete(id)
		}
	}

	isItemDisabled(id) {
		return this.disabledItems.has(id)
	}

	clearItems() {
		this._unbuffer()
		this.items            = {}
		this.idToIdx          = {}
		this.idxToId          = {}
		this.itemData         = []
		this.filteredItemData = []
		this.buffer           = []
	}

	sort(f) {
		// TODO: implement
	}

	fiter(f) {
		// TODO: implement
	}
	/*****************************************************************/

	scrollToBottom() { this.element.scrollTop = this.element.scrollHeight }
	scrollToTop()    { this.element.scrollTop = 0 }

	onBuffer() {}

	render() {
		this.itemContainer = $.ul(this.children)
		return this.itemContainer
	}
}

$.define(List, import.meta.url)
