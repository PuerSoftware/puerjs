import $       from '../../index.js'
import * as ui from '../../ui/index.js'


export default class ComponentsPage extends $.Component {
	render() {
		return $.Columns([
			$.Rows('sidebar', [
				$.Link({label: 'Button',       hash: 'cmp:button'   }),
				$.Link({label: 'Calendar',     hash: 'cmp:calendar' }),
				$.Link({label: 'Checkbox',     hash: 'cmp:checkbox' }),
				$.Link({label: 'Flag',         hash: 'cmp:flag' }),
				$.Link({label: 'SearchSelect', hash: 'cmp:checkbox' }),
			]),
			$.Box('body', [
				$.Box({route: 'cmp:button', isDefaultRoute: true}, [
					$.Button('primary',   { text: 'Primary Button'   }),
					$.Button('secondary', { text: 'Secondary Button' }),
					$.Button('disabled',  { text: 'Disabled Button'  })
				]),
				$.Box({route: 'cmp:calendar'}, [
					$.InputCalendar({name: 'test'})
				]),
				$.Box({route: 'cmp:checkbox'}),
				$.Box({route: 'cmp:searchselect'}, [
					$.InputSearchSelect({name: 'test'})
				]),
				$.Box({route: 'cmp:flag'}, [
					$.Flag({code: 'US'}),
					$.br(),
					$.Flag({code: 'UA'}),
					$.br(),
					$.Flag({code: 'GB'}),
					$.br(),
					$.Flag({code: 'AE'}),
					$.br(),
					$.Flag({code: 'TR'})
				])
			])
		])
	}
}

$.define(ComponentsPage, import.meta.url)