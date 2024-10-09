import $ from '../../index.js'


class Modal extends $.Component {
	constructor(... args) {
		super(... args)
		this.props.default('canClose', true)
	}

	hide() {
		if (!this.isHidden && this.name) {
			const modalInQuery = $.Router.getQueryValue('modal')
			if (modalInQuery === this.name) {
				$.Router.removeQueryValues('modal')
			}
		}
		super.hide()
	}

	show() {
		if (this.isHidden && this.name) {
			$.Router.addQueryValues({ modal: this.name })
		}
		super.show()
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
