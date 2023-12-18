import $            from '../../index.js'
import DataListItem from './class.DataListItem.js'


export default class DataList extends $.Component {
	constructor(props, children) {
		super(props, children)
		this.props.require('name')
		this.props.require('dataSource')
		this.props.default('searchName', null) // if not set search is inactive

		this.items         = {}  // { dataStoreId : itemComponent } for easy lookup when applying sort and filter
		this.itemRenderer  = 'DataListItem'
		this.itemContainer = this // may be set manually in child class
		this.isInitialized = false
		this.selectedId    = null

		this.on($.Event.LIST_ITEM_SELECT, this._onItemSelect)
		this.on($.Event.SEARCH,           this._onSearch)

		this._dataSet     = null
		this._searchQuery = ''
	}

	_onItemSelect(event) {
		for (const itemId in this.items) {
			const item = this.items[itemId]
			if (event.detail.targetComponent === item) {
				item.select()
			} else {
				item.deselect()
			}
		}
	}

	_onSearch(event) {
		if (this.props.searchName === event.detail.searchName) {
			this._searchQuery = event.detail.value
			this._dataSet.search(this._searchQuery)
		}
	}

	_selectFirstItem() {
		for (const itemId in this.items) {
			if (!this.items[itemId].isHidden) {
				this.items[itemId]._select()
				break
			}
		}
	}

	_init() {
		if (!this.selectedId) {
			this._selectFirstItem()
		}
		this.removeCssClass('loader')
		this.isInitialized = true
	}

	_addItem(item) {
		const itemComponent = $[this.itemRenderer]({ data: item, name: this.props.name })
		this.itemContainer.append(itemComponent)
		this.items[item.dataId] = itemComponent
	}

	_removeItem(id) {
		this.items[id].remove()
		delete this.items[id]
	}

	_filter(filterMap) {
		for (const itemId in this.items) {
			if (filterMap.hasOwnProperty(itemId)) {
				this.items[itemId].toggle(filterMap[itemId])
			}
			this.items[itemId].highlight(this._searchQuery)
		}
		// this._selectFirstItem()
	}

	_sort(sortMap) {
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

	set dataSource(name) {
		this.props.dataSource = name
		this._dataSet = $.DataSource[this.props.dataSource].defineDataSet(this.props.name)

		this.clear()

		this._dataSet.onInit       = this._init.bind(this)
		this._dataSet.onSort       = this._sort.bind(this)
		this._dataSet.onFilter     = this._filter.bind(this)
		this._dataSet.onAddItem    = this._addItem.bind(this)
		this._dataSet.onRemoveItem = this._removeItem.bind(this)
	}

	set searchName(name) {
		this.props.searchName = name
	}

	get searchName() {
		return this.props.searchName
	}

	clear() {
		for (const id of Object.keys(this.items)) {
			this._removeItem(id)
		}
	}

	reset() {
		for (const itemId in this.items) {
			this.items[itemId].show()
		}
	}

	onInit() {
		this.dataSource = this.props.dataSource
	}

	render() {
		return $.ul(this.children)
	}
}

$.define(DataList, import.meta.url)