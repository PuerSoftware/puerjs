import $, {PuerComponent} from '../../../puer.js'

import {InputToggle} from '../../../ui/index.js'

class ButtonPage extends  PuerComponent {

	onClick(e) {
		console.log('click', e)
	}

	render() {
		return $.div([
			$.div([
				$.Button('primary',           { text: 'Register Vessel ID', onclick: this.onClick}),
				$.Button('secondary',         { text: 'Cancel'            , onclick: this.onClick}),
			]),
			$.div([
				$.Button('neutral primary',   { text: 'Give access'       , onclick: this.onClick}),
				$.Button('neutral secondary', { text: 'Delete'            , onclick: this.onClick}),
			]),
			$.div([
			    $.Button('disabled',          { text: 'Re-Generate'       , onclick: this.onClick})
			]),
			$.div([
				$.InputToggle({name: 'test'})
			])
		])
	}
}


$.define(ButtonPage, import.meta.url)
export default ButtonPage