import $ from '../../index.js'


class Modal extends $.Component {

	_hide(e) {
		this.props.hideCallback && this.props.hideCallback()
		this.hide()
	}

	render() {
		return $.div('hidden', [
			$.Box('body', [
				$.div('content', this.children),
				$.button('close-btn', {text: 'x', onclick: this._hide})
			])
		])
	}
}

$.define(Modal, import.meta.url)
export default Modal
