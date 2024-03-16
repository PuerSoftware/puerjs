import $ from '../../index.js'


class Modal extends $.Component {

	render() {
		return $.div('hidden', [
			$.Box('body', [
				$.div('content', this.children),
				$.button('close-btn', {text: 'x', onclick: this.hide})
			])
		])
	}
}

$.define(Modal, import.meta.url)
export default Modal
