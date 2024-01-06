import DataSource from './class.DataSource.js'


export default class FormDataSource extends DataSource {
	constructor(name, url) {
		super(name, url, false, false)
		this.isSaving = false
	}

	adaptItems(items, headers) {
		// items.error is sent from back-end
		const isSaved      = this.isSaving && !items.error
		const adaptedItems = []
		this.trigger($.Event.FORM_RESPONSE, {
			error   : items.error,
			errors  : items.errors,
			isSaved : isSaved
		})
		if (isSaved) {
			this.clear(() => {
				for (const field in items.data) {
					adaptedItems.push({field: field, value: null})
				}
			})
			this.isSaving = false
		} else {
			for (const field in items.data) {
				adaptedItems.push({field: field, value: items.data[field]})
			}
		}
		return adaptedItems
	}

	adaptItem(item) {
		return item
	}

	submit(params, isSaving, headers=null) {
		headers          = headers || {}
		headers.isSaving = isSaving ? 1 : 0
		this.isSaving    = isSaving
		this.load('POST', params, headers)
	}
}

