import $             from '../../index.js'
import ListItem      from './ListItem.js'
import InputCheckbox from './InputCheckbox.js'


export default class CheckListItem extends ListItem {
	constructor(... args) {
		super(... args)
		this.checkbox = null
	}

	get checked() {
		return this.checkbox.value
	}

	set checked(check) {
		this.checkbox.value = check
	}

	render() {
		this.checkbox = $.InputCheckbox({
			name : this.props.name,
			data : this.props.data
		})

		return $.li([
			$.Columns([
				$.Box('left', [
					this.checkbox
				]),
				$.Box('right', this.children)
			])
		])
	}
}

$.define(CheckListItem, import.meta.url)
