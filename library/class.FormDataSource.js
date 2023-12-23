import DataSource from './class.DataSource.js'


export default class FormDataSource extends DataSource {
	constructor(url) {
		super(url, false, false)
	}

	adaptItems(items) {
		// items.error is sent from back-end
		if (items.error) {
			$.Events.trigger($.Event.FORM_DATA_ERROR, items.error)
		}
		console.log('FormDataSource.adaptItems', JSON.stringify(items, null, 4))
		return items
	}

	adaptItem(item) {
		return item
	}

	submit(params) {
		params.submit = true
		this.load('POST', params)
	}

	validate(params) {
		this.load('POST', params)
	}
}

