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
		this.props.default('isSingular',   false)

		this._tags        = null
		this._search      = null
		this._menu        = null
		this._menuName    = $.String.random(6)
		this._valueSet    = new Set()
		this._valueToItem = {}
		this._valueToTag  = {}

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

	_onSelect(event) {
		this._select(event.detail.data, event.detail.targetComponent)
	}

	_onUnselect(e) {
		this._unselect(e.detail.targetComponent)
	}

	_getValuesString() {
		return Array.from(this._valueSet).join(',')
	}

	_select(data, item) {
		if (!this._valueSet.has(data.value)) {
			if (this.props.isSingular) {
				for (const itemId in this._menu.items) {
					this._menu.items[itemId].removeCssClass('disabled')
				}
				this._tags.removeChildren()
				this._valueSet = new Set()
			}

			item.addCssClass('disabled') // ListItem
			this._tags.append(this.props.renderTag(data))
			this._updateValue(data.value, 'add')
		}
	}

	_unselect(tag) {
		this._updateValue(tag.data.value, 'delete')
		this._valueToItemMap[tag.data.value].removeCssClass('disabled')
	}

	_updateValue(value, func='add') {
		this._valueSet[func](value)
		this.value = this._getValuesString()
	}

	set value(value) {
		value                    = value || ''
		this.input.element.value = value
		if (this._getValuesString() !== value) {
			if (value === '') {
				for (const tag of [... this._tags.children]) {
					tag._onClose()
				}
			} else {
				for (const v of String(value).split(',')) {
					const item = this._valueToItemMap[Number(v)]
					this._select(item.props.data, item)
				}
			}
		}
	}

	renderTag(item) {
		return $.Tag({label: item.dataId, data: item})
	}

	render() {
		const searchName = $.String.random(6)
		this._tags = $.div('tags')
		this._search = $.Search({
			name        : searchName,
			placeholder : 'Select port',
			onclick     : this._onClick
		})
		this._menu = $.List('menu hidden', {
			name            : this._menuName,
			searchName      : searchName,
			dataSource      : this.props.dataSource,
			itemRenderer    : this.props.itemRenderer,
			mixins          : [DataListMixin],
			isSelectable    : false,
			// onDataChange    : this.
		})
		this.children.push(this._tags)
		this.children.push(this._search)
		this.children.push(this._menu)
		return super.render()
	}
}

$.define(InputSearchSelect, import.meta.url)
export default InputSearchSelect