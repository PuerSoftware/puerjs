import $       from '../../index.js'
import * as ui from '../../ui/index.js'


export default class MenuHeader extends $.Component {
	render() {
		return $.div([
			$.Link({label: 'Home',       hash: 'page:index' }),
			$.span({text: ' | '}),
			$.Link({label: 'Components', hash: 'page:component'}),
		])
	}
}

$.define(MenuHeader, import.meta.url)