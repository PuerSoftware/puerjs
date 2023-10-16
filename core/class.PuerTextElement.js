import PuerHtmlElement from './class.PuerHtmlElement.js'
import PuerProps       from './class.PuerProps.js'


class PuerTextElement extends PuerHtmlElement {

	constructor(text) {
		super(new PuerProps({'text': text}), [])
		this.tagName = 'text'
	}

	/********************** FRAMEWORK **********************/

	__render() {
		this.root = this
		this.element = this._renderElement()
		return this.element
	}

	__update() {
		this._onPropChange('text')
	}

	/*********************** PRIVATE ***********************/

	_onPropChange(prop) {
		this.element.nodeValue = this._dereference(this.props.text)
	}

	_renderElement() {
		return document.createTextNode(this.props.text)
	}

}

export default PuerTextElement