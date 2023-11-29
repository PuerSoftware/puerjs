import PuerHtmlElement from './class.PuerHtmlElement.js'
import PuerProps       from './class.PuerProps.js'


class PuerTextElement extends PuerHtmlElement {

	constructor(text) {
		super({'text': text}, [])
		this.tagName = 'text'
	}

	/********************** FRAMEWORK **********************/

	__render() {
		this.root = this
		this.element = this._renderElement()
		return this.element
	}

	/*********************** PRIVATE ***********************/

	_onPropChange(prop) {
		// console.log('onPropChange', this.className, prop)
		this.element.nodeValue = document.createTextNode(Puer.dereference(this.props['text']))
	}

	_renderElement() {
		return document.createTextNode(Puer.dereference(this.props['text']))
	}

}

export default PuerTextElement