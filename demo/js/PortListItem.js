import $ from '../../index.js'
import {ListItem} from '../../ui/index.js'

export default class PortListItem extends ListItem {
	render() {
		const label = `${this.props.data.country}, ${this.props.data.port}`
		return $.Flag({
			code  : this.props.data.code,
			label : label,
		})
	}
}

$.define(PortListItem, import.meta.url)