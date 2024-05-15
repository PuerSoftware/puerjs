import $         from '../../index.js'
import InputText from './class.InputText.js'


export default class Search extends $.Component {
	constructor(props, children) {
		super(props, children)

		this.props.require('name')
		this.props.default('placeholder', 'Search ...')

		this.isFocused = false
		this.input     = null
	}

	_onFocus (event) { this.isFocused = true  }
	_onBlur  (event) { this.isFocused = false }

	_onKeyUp(event) {
		if (event.keyCode === $.Constants.Keys.Escape) {
			this.input.value = ''
		}
		this.search()	
	}

	search() {
		this.trigger($.Event.SEARCH, {
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