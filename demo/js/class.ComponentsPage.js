import $       from '../../index.js'
import * as ui from '../../ui/index.js'


export default class ComponentsPage extends $.Component {
	constructor(... args) {
		super(... args)
		this.props.code = '<div id="1205"><h1 class="title" title="Hello World">Hello World</h1></div>'
		
		this._highlightString = 'Words ```[blue]foo```, ```[pink]bar``` and ```[purple]baz``` are highlighted in this text.'

		this.state.item = {}
		this.state.code     = null
		this.state.highText = this._highlightString

        this._pthText      = 'Words foo, bar and buzz are highlighted in this text.'
        this.state.pthText = this._pthText
        this.state.pthPositions = {
            bar  : [11, 3],
            foo  : [6, 3],
            buzz : [19, 4]
        }
        this.state.pthClasses = {
            foo  : 'red',
            bar  : 'green',
            buzz : 'blue'
        }

        this._pthPosText     = JSON.stringify(this.state.pthPositions, null, 4)
        this._pthClassesText = JSON.stringify(this.state.pthClasses, null, 4)
	}

	_renderTag(item) {
		return $.Tag({data: item}, [
			$.Flag({label: item.port, code: item.code})
		])
	}

	_updateTextHighlight(e) {
		this.state.highText = e.target.value
	}

    _updatePthText(e) {
        this.state.pthText = e.target.value
        console.log('_updatePthText', this.state.pthText)
    }

    _updatePthPosText(e) {
        try {
            this.state.pthPositions = JSON.parse(e.target.value)
        } catch (e) {
            $.notify('Invalid positioning')
        }
    }

    _updatePthClassesText(e) {
         try {
            this.state.pthClasses = JSON.parse(e.target.value)
        } catch (e) {
            $.notify('Invalid colors')
        }
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
				$.Link({label: 'Button',                  hash: 'cmp:button'                }),
				$.Link({label: 'Calendar',                hash: 'cmp:calendar'              }),
				$.Link({label: 'Checkbox',                hash: 'cmp:checkbox'              }),
				$.Link({label: 'Code',                    hash: 'cmp:code'                  }),
				$.Link({label: 'CodeEditor',              hash: 'cmp:editorcode'            }),
				$.Link({label: 'Flag',                    hash: 'cmp:flag'                  }),
				$.Link({label: 'Google Map',              hash: 'cmp:map'                   }),
				$.Link({label: 'Google Static Map',       hash: 'cmp:staticmap'             }),
				$.Link({label: 'Pagination',              hash: 'cmp:pagination'            }),
				$.Link({label: 'SearchSelect',            hash: 'cmp:searchselect'          }),
				$.Link({label: 'Tag',                     hash: 'cmp:tag'                   }),
				$.Link({label: 'Text Highlight',          hash: 'cmp:texthighlight'         }),
				$.Link({label: 'Position Text Highlight', hash: 'cmp:positiontexthighlight' }),
				$.Link({label: 'Toggle',                  hash: 'cmp:toggle'                }),
				$.Link({label: 'PieChart',                hash: 'cmp:piechart'              })
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
				$.Box({route: 'cmp:editorcode'}, [
					$.CodeEditor({lang: 'html', code: this.props.code})
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
                $.Box('text-position-highlight', {route: 'cmp:positiontexthighlight'}, [
                    $.textarea({text: this._pthText,      onkeyup: this._updatePthText      }),
					$.textarea({text: this._pthPosText,   onkeyup: this._updatePthPosText   }),
					$.textarea({text: this._pthClassesText, onkeyup: this._updatePthClassesText }),
					$.PositionTextHighlight({
						srcText     : this.state.pthText,
                        positions   : this.state.pthPositions,
                        textClasses : this.state.pthClasses
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