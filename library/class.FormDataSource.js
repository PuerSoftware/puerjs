import DataSource from './class.DataSource.js'


export default class FormDataSource extends DataSource {
	constructor(url) {
		super(url, false, false)
		this.isSaving = false
	}

	adaptItems(items) {
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

	submit(params, isSaving=true, headers=null) {
		params.isSaving = isSaving
		this.isSaving   = isSaving
		this.load('POST', params, headers)
	}
}

