import $ from '../../index.js'


export default class PieChart extends $.Component {
	constructor(... args) {
		super(... args)
		this._segments     = {}
		this._holeSegments = {}
		this._data         = {}

		this.segments = null
		this.hole     = null
		this.legend   = null
		this.label    = null
	}

	_onSegmentMouseOver(label) {
		let segment
		for (const segmentLabel in this._segments) {
			this._segments[segmentLabel].removeCssClass('hover')
			this._holeSegments[segmentLabel].removeCssClass('hover')
		}
		this._segments[label].addCssClass('hover')
		this._holeSegments[label].addCssClass('hover')
		this.label.removeChildren()
		this.label.append($.Rows([
			$.Box('label', {text: label}),
			$.Box('value', {text: this._data[label].value}),
		]))
	}

	_onSegmentMouseOut(label) {
		this.label.removeChildren()
		for (const segmentLabel in this._segments) {
			this._segments[segmentLabel].removeCssClass('hover')
			this._holeSegments[segmentLabel].removeCssClass('hover')
		}
	}

	onDataChange(items) {
		this.segments.removeChildren()
		this.legend.removeChildren()
		this.hole.removeChildren()

		this._segments = {}
		this._data     = {}

		const total = items.reduce((acc, o) => acc + $.String.toFloat(o.value), 0)
		let   angle = 0
		const units = $.String.toUnits(items[0].value)

		for (const item of items) {
			const deg     = 90
			const segment = $.div('segment', {
				cssTransform : `rotate(${angle}deg)`
			})
			this._segments[item.label] = segment
			this.segments.append(segment)

			const holeSegment = $.div('hole-segment', {
				cssTransform : `rotate(${angle}deg)`
			})
			this._holeSegments[item.label] = holeSegment
			this.hole.append(holeSegment)

			this._data[item.label] = item
			angle += $.String.toFloat(item.value) / total * 360

			segment._on('mouseover', () => { this._onSegmentMouseOver (item.label) })
			segment._on('mouseout',  () => { this._onSegmentMouseOut  (item.label) })

			const legendItem = $.Rows([
				$.Box('label', {text: item.label}),
				$.Box('value', {text: item.value})
			])
			this.legend.append(legendItem)

			this.total.props.text = total + units
		}
	}

	onInit() {
		this.mixin($.DataOwnerMixin)
	}

	render() {
		return $.div([
			this.legend = $.Columns('legend'),
			$.div('doughnut', [
				this.segments = $.div('segments'),
				this.hole     = $.div('hole'),
				this.label    = $.div('label'),
				this.labelBg  = $.div('label-bg')
			]),
			$.Rows('total', [
				$.div({text: 'Total'}),
				this.total = $.div()
			])
		])
	}
}

$.define(PieChart, import.meta.url)