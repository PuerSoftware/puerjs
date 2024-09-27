import $ from '../../index.js'


export default class Modals extends $.Component {
	constructor(... args) {
		super(... args)
		this.props.default('canClose', true)
		this.modals = {}

		this.on($.Event.MODAL_HIDE, this._onModalHide)
	}

	_onModalHide() {
		$.Router.removeQueryValues('modal')
	}

	onRoute() {
		const modalName = $.Router.getQueryValue('modal')
		for (let m in this.modals) {
			this.modals[m].hide()
		}
		if (modalName) {
			this.modals[modalName] && this.modals[modalName].show()
		}
	}

	onInit() {
		for (const child of this.children) {
			this.modals[child.name] = child
		}
	}

	render() {
		return $.Box([... this.children])
	}
}

$.define(Modals, import.meta.url)
