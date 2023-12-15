import $, {PuerComponent} from '../../puer.js'

import DataListItem from 'class.DataListItem.js'


export default class DataList extends PuerComponent {
	constructor(props, children) {
		super(props, children)
		this.props.require('dataSet', this)

		this._dataSet = null

		this.items        = {}  // { dataStoreId : itemComponent } for easy lookup when applying sort and filter
		this.itemRenderer = DataListItem

		this.state.itemListId = null
		this.state.filterMap  = null
		this.state.sortMap    = null

		this.dataSet = this.props.dataSet
	}

	_addItem(item) {
		const itemComponent = $[this.itemRenderer]({data: item})
		this.element.append(itemComponent)
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

	_removeItems() {
		for (const itemId of Object.keys(this.items)) {
			this._removeItem(itemId)
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

		const element = []
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
}





