export default class Constants {
	static $($) { window.$ = $ }

	static define(name, data) {
		if (Constants.hasOwnProperty(name)) {
			throw `Can not redefine constant "${name}"`
		}

		const constant = $.isPrimitive(data)
			? data
			: new Constants(data)

		Object.defineProperty(Constants, name, {
			get: function() {
				return constant
			}
		})
		return constant
	}

	constructor(data) {
		this._data = data // { fieldName : value } || { fieldName : {value: '', label: '' } }

		return new Proxy(this, {
			get: (target, prop) => {
				let result
				if (prop in target) {
					result = target[prop]
				} else if (prop[0] === '$') { // Returns full object
					prop = prop.slice(1)
					if (prop in target._data) {
						result = target._data[prop]
					}
				} else if (prop in target._data) {
					result = $.isObject(target._data[prop])
						? target._data[prop].value
						: target._data[prop]
				} else {
					throw `Unknown prop "${prop}"`
				}
				return result
			},
		})
	}

	getByValue(value) {
		for (const name in this._data) {
			if (this._data[name].value === value) {
				return this._data[name]
			}
		}
	}

	getByLabel(label) {
		for (const name in this._data) {
			if (this._data[name].label === label) {
				return this._data[name]
			}
		}
	}

	toArray(f=null) {
		const a = []
		if (f) {
			for (const key in this._data) {
				a.push(f(key, this._data[key]))
			}
		} else {
			for (const key in this._data) {
				a.push(Object.assign({key: key}, this._data[key]))
			}
		}
		return a
	}

	toObject(f=null) {
		let o = {}

		if (f) {
			for (const key in this._data) {
				o[key] = f(this._data[key])
			}
		} else {
			o = {... this._data}
		}
		return o
	}
}