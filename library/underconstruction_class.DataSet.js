class DataSource {
	constructor(name, url, adapter) {
		this.name    = name
		this.url     = url
		this.adapter = adapter
	}
}


class DataSet {
	// Items must be array of objects
	constructor(items) {
		// this.items   = items || []
		this.clients = []
		this.sorting = {}
		this.filter  = {}
		this.map     = {
			sortedIndex: realIndex
		}
		this.hidden = []
	}

	_isValidItems(items) {
		for (const item of this.items) {
			if (!this._isValidItem(item)) {
				return false
			}
		}
		return true
	}

	_isValidItem(item) {
	}

	// Inserts in accord with current sorting and filter
	_insert(item) {
	}

	filter(f) {
		// ... filter
		// give each client a map of items to show, and those to hide
	}

	sort(name, asc=true) {
		// ... sort
		// give each client new sorting order map to avoid re-rendering
	}

	subscribe(client) {
		this.clients.push(client)
	}

	unsubscribe(client) {
		const index = this.clients.indexOf(client)
		if (index >= 0) {
			this.clients.splice(index, 1)
		}
	}

	addItems(items) {
		addItem()
	}

	addItem(item) {
		this.items._insert(item)
		for (const client of this.clients) {
			client.addItem(item)
		}
	}

}

// Must implement proper methods
class DataSetClient extends $.Component {
	constructor( ... args) {
		super( ... args)
		this.dataset = this.props.dataset
	}

	set pageSize(n) {}

	addItem() {}
	removeItem() {}
	hideItem() {}
	showItem() {}
	addItems() {}
	arrangeItems(map) {}

	set dataset(dataset) {
		if (dataset instanceof DataSet) {
			dataset.subscribe(this)
			this.props.dataset = dataset
		}
	}
	get dataset() { return this.props.dataset }
}

class DataList extends DataSetClient {
	// Renders all items, manages sorting and filtering 
	// Renders invisible items on the background when time available
}

class DataListItem extends DataList {
	set data(item) {
		this.state.id = item.id
	}

	render() {
		return $.div
	}
}


