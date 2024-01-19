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
				$.Link({label: 'Tag',          hash: 'cmp:tag' }),
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
					$.h3({text: 'Square'}),
					$.Flag({code: 'US', square: true}),
					$.br(),
					$.Flag({code: 'UA', square: true}),
					$.br(),
					$.Flag({code: 'GB', square: true}),
					$.br(),
					$.Flag({code: 'AE', square: true}),
					$.br(),
					$.Flag({code: 'TR', square: true}),
					$.br(),
					$.h3({text: 'Default'}),
					$.Flag({code: 'US'}),
					$.br(),
					$.Flag({code: 'UA'}),
					$.br(),
					$.Flag({code: 'GB'}),
					$.br(),
					$.Flag({code: 'AE'}),
					$.br(),
					$.Flag({code: 'TR'})
				]),
				$.Box({route: 'cmp:tag'}, [
					$.Tag({'label': 'Tag with close button'}),
					$.br(),
					$.Tag([
						$.Flag({code: 'UA', label: 'Tag with child component'})
					]),
					$.br(),
					$.Tag({isRemovable: false, label: 'No close button'})
				])
			])
		])
	}
}

$.define(ComponentsPage, import.meta.url)