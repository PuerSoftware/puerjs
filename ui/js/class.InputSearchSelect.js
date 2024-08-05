import $             from '../../index.js'
import FormInput     from './class.FormInput.js'
import DataListMixin from '../../library/class.DataListMixin.js'



class InputSearchSelect extends FormInput {
	constructor(props, children) {
		super(props, children)
		this.props.default('tagName',      'input')
		this.props.default('pageSize',     100)
		this.props.default('type',         'hidden')
		this.props.default('renderTag',    this.renderTag)
		this.props.default('itemRenderer', 'ListItem')
		this.props.default('isSingular',   false)

		this._tags            = null
		this._search          = null
		this._menu            = null
		this._menuList        = null
		this._menuName        = $.String.random(6)
		this._valueSet        = new Set()
		this._valueToDataId   = {}
		this._valueToTag      = {}

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
		this._select(event.detail.data)
	}

	_onUnselect(e) {
		this._unselect(e.detail.target.data.value)
	}

	_getValuesString() {
		return Array.from(this._valueSet).join(',')
	}

	_fillValueToDataId() {
		for (const data of this._menuList.filteredItemData) {
			this._valueToDataId[data.value] = data.dataId
			if (this._menuList.items[data.dataId]) {
				this._disableItem(data.value, this._valueSet.has(data.value))
			}
		}
	}

	_disableItem(value, disabled) {
		this._menuList.disableItem([this._valueToDataId[value]], disabled)
	}

	_select(data) {
		if (data && !this._valueSet.has(data.value)) {
			if (this.props.isSingular) {
				for (const value in this._valueToTag) {
					this._valueToTag[value]._onClose()
				}
				this._valueSet = new Set()
			}

			this._disableItem(data.value, true)
			const tag                    = this.props.renderTag(data)
			this._valueToTag[data.value] = tag
			this._tags.append(tag)
			this._updateValue(data.value, 'add')
		}
	}

	_unselect(value) {
		delete this._valueToTag[value]
		this._updateValue(value, 'delete')
		this._disableItem(value, false)
	}

	_updateValue(value, func='add') {
		this._valueSet[func](value)
		this.value = this._getValuesString()
	}

	set value(value) {
		super.value = value
		if (this._getValuesString() !== value) {
			for (const v in this._valueToTag) {
				this._valueToTag[v]._onClose()
			}
			if (value !== '') {
				for (const v of String(value).split(',')) {
					const dataId = this._valueToDataId[Number(v)]
					const idx    = this._menuList.idToIdx[dataId]
					this._select(this._menuList.filteredItemData[idx])
				}
			}
		}
	}

	get value() {
		return super.value
	}

	reset() {
		super.reset()
		this._valueSet = new Set()
		this._tags.removeChildren()
	}

	renderTag(item) {
		return $.Tag({label: item.dataId, data: item})
	}

	onPropIsEditableChange(isEditable) {
		if (this.inPlaceLabel) {
			this.inPlaceLabel.toggle(!isEditable)
			this.input.toggle(isEditable)
			for (const child of this.children) {
				if (child !== this._menu) {
					child.toggle(isEditable)
				}
			}
			this.inPlaceLabel.props.text = this.stringValue || '-'
			if (isEditable) {
				this.focus()
			}
		}
	}

	render() {
		const searchName = $.String.random(6)
		this._tags = $.div('tags')
		this._search = $.Search({
			name        : searchName,
			placeholder : this.props.placeholder,
			onclick     : this._onClick
		})
		this._menu = $.div('menu-body hidden', [
			this._menuList = $.List('menu', {
				name            : this._menuName,
				searchName      : searchName,
				dataSource      : this.props.dataSource,
				pageSize        : this.props.pageSize,
				itemRenderer    : this.props.itemRenderer,
				mixins          : [{mixin: DataListMixin}],
				isSelectable    : false,
				onBuffer        : this._fillValueToDataId.bind(this),
				onDataLoad      : this._fillValueToDataId.bind(this),
			})
		])
		this.children.push(this._tags)
		this.children.push(this._search)
		this.children.push(this._menu)
		return super.render()
	}
}

$.define(InputSearchSelect, import.meta.url)
export default InputSearchSelect