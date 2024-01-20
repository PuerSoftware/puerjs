import $             from '../../index.js'
import FormInput     from './class.FormInput.js'
import DataListMixin from '../../library/class.DataListMixin.js'


class InputSearchSelect extends FormInput {
	constructor(props, children) {
		super(props, children)
		this.props.default('tagName', 'input')
		this.props.default('type',    'hidden')

		console.log('this.name', this.name)

		this._menu = null
		this.on($.Event.LIST_ITEM_SELECT, this._onSelect)
	}

	_onClick()  { this._menu.toggle() }

	_onSelect(e) {
		if (e.detail.targetName === this._menu.name) {
			this.addTag(e.detail.data)
		}
	}

	addTag(item) {
		console.log('addTag', item)
	}

	onInit() {
		super.onInit()
	}

	render() {
		const searchName = $.String.random(6)
		this._search = $.Search({
			name    : searchName,
			onclick : this._onClick
		})
		this._menu = $.List('menu hidden', {
			name            : $.String.random(6),
			searchName      : this.searchName,
			dataSource      : this.props.dataSource,
			mixins          : [DataListMixin],
			ensureSelection : false
		})
		this.children.push(this._search)
		this.children.push(this._menu)
		return super.render()
	}
}

$.define(InputSearchSelect, import.meta.url)
export default InputSearchSelect