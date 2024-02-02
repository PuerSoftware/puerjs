// data = {
// 	tagName: '',
// 	attr1: '',
// 	attr2: '',
// 	children: [
// 		...
// 	]
// }

class Svg {
	constructor(data) { this._data = data }

	/******************************************************************/

	static _elementToData(element) {
		const data = {
			tagName  : element.tagName,
			children : Array.from(element.children).map(child => Svg.elementToData(child))
		}
		for (const attr of element.attributes) {
			data[attr.name] = attr.value
		}
		return data
	}

	static _svgStringToElement(svgString) {
		const parser = new DOMParser()
		return parser.parseFromString(svgString, 'image/svg+xml').documentElement
	}

	static _dataToSvgString(data) {
		const { tagName, children = [], ...attrs } = data
		const attrStr     = Object.entries(attrs).map(([key, value]) => `${key}="${value}"`).join(' ')
		const childrenStr = children.map(child => this.dataToElement(child)).join('')
		return `<${tagName} ${attrStr}>${childrenStr}</${tagName}>`
	}

	/******************************************************************/

	get data()     { return this._data }
	set data(data) { this._data = data }

	get base64()       { return btoa(this.code()) }
	set base64(base64) { this.code = atob(base64) }

	get code() { return Svg._dataToSvgString(this._data) }
	set code(svgString) {
		const element = Svg._svgStringToElement(svgString)
		this.data     = Svg.elementToData(element)
	}
}