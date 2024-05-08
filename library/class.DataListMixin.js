import $ from '../core/class.Puer.js'

import DataOwnerMixin from './class.DataOwnerMixin.js'


export default class DataListMixin {

	static init(component, data) {
		component.mixin(DataOwnerMixin, data)
		component.props.default('searchName', null)   // if not set search is inactive
		component.props.default('queryKey', 'dataId') // key from url query to select item

		component.isInitialized     = false
		component._searchQuery      = ''
		component._filterMap        = null
		component._sortMap          = null

		component.on($.Event.SEARCH, component._onSearch, component.props.searchName)
	}

	_ensureFilterSelection() {
		if (this._selectedId) {
			if (this._filterMap[this._selectedId]) {
				this.items[this._selectedId]._select()
			} else {
				this._selectFirstItem()
			}
		}
	}

	_onSearch(event) {
		this._searchQuery = event.detail.value
		this._dataSet.search(this._searchQuery)
	}

	_handleQueryKey() {
		const dataId = $.isFunction(this.props.queryKey)
			? this.props.queryKey(this)
			: $.Router.getQueryValue(this.props.queryKey)  
		if (dataId) {
			this.items[parseInt(dataId)]._triggerSelect()
		}
	}

	/**************************************************************/

	_onDataChange(items) {
		
		this._ensureSelection()
		this.removeCssClass('loader')
		this.isInitialized = true
		this._handleQueryKey()
	}

	_onDataItemAdd(item) {
		if (!this.items[item.dataId]) {
			const itemComponent = this.renderItem(item)
			this.itemContainer.append(itemComponent)
			this.items[item.dataId] = itemComponent
			this._handleQueryKey()
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
		const hasSearch    = Boolean(this.props.searchName)
		this._filterMap    = filterMap

		for (const itemId in this.items) {
			if (filterMap.hasOwnProperty(itemId)) {
				this.items[itemId].toggle(filterMap[itemId])
			}
			if (hasSearch) {
				if (this._searchQuery) {
					this.items[itemId].highlight(
						this._searchQuery.toLowerCase().trim().split(/\s+/g).filter(s => s !== '')
					)
				} else {
					this.items[itemId].unhighlight()
				}
			}
		}
		
		this._ensureFilterSelection()
	}

	_onDataSort(sortMap) {
		this._sortMap = sortMap
		// console.log('onStateSortMapChange', sortMap)
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

	onActivate() {
		this._dataSet.refresh()
	}

	onRoute(routes) {
		if (this.isActive && this.isInitialized) {
			this._handleQueryKey()
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

	get firstItem() {
		let item = Object.values(this.items).filter((item, _) => !item.isHidden)[0]
		if (this._searchQuery) {
			if (this._filterMap) {
				item = this.items[
					Object
						.keys(this._filterMap)
						.find(id => this._filterMap[id])
				]
			}
		}
		return item
	}
}

