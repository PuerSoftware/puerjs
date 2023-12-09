import $, {PuerComponent} from '../../../puer.js'

import * as ui from '../../../ui/index.js'

class ButtonPage extends  PuerComponent {

	onClick(e) {
		console.log('click', e)
	}

	render() {
		return $.div({cssDisplay: 'inline', cssWidth: '100%'}, [
				$.Button('primary',           { text: 'Register Vessel ID', onclick: this.onClick}),
				$.Button('secondary',         { text: 'Cancel'            , onclick: this.onClick}),
				$.Button('neutral primary',   { text: 'Give access'       , onclick: this.onClick}),
				$.Button('neutral secondary', { text: 'Delete'            , onclick: this.onClick}),
			    $.Button('disabled',          { text: 'Re-Generate'       , onclick: this.onClick})
		])
	}
}


$.define(ButtonPage, import.meta.url)
export default ButtonPage