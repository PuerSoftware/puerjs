import $ from '../core/class.Puer.js'

import DataOwnerMixin from './class.DataOwnerMixin.js'


export default class DataListMixin {

	static init(component) {
		component.mixin(DataOwnerMixin)
		component.props.default('searchName', null) // if not set search is inactive

		component.isInitialized = false
		component._searchQuery  = ''
		component._filterMap    = null
		component._sortMap      = null

		component.on($.Event.SEARCH, component._onSearch)
	}


	_onSearch(event) {
		if (this.props.searchName === event.detail.searchName) {
			this._searchQuery = event.detail.value
			this._dataSet.search(this._searchQuery)
		}
	}

	/**************************************************************/

	onDataInit() {
		this._selectFirstItem()
		this.removeCssClass('loader')
		this.isInitialized = true
	}

	onDataAddItem(item) {
		const itemComponent = this.renderItem(item)
		this.itemContainer.append(itemComponent)
		this.items[item.dataId] = itemComponent
	}

	onDataRemoveItem(id) {
		this.items[id].remove()
		delete this.items[id]
	}

	onDataFilter(filterMap) {
		const hasSearch = Boolean(this.props.searchName)
		this._filterMap = filterMap
		for (const itemId in this.items) {
			if (filterMap.hasOwnProperty(itemId)) {
				this.items[itemId].toggle(filterMap[itemId])
			}
			if (hasSearch) {
				if (this._searchQuery) {
					this.items[itemId].highlight(
						this._searchQuery.toLowerCase().trim().split(/\s+/g)
					)
				} else {
					this.items[itemId].unhighlight()
				}
			}
		}
		this._selectFirstItem()
	}

	onDataSort(sortMap) {
		this._sortMap = sortMap
		console.log('onStateSortMapChange', sortMap)
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
				container.appendChild(element)
			}
		})
	}

	clear() {
		for (const id of Object.keys(this.items)) {
			this.onDataRemoveItem(id)
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
		let item = Object.values(this.items)[0]
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

