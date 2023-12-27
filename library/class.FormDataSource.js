import DataSource from './class.DataSource.js'


export default class FormDataSource extends DataSource {
	constructor(url) {
		super(url, false, false)
	}

	adaptItems(items) {
		// items.error is sent from back-end
		this.trigger($.Event.FORM_ERROR, {error: items.error, errors: items.errors})

		const adaptedItems = []
		for (const field in items.data) {
			adaptedItems.push({field: field, value: items.data[field]})
		}
		return adaptedItems
	}

	adaptItem(item) {
		return item
	}

	submit(params, save=true, headers=null) {
		params.save = save
		this.load('POST', params, headers)
	}
}

