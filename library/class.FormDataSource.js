import DataSource from './class.DataSource.js'


export default class FormDataSource extends DataSource {
	constructor(name, url) {
		super(name, url, false, false)
		this.isSaving      = false
		this.doClearOnSave = false
	}

	adaptItems(items, headers) {
		// items.error is sent from back-end
		const isSaved      = this.isSaving && !items.error
		const adaptedItems = []
		this.trigger($.Event.FORM_RESPONSE, {
			formName : items.formName,
			error    : items.error,
			errors   : items.errors,
			isSaved  : isSaved
		})
		if (isSaved) {
			this.clear(() => {
				for (const field in items.data) {
					let value = this.doClearOnSave
						? null
						: items.data[field]
					adaptedItems.push({field: field, value: value})
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

	adaptSubmit(params, headers, isSaving) {
		return [params, headers, isSaving]
	}

	submit(params, isSaving, doClearOnSave, headers=null) {
		[params, headers]  = this.adaptSubmit(params, headers, isSaving)
		headers            = headers || {}
		headers.isSaving   = isSaving ? 1 : 0
		this.isSaving      = isSaving
		this.doClearOnSave = doClearOnSave
		this.load('POST', params, headers)
	}
}

