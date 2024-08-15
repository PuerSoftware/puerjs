export default class Collection {
	constructor(items) {
		this._items = items

		this.callProxy = new Proxy(target, {
			apply: function (target, context, args) {
				for (const item of target._items) {
					item.apply(context, args)
				}
			}
		})

		this.getProxy = new Proxy(this, {
			get(target, prop) {
				if (target[prop]) {
					if (typeof target[prop] === 'function') {
						return target[prop].bind(target)
					} else {
						return target[prop]
					}
				} else if (typeof prop == 'string') {
					if (this._items.length) {
						if (typeof this._items[0][prop] === 'function') {
							return target.callProxy
						}
					}
				}
				return proxy
			}
		})
	}
}