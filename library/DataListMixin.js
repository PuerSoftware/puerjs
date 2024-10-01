import $ from '../core/Puer.js'

import DataOwnerMixin from './DataOwnerMixin.js'


export default class DataListMixin {

	static init(component, data) {
		component.mixin(DataOwnerMixin, data)
		component.props.default('searchName',  null)    // if not set search is inactive
		component.props.default('queryKey',   'dataId') // key from url query to select item

		component.isInitialized = false
		component._searchQuery  = ''

		if (component.props.searchName) {
			component.on($.Event.SEARCH_CHANGE, component._onSearchChange, component.props.searchName)
			component.on($.Event.SEARCH_FOCUS,  component._onSearchFocus,  component.props.searchName)
			component.on($.Event.SEARCH_BLUR,   component._onSearchBlur,   component.props.searchName)
		}
	}

	_addItem(item) {
		this.addItem(item, item.dataId)
	}

	_applyFilter(filterMap) {
		this._filterMap       = filterMap
		this.filteredItemData = []
		this.idxToId          = {}
		this.idToIdx          = {}
		for (const idx in this.itemData) {
			const dataId = this.itemData[idx].dataId
			if (this._filterMap[dataId]) {
				this.filteredItemData.push(this.itemData[idx])
				this.idxToId[this.filteredItemData.length - 1] = dataId
				this.idToIdx[dataId] = this.filteredItemData.length - 1
			}
		}
		this._rebuffer()
	}

	_applySearch() {
		for (const itemId of this.buffer) {
			if (this._searchQuery) {
				const search = this._searchQuery.toLowerCase().trim().split(/\s+/g).filter(s => s !== '')
				this.items[itemId].highlight(search)
			} else {
				this.items[itemId].unhighlight()
			}
		}
	}

	_hasFilterChanges(filterMap) {
		if (Object.keys(filterMap).length) {
			if (this._filterMap) {
				if (Object.keys(filterMap).length !== Object.keys(this._filterMap)) {
					return true
				}
				for (const id in this._filterMap) {
					if (this._filterMap[id] !== filterMap[id]) {
						return true
					}
				}
			} else {
				for (const id of this.buffer) {
					if (!filterMap[id]) {
						return true
					}
				}
			}
		}
		return false
	}

	_ensureFilterSelection() {
		if (this.props.isSelectable && this._selectedId) {
			if (this._filterMap) {
				if (this._filterMap[this._selectedId]) {
					this.items[this._selectedId]._select()
				} else {
					this._selectFirstItem()
				}
			} else if (this.items[this._selectedId]) {
				this.items[this._selectedId]._select()
			} else {
				this._selectFirstItem()
			}
		}
	}

	_handleQueryKey() {
		const dataId = Number($.isFunction(this.props.queryKey)
			? this.props.queryKey(this)
			: $.Router.getQueryValue(this.props.queryKey))
		if (dataId) {
			this.items[dataId]._select()
			this._selectedId = dataId
		}
	}

	_onSearchChange(e) {
		this._searchQuery = e.detail.value
		this._dataSet.search(this._searchQuery)
	}

	_onSearchFocus(e) {
		this.addCssClass('has-search')
	}

	_onSearchBlur(e) {
		this.removeCssClass('has-search')
	}
	/**************************************************************/

	_onDataLoad(items) {
		for (const item of items) {
			this._addItem(item)
		}

		this._ensureSelection()
		this.removeCssClass('loader')
		if (!this.isInitialized) {
			this.onDataInit()
		}
		this.isInitialized = true
		this._handleQueryKey()
	}

	_onDataItemAdd(item) {
		if (!this.items[item.dataId]) {
			this._addItem(item)
			this._handleQueryKey()
			!this._selectedId && this._ensureSelection()
		}
	}

	_onDataItemRemove(dataId) {
		this.items[dataId].remove()
		delete this.items[dataId]
	}

	_onDataItemChange(item) {
		const oldItemComponent = this.items[item.dataId]
		if (oldItemComponent) {
			const itemComponent    = this.renderItem(item)
			const selected         = this._selectedId == item.dataId
			oldItemComponent.replace(itemComponent)
			this.items[item.dataId] = itemComponent
			selected && itemComponent._select()
		}
	}

	_onDataClear() {
		this.clearItems && this.clearItems()
	}

	_onDataFilter(filterMap) {
		if (this._hasFilterChanges(filterMap)) {
			this._applyFilter(filterMap)
		}
		if (Boolean(this.props.searchName)) {
			this._applySearch()
		}

		this._ensureFilterSelection()
	}

	_onDataSort(sortMap) {
		this._sortMap = sortMap
		// TODO: make it sort not elements, but items
		const elements = []
		for (const itemId in this.items) {
			elements.push(this.items[itemId].element)
		}

		let newOrder = new Array(elements.length)

		for (const [oldIndex, newIndex] of Object.entries(sortMap)) {
			newOrder[newIndex] = elements[oldIndex]
		}

		let currentIdx = 0
		elements.forEach(element => {
			while (newOrder[currentIdx]) {
				currentIdx ++
			}
			if (!sortMap.hasOwnProperty(elements.indexOf(element))) {
				newOrder[currentIdx] = element
			}
		})

		// Appending elements in the new order
		newOrder.forEach(element => {
			if (element) {
				this.element.appendChild(element)
			}
		})
	}

	onDataInit() {} // items are available

	onRoute() {
		if (this.isActive && this.isInitialized) {
			this._handleQueryKey()
			this._ensureSelection()
			// Results in bug - item double selected when handling query key
		}
	}

	clear() {
		for (const id of Object.keys(this.items)) {
			this.onDataItemRemove(id)
		}
	}

	reset() {
		for (const itemId in this.items) {
			this.items[itemId].show()
		}
	}

	/**************************************************************/

	set searchName(name) {
		this.props.searchName = name
	}

	get searchName() {
		return this.props.searchName
	}

	get selectedItem() {
		return this.items[this._selectedId]
	}

	set selectedItem(dataId) {
		if (!this.items[dataId]) {
			this._selectedId = dataId
		} else {
			this.items[dataId]._select()
		}
	}

}
