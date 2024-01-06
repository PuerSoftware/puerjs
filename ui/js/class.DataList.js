import $              from '../../index.js'
import DataListItem   from './class.DataListItem.js'
import DataOwnerMixin from '../../library/class.DataOwnerMixin.js'


export default class DataList extends $.Component {
	constructor(props, children) {
		super(props, children)
		this.props.require('name')
		this.props.default('searchName', null) // if not set search is inactive

		this.items         = {}  // { dataStoreId : itemComponent } for easy lookup when applying sort and filter
		this.itemRenderer  = 'DataListItem'
		// this.itemProps     = {}
		this.itemContainer = this // may be set manually in child class
		this.isInitialized = false
		this.selectedId    = null

		this.on($.Event.LIST_ITEM_SELECT, this._onItemSelect)
		this.on($.Event.PROVOKE_EVENT,    this._onProvokeEvent)
		this.on($.Event.SEARCH,           this._onSearch)

		this._searchQuery = ''
		this._filterMap   = null
		this._sortMap     = null
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

	_onProvokeEvent(event) {
		if (event.detail.name === this.props.name) {
			if (event.detail.type === $.Event.LIST_ITEM_SELECT) {
				if (this._selectedId) {
					this.items[this._selectedId]._select()
				}
			}
		}
	}

/*
	_isSelectedDisplayed() {
		if (this._selectedId) {
			if (this._filterMap) {
				return this._filterMap[this._selectedId]
			} else {
				return true
			}
		}
		return false
	}
*/

	_onSearch(event) {
		if (this.props.searchName === event.detail.searchName) {
			this._searchQuery = event.detail.value
			this._dataSet.search(this._searchQuery)
		}
	}

	_selectFirstItem() {
		if (this.length) {
			if(this._selectedId && !this._searchQuery) {
				this.items[this._selectedId]._select()
			} else {
				let item = Object.values(this.items)[0]
				if (this._filterMap) {
					item = this.items[
						Object
							.keys(this._filterMap)
							.find(id => this._filterMap[id])
					]
				}
				item && item._select()
			}
		}
	}

	onDataInit() {
		if (!this.selectedId) {
			this._selectFirstItem()
		}
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

	/**************************************************************/
	set searchName(name) {
		this.props.searchName = name
	}

	get searchName() {
		return this.props.searchName
	}

	get length() {
		return Object.values(this.items).length
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

	onInit() {
		this.mixin(DataOwnerMixin)
	}

	onActivate() {
		this._selectFirstItem()
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

$.define(DataList, import.meta.url)