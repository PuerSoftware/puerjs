import $ from '../../index.js'


class Modal extends $.Component {
	constructor(... args) {
		super(... args)
		this.props.default('canClose', true)
	}

	hide() {
		const isHidden = this.isHidden
		super.hide()
		if (!isHidden) {
			console.log('modal hide')
			this.trigger($.Event.MODAL_HIDE)
		}
	}

	show() {
		const isShown = !this.isHidden
		super.show()
		if (!isShown) {
			console.log('modal show')
			this.trigger($.Event.MODAL_SHOW)
		}
	}

	render() {
		const closeBtn = this.props.canClose
			? $.button('close-btn', {text: 'x', onclick: this.hide})
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
