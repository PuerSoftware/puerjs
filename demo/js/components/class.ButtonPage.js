import $, {PuerComponent} from '../../../puer.js'

import * as ui from '../../../ui/index.js'

class ButtonPage extends  PuerComponent {
	render() {
		return $.div({cssDisplay: 'inline', cssWidth: '100%'}, [
			$.div({cssMargin: '10px'}, [
				$.Button('primary', {text: 'Register Vessel ID'})
			]),
			$.div({cssMargin: '10px'}, [
				$.Button('secondary', {text: 'Cancel'})
			]),
			$.div({cssMargin: '10px'}, [
				$.Button('neutral primary', {text: 'Give access'})
			]),
			$.div({cssMargin: '10px'}, [
				$.Button('neutral secondary', {text: 'Delete'})
			])
		])
	}
}


$.define(ButtonPage, import.meta.url)
export default ButtonPage