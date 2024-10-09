import $ from '../../index.js'


export default class Modals extends $.Component {
	constructor(... args) {
		super(... args)
		this.modals = {}
	}

	showModal(name) {
		for (let m in this.modals) {
			this.modals[m].hide()
		}
		name && this.modals[name] && this.modals[name].show()
	}

	onRoute() {
		this.showModal($.Router.getQueryValue('modal'))
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
