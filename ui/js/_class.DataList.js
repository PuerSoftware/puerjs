import $            from '../../index.js'
import DataListItem from './class.DataListItem.js'


export default class DataList extends $.Component {
	constructor(props, children) {
		super(props, children)
		this.props.require('dataSet')

		this._dataSet = null

		this.items         = {}  // { dataStoreId : itemComponent } for easy lookup when applying sort and filter
		this.itemRenderer  = 'DataListItem'
		this.listComponent = this // may be set manually in child class

		this.state.itemListId = null
		this.state.filterMap  = null
		this.state.sortMap    = null

		this.on($.Event.LIST_ITEM_SELECT, this.onItemSelect)
		this.on($.Event.DATASET_AVAILABLE, (event) => {
			if (event.detail.name === this.props.dataSet) {
				this.dataSet = this.props.dataSet
				this.onDataSetAvailable(event.detail)
			}
		})
	}

	_addItem(item) {
		const itemComponent = $[this.itemRenderer]({data: item})
		this.listComponent.append(itemComponent)
		this.items[item.dataId] = itemComponent
	}

	_addItems(items) {
		for (const item of items) {
			this._addItem(item)
		}
	}

	_removeItem(id) {
		this.items[id].remove()
		delete this.items[id]
	}

	_removeItems(ids) {
		ids = ids || Object.keys(this.items)
		for (const id of ids) {
			this._removeItem(id)
		}
	}

	/**************************************************************/

	set dataSet(name) {
		this._dataSet = $.DataSet[this.props.dataSet]

		this.state.setById( 'itemListId', this.dataSet.itemListId  )
		this.state.setById( 'filterMap',  this.dataSet.filterMapId )
		this.state.setById( 'sortMap',    this.dataSet.sortMapId   )

		this._removeItems()
		const items = $.DataStore.get(this._dataSet.getIds())
		this._addItems(items)
	}

	get dataSet() {
		return this._dataSet
	}

	onStateItemListIdChange(ids) {
		console.log('onStateItemListIdChange', ids)
		const deleted = Object.assign({}, this.items)

		for (const id of ids) {
			if (this.items.hasOwnProperty(id)) {
				delete deleted[id]
			} else {
				this._addItem($.DataStore.get(id))
			}
		}

		for (const id in deleted) {
			this._removeItem(id)
		}
	}

	onStateFilterMapChange(filterMap) {
		console.log('onStateFilterMapChange', filterMap)

		for (const itemId in this.items) {
			if (filterMap.hasOwnProperty(itemId)) {
				this.items[itemId].toggle(filterMap[itemId])
			}
		}
	}

	onStateSortMapChange(sortMap) {
		console.log('onStateSortMapChange', sortMap)

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

	resetFilter() {
		for (const itemId in this.items) {
			this.items[itemId].show()
		}
	}

	onItemSelect(event) {
		for (const itemId in this.items) {
			const item = this.items[itemId]
			if (event.detail.targetComponent === item) {
				item.select()
			} else {
				item.deselect()
			}
		}
	}

	onDataSetAvailable(dataSet) {}

	render() {
		return $.ul(this.children)
	}
}

$.define(DataList)