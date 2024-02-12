import $       from '../../index.js'
import * as ui from '../../ui/index.js'

import PortListItem from './class.PortListItem.js'


export default class ComponentsPage extends $.Component {
	constructor(... args) {
		super(... args)
		
		this._highlightString = 'Words ```[blue]foo```, ```[pink]bar``` and ```[purple]baz``` are highlighted in this text.'

		this.state.item = {}
		this.state.code     = null
		this.state.highText = this._highlightString
	}

	_renderTag(item) {
		return $.Tag({data: item}, [
			$.Flag({label: item.port, code: item.code})
		])
	}

	_updateTextHighlight(e) {
		this.state.highText = e.target.value
	}


	onInit() {
		this.state.item = {
			label : 'foo',
		}
		this.state.code = this.codeContainer.jsCode
	}

	render() {
		return $.Columns([
			$.Rows('sidebar', [
				$.Link({label: 'Button',              hash: 'cmp:button'        }),
				$.Link({label: 'Calendar',            hash: 'cmp:calendar'      }),
				$.Link({label: 'Checkbox',            hash: 'cmp:checkbox'      }),
				$.Link({label: 'Code',                hash: 'cmp:code'          }),
				$.Link({label: 'Flag',                hash: 'cmp:flag'          }),
				$.Link({label: 'Google Map',          hash: 'cmp:map'           }),
				$.Link({label: 'Google Static Map',   hash: 'cmp:staticmap'     }),
				$.Link({label: 'Pagination',          hash: 'cmp:pagination'    }),
				$.Link({label: 'SearchSelect',        hash: 'cmp:searchselect'  }),			
				$.Link({label: 'Tag',                 hash: 'cmp:tag'           }),
				$.Link({label: 'Text Highlight',      hash: 'cmp:texthighlight' }),
				$.Link({label: 'Toggle',              hash: 'cmp:toggle'        }),
				$.Link({label: 'PieChart',            hash: 'cmp:piechart'      })
			]),
			$.Box('body', [
				$.Box({route: 'cmp:button', isDefaultRoute: true}, [
					$.Button('primary',   { text: 'Primary Button'   }),
					$.Button('secondary', { text: 'Secondary Button' }),
					$.Button('disabled',  { text: 'Disabled Button'  })
				]),
				$.Box({route: 'cmp:calendar'}, [
					$.InputCalendar({name: 'test', isRange: true})
				]),
				$.Box({route: 'cmp:checkbox'}, [
					$.InputCheckbox({name: 'test'})
				]),
				this.codeContainer = $.Box({route: 'cmp:code'}, [
					$.Code({lang: 'javascript', code: this.state.code})
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
				$.Box({route: 'cmp:map'}, [
					this.map = $.GoogleMap({
						name       : 'map',
						apiKey     : $.Constants.GOOGLE_DYNAMIC_MAPS_API_KEY,
						dataSource : 'Markers'
					})
				]),
				$.Box({route: 'cmp:staticmap'}, [
					this.map = $.GoogleStaticMap({
						name       : 'staticMap',
						apiKey     : $.Constants.GOOGLE_STATIC_MAPS_API_KEY,
						dataSource : 'Markers'
					})
				]),
				$.Box({route: 'cmp:pagination'}, [
					$.Pagination({
						name  : 'test',
						pages : '10'
					})
				]),
				$.Box({route: 'cmp:searchselect'}, [
					$.InputSearchSelect({
						name         : 'ports',
						dataSource   : 'Ports',
						itemRenderer : 'PortListItem',
						renderTag    : this._renderTag
					})
				]),
				$.Box({route: 'cmp:tag'}, [
					$.Tag({'label': 'Tag with close button'}),
					$.br(),
					$.Tag([
						$.Flag({code: 'UA', label: 'Tag with child component'})
					]),
					$.br(),
					$.Tag({isRemovable: false, label: 'No close button'})
				]),				
				$.Box('text-highlight', {route: 'cmp:texthighlight'}, [
					$.textarea({text: this._highlightString, onkeyup: this._updateTextHighlight }),
					$.TextHighlight({
						text : this.state.highText,
					})
				]),
				$.Box({route: 'cmp:toggle'}, [
					$.InputToggle({name: 'test'})
				]),
				$.Box({route: 'cmp:piechart'}, [
					$.PieChart('scheme1', {
						name       : 'PieChart',
						dataSource : 'PieChart'
					})
				])
			])
		])
	}
}

$.define(ComponentsPage, import.meta.url)