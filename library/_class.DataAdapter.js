export  default class DataAdapter {
	static define(name, adaptData, adaptRow) {
		const adapter = new DataAdapter(name, adaptData, adaptRow)
		Object.defineProperty(DataAdapter, name, {
			get: function() {
				return adapter
			}
		})
		return adapter
	}

	constructor(name, adaptData, adaptRow) {
		this.name = name

		if (adaptData) { this.adaptData = adaptData }
		if (adaptRow)  { this.adaptRow  = adaptRow  }
	}

	adapt(data) {
		data = this.adaptData(data)
		const adaptedData = []
		for (const row of data) {
			adaptedData.push(this.adaptRow(row))
		}
		return adaptedData
	}

	adaptData(data) { return data }
	adaptRow(row)   { return row  }
}