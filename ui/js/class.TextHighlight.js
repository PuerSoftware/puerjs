import $ from '../../index.js'


class TextHighlight extends $.Component {
	constructor(props, children) {
		super(props, children)
		this.props.default('text', '')  // Format: text text ```[class]text```

		this.separator = '```'
	}

	get text() {
		return this.props.text
	}

	set text(text) {
		this.props.text = text
	}

	onPropTextChange() {
		this.element.innerHTML = ''
		let a = this.props.text.split(this.separator)
		for (let n in a) {
			if (n % 2) {  // Odd
				const m = a[n].match(/^\[(.*?)\](.*)$/) || []
				if (m.length > 2) {
					this.append($.span(`high ${m[1]}`, {text: m[2]}))
				}
			} else {  // Even
				this.append($.span({text: a[n]}))
			}
		}
	}

}

$.define(TextHighlight, import.meta.url)
export default TextHighlight