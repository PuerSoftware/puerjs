export default class DataBase {
	static DB_NAME = 'DataSource'

	constructor(name, url, adapter) {
		this.name    = name
		this.db      = null
		this.init()
	}

	init() {
		const request = indexedDB.open(DataBase.DB_NAME, 1)

		request.onupgradeneeded = (event) => {
			this.db = event.target.result
			if (!this.db.objectStoreNames.contains(this.name)) {
				this.db.createObjectStore(this.name, { autoIncrement: true })
			}
		}

		request.onsuccess = (event) => {
			this.db = event.target.result
		}

		request.onerror = (event) => {
			console.error('IndexedDB error:', event.target.errorCode)
		}
	}

	_handleQuotaError() {
		alert('Storage quota exceeded. Please allow more storage space for this website in your browser settings.')
	}

	_executeTransaction(operation, items) {
		return new Promise((resolve, reject) => {
			const transaction = this.db.transaction([this.name], 'readwrite')
			const store = transaction.objectStore(this.name)
			let request

			switch (operation) {
				case 'add':
					request = store.add(items)
					break
				case 'addAll':
					items.forEach(item => store.add(item))
					break
				case 'delete':
					request = store.delete(items)
					break
				case 'read':
					const range = IDBKeyRange.bound(items.from, items.from + items.max - 1)
					request = store.getAll(range)
					break
				default:
					reject('Invalid operation')
					return
			}

			transaction.oncomplete = () => resolve(request.result)
			transaction.onerror    = () => reject(transaction.error)
		})
	}

	async addItem(item) {
		try {
			await this._executeTransaction('add', item)
		} catch (error) {
			if (error.name === 'QuotaExceededError') {
				this._handleQuotaError()
			} else {
				console.error(error)
			}
		}
	}

	async addItems(items) {
		try {
			await this._executeTransaction('addAll', items)
		} catch (error) {
			if (error.name === 'QuotaExceededError') {
				this._handleQuotaError()
			} else {
				console.error(error)
			}
		}
	}

	async deleteItem(key) {
		try {
			await this._executeTransaction('delete', key)
		} catch (error) {
			console.error(error)
		}
	}

	async readItems(from, max) {
		try {
			return await this._executeTransaction('read', { from, max })
		} catch (error) {
			console.error(error)
		}
	}
}
