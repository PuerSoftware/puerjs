import $ from '../../index.js'


export default class Menu extends $.Component {
	static menus = []


	constructor(... args) {
		super(... args)
		this.props.require('items') // {label: '', callback: () => {}}
		this.props.require('data')
		this._menu = null
		Menu.menus.push(this)

		this.on($.Event.APP_CLICK, this.hideMenu)
		this.on($.Event.APP_ESCAPE, this.hideMenu)
	}

	_onClick(e) {
		e.stopPropagation()
		if (this._menu.isHidden) {
			this.showMenu()
		} else {
			this.hideMenu()
		}
	}

	hideMenu() {
		this._menu.hide()
	}

	showMenu() {
		for (const menu of Menu.menus) {
			menu.hideMenu()	
		}
		this._menu.show()
	}

	render() {
		const items = []

		for (const item of this.props.items) {
			const itemComponent = $.Box(item.cssClass,{
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
			this._menu = $.Rows('popup hidden', items)
		])
	}
}

$.define(Menu, import.meta.url)
