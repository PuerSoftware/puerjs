import $             from '../../index.js'
import DataListItem  from './class.DataListItem.js'
import InputCheckbox from './class.InputCheckbox.js'


export default class CheckListItem extends DataListItem {
	constructor(... args) {
		super(... args)
		this.checkbox = null
	}


	render() {
		this.checkbox = $.InputCheckbox({name: this.props.name})
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