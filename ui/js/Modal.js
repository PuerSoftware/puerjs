import $ from '../../index.js'


class Modal extends $.Component {
	constructor(... args) {
		super(... args)
		this.props.default('canClose', true)
	}

	_hide(e) {
		this.hide()
	}

	render() {
		const closeBtn = this.props.canClose
			? $.button('close-btn', {text: 'x', onclick: this._hide})
			: $.div('hidden')

		return $.div('hidden', [
			$.Box('body', [
				$.div('content', this.children),
				closeBtn
			])
		])
	}
}

$.define(Modal, import.meta.url)
export default Modal
