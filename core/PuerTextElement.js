import $               from './Puer.js'
import PuerHtmlElement from './PuerHtmlElement.js'
import PuerProps       from './PuerProps.js'


class PuerTextElement extends PuerHtmlElement {

	constructor(text) {
		super({text: text}, [])
		this.tagName      = 'text'
		this.highlightSet = []
		this.hasHighlight = null
	}

	/********************** FRAMEWORK **********************/

	__render() {
		this.root = this
		this.element = this._renderElement()
		return this.element
	}

	_applyProp() {}

	/*********************** PRIVATE ***********************/

	_onPropChange(prop) {
		if (!this.hasHighlight) {
			this.element.nodeValue = $.dereference(this.props.text)
		}
	}

	_renderElement() {
		return document.createTextNode($.dereference(this.props.text))
	}

	highlight(words) {
		this.unhighlight()
		this.hasHighlight = true
		if (words && words.length) {
			const texts = $.String.splitCaseSafe(this.element.nodeValue, words)
			if (texts.length > 1) {
				this.highlightSet = []
				for (const text of texts) {
					if (text.isMatch) {
						const highlightElement     = document.createElement('span')
						highlightElement.className = 'highlight'
						highlightElement.innerText = text.value
						this.highlightSet.push(highlightElement)
						this.element.parentNode.insertBefore(highlightElement, this.element)
					} else {
						const textNode = document.createTextNode(text.value)
						this.highlightSet.push(textNode)
						this.element.parentNode.insertBefore(textNode, this.element)
					}
				}
				this.element.remove()
			}
		}
	}

	unhighlight() {
		if (this.highlightSet.length > 0) {
			this.highlightSet[0].parentNode.insertBefore(this.element, this.highlightSet[0])
			for (const el of this.highlightSet) {
				el.remove()
			}
			this.highlightSet = []
		}
		this.hasHighlight = false
	}
}

export default PuerTextElement
