export default class DataBase {
	static DB_NAME = 'DataSource'

	static connect(name, onConnect, onError) {
		new DataBase(name, onConnect, onError)
	}

	constructor(name, onConnect, onError) {
		this.name = name
		this.isNewTable = false
		this._connect(onConnect, onError)
	}

	_connect(onConnect, onError) {
		const request = indexedDB.open(DataBase.DB_NAME, 1)

		request.onupgradeneeded = (event) => {
			this.db = event.target.result
			if (!this.db.objectStoreNames.contains(this.name)) {
				this.db.createObjectStore(this.name, {autoIncrement: true})
				this.isNewTable = true
			}
		}

		request.onsuccess = (event) => {
			this.db = event.target.result
			onConnect(this)
		}

		request.onerror = (event) => {
			console.error('IndexedDB error:', event.target.errorCode)
			onError(event.target.errorCode)
		}
	}

	_handleQuotaError() {
		alert('Storage quota exceeded. Please allow more storage space for this website in your browser settings.')
	}

	_executeTransaction(operation, items, onSuccess, onError, rights='readwrite') {
		const transaction = this.db.transaction([this.name], rights)
		const store = transaction.objectStore(this.name)
	
		let request
		switch (operation) {
			case 'add':
				request = store.add(items)
				break
			case 'addAll':
				items.forEach((item) => store.add(item))
				onSuccess && onSuccess() // call success after all items added
				break
			case 'delete':
				request = store.delete(items)
				break
			case 'read':
				const range = IDBKeyRange.bound(items.from, items.from + items.max - 1)
				request = store.getAll(range)
				break
			case 'count':
				request = store.count()
				break
			default:
				onError('Invalid operation')
		}
		if (request) {
			request.onsuccess = (request, event) => {
				onSuccess && onSuccess(request.result)
			}
			request.onerror = (request, event) => {
				if (onError) {
					onError(request.error)
				} else {
					throw request.error
				}
			}
		}
	}

	addItem(item, onSuccess, onError) {
		this._executeTransaction('add', item, onSuccess, onError)
	}

	addItems(items, onSuccess, onError) {
		this._executeTransaction('addAll', items, onSuccess, onError)
	}

	deleteItem(key, onSuccess, onError) {
		this._executeTransaction('delete', key, onSuccess, onError)
	}

	readItems(from, max, onSuccess, onError) {
		this._executeTransaction('read', {from, max}, onSuccess, onError, 'readonly')
	}

	getCount(onSuccess, onError) {
		this._executeTransaction('count', null, onSuccess, onError, 'readonly')
	}
}
