import DataSource        from './class.DataSource.js'
import AsyncWaitingQueue from './class.AsyncWaitingQueue.js'


export default class FormDataSource extends DataSource {
	constructor(name, url) {
		super(name, url, false, false)
		this.isSaving      = false
		this.doClearOnSave = false
		this.queue         = new AsyncWaitingQueue()
	}

	_loadFromUrl(method=null, params=null, headers=null) {
		method = method || 'GET'
		this.queue.isDone(false)
		$.Request.request(
			this.url,
			method,
			params,
			headers,
			(items) => {
				this.isCacheable && this.db.clear()
				this.addItems(items)
				this._onLoad()
				this.queue.isDone(true)
			}
		)
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
		if (!this.queue.isDone()) {
			this.queue.enqueue(this.submit, this, [params, isSaving, doClearOnSave, headers])
		} else {
			[params, headers]  = this.adaptSubmit(params, headers, isSaving)
			headers            = headers || {}
			headers.isSaving   = isSaving ? 1 : 0
			this.isSaving      = isSaving
			this.doClearOnSave = doClearOnSave
			this.load('POST', params, headers)
		}
	}
}

