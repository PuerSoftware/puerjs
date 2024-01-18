import $ from '../../index.js'


export default class ComponentsPage extends $.Component {
	render() {
		return $.Columns([
			$.Rows('sidebar', [
				$.Link({label: 'Calendar', hash: 'cmp:calendar' }),
				$.Link({label: 'Checkbox', hash: 'cmp:checkbox' }),
				$.Box({cssFlexGrow: 100})
			]),
			$.Box('body', [
				$.Box({route: 'cmp:calendar', isDefaultRoute: true}, [
					$.InputCalendar({name: 'test'})
				]),
				$.Box({route: 'cmp:checkbox'})
			])
		])
	}
}

$.define(ComponentsPage, import.meta.url)