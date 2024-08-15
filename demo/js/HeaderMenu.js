import $       from '../../index.js'
import * as ui from '../../ui/index.js'


export default class HeaderMenu extends $.Component {
	render() {
		return $.div([
			$.Link({label: 'Home',       hash: 'page:index' }),
			$.span({text: ' | '}),
			$.Link({label: 'Components', hash: 'page:component'}),
		])
	}
}

$.define(HeaderMenu, import.meta.url)