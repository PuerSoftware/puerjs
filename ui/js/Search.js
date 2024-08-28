import $         from '../../index.js'
import InputText from './InputText.js'


export default class Search extends $.Component {
	constructor(props, children) {
		super(props, children)

		this.props.require('name')
		this.props.default('placeholder', 'Search ...')
		// this.props.hide = false;

		this.isFocused = false
		this.input     = null
	}

	_onFocus(e) {
		this.isFocused = true
		this.trigger($.Event.SEARCH_FOCUS, {
			name: this.props.name
		})
	}
	_onBlur(e) {
		this.isFocused = false
		this.trigger($.Event.SEARCH_BLUR, {
			name: this.props.name
		})
	}

	_onKeyUp(e) {
		if ($.Constants.KeyCodeToKey[e.keyCode] === 'ESCAPE') {
			this.input.value = ''
		}
		this.search()
	}

	search() {
		this.trigger($.Event.SEARCH_CHANGE, {
			value : this.input.value,
			name  : this.props.name
		})
	}

	reset() {
		this.input.value = ''
		this.search()
	}

	render() {
		this.input = $.InputText('confined', {
			placeholder : this.props.placeholder,
			name        : this.props.name,
			onfocus     : this._onFocus,
			onblur      : this._onBlur,
			onkeyup     : this._onKeyUp,
		})
		return $.div([this.input])
	}
}

$.define(Search, import.meta.url)
