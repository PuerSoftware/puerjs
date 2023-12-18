import $         from '../../index.js'
import InputText from './class.InputText.js'

export default class Search extends $.Component {
	constructor(props, children) {
		super(props, children)
		this.props.require('name')
		this.isFocused = false
		this.input     = null
	}

	_onFocus(event) { this.isFocused = true }
	_onBlur(event) { this.isFocused = false }

	_onKeyUp(event) {
		this.trigger($.Event.SEARCH, {
			searchName : this.props.name,
			value      : this.input.value
		})
	}

	render() {
		this.input = $.InputText({
			name    : this.props.name,
			onfocus : this._onFocus,
			onblur  : this._onBlur,
			onkeyup : this._onKeyUp,
		})
		return $.div([this.input])
	}
}

$.define(Search, import.meta.url)