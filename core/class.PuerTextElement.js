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

	__update() {
		this.props.touch()
	}

	/*********************** PRIVATE ***********************/

	_onPropChange(prop) {
		this.element.nodeValue = this.props.dereference('text')
	}

	_renderElement() {
		return document.createTextNode(this.props.dereference('text'))
	}

}

export default PuerTextElement