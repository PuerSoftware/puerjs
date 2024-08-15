import $    from '../../index.js'
import Rows from './Rows.js'
import Box  from './Box.js'


export default class ProgressBar extends $.Component {
	constructor(... args) {
		super(... args)
		this.props.require('label')
	}

	render() {
		return $.Rows([
			$.Box('label', {text: this.props.label}),
			$.div('progress')
		])
	}
}

$.define(ProgressBar, import.meta.url)
