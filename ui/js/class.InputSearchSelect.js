import $             from '../../index.js'
import FormInput     from './class.FormInput.js'
import DataListMixin from '../../library/class.DataListMixin.js'


class InputSearchSelect extends FormInput {
	constructor(props, children) {
		super(props, children)
		this.props.default('tagName',      'input')
		this.props.default('type',         'hidden')
		this.props.default('renderTag',    this.renderTag)
		this.props.default('itemRenderer', 'ListItem')

		this._tags     = null
		this._search   = null
		this._menu     = null
		this._menuName = $.String.random(6)
		this._valueSet = new Set()

		this.on($.Event.APP_CLICK,        this._onAppClick)
		this.on($.Event.APP_ESCAPE,       this._onAppEscape)
		this.on($.Event.LIST_ITEM_SELECT, this._onSelect, this._menuName)
		this.on($.Event.TAG_REMOVE,       this._onUnselect)
	}

	_onAppClick(event) {
		const targetElement = event.detail.event.target

		if (!this.element.contains(targetElement)) {
			this._menu.hide()
		}
	}

	_onAppEscape(event) { this._menu.hide() }

	_onClick() {
		this._menu.toggle()
		if (this._menu.isHidden) {
			this._search.reset()
		}
	}

	_updateValue(value, func='add') {
		this._valueSet[func](value)
		this.value = Array.from(this._valueSet).join(',')
	}

	_onSelect(e) {
		if (!this._valueSet.has(e.detail.data.value)) {
			this._tags.append(this.props.renderTag(e.detail.data))
			this._updateValue(e.detail.data.value, 'add')
		}
	}

	_onUnselect(e) {
		const tag = e.detail.targetComponent
		this._updateValue(tag.data.value, 'delete')
	}

	onInit() {
		super.onInit()
	}

	renderTag(item) {
		return $.Tag({label: item.dataId, data: item})
	}

	render() {
		const searchName = $.String.random(6)
		this._tags = $.div('tags')
		this._search = $.Search({
			name    : searchName,
			onclick : this._onClick
		})
		this._menu = $.List('menu hidden', {
			name            : this._menuName,
			searchName      : this.searchName,
			dataSource      : this.props.dataSource,
			itemRenderer    : this.props.itemRenderer,
			mixins          : [DataListMixin],
			isSelectable    : false
		})
		this.children.push(this._tags)
		this.children.push($.br())
		this.children.push(this._search)
		this.children.push(this._menu)
		return super.render()
	}
}

$.define(InputSearchSelect, import.meta.url)
export default InputSearchSelect