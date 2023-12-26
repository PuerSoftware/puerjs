import DataSource from './class.DataSource.js'


export default class FormDataSource extends DataSource {
	constructor(url) {
		super(url, true, false)
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

	submit(params, headers) {
		params.submit = true
		this.load('POST', params, headers)
	}

	validate(params, headers) {
		this.load('POST', params, headers)
	}
}

