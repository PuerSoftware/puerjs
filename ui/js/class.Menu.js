import $ from '../../index.js'


export default class Menu extends $.Component {
	constructor(... args) {
		super(... args)
		this.props.require('items') // {label: '', callback: () => {}}
		this.props.require('data')

		this._menu = null
	}

	_onClick(e) {
		this._menu.toggleCssClass('hidden')
	}

	render() {
		const items = []

		for (const item of this.props.items) {
			const itemComponent = $.Box({
				text    : item.label,
				onclick : (e) => {
					item.callback(e, this.props.data)
				}
			})
			items.push(itemComponent)
		}

		return $.Box([
			$.Rows('user-menu', {onclick: this._onClick}, [
				$.div(),
				$.div(),
				$.div() 
			]),
			this._menu = $.Rows('hidden', items)
		])
	}
}

$.define(Menu, import.meta.url)
