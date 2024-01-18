import $       from '../../index.js'
import * as ui from '../../ui/index.js'


export default class ComponentsPage extends $.Component {
	onClick(event) {
		alert('Hello World')
	}

	render() {
		return $.Columns([
			$.Rows('sidebar', [
				$.Link({label: 'Button',   hash: 'cmp:button'   }),
				$.Link({label: 'Calendar', hash: 'cmp:calendar' }),
				$.Link({label: 'Checkbox', hash: 'cmp:checkbox' }),
				$.Box({cssFlexGrow: 100})
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
				$.Box({route: 'cmp:checkbox'})
			])
		])
	}
}

$.define(ComponentsPage, import.meta.url)