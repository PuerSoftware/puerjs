import $ from '../../index.js'


export default class PieChart extends $.Component {
	constructor(... args) {
		super(... args)
		this._segments = {}
		this._data     = {}
	}

	_onSegmentMouseOver(label) {
		let segment
		for (const segmentLabel in this._segments) {
			segment = this._segments[segmentLabel]
			segment.removeCssClass('hover')
		}
		segment = this._segments[label]
		segment.addCssClass('hover')
		this.doughnutHole.removeChildren()
		this.doughnutHole.append($.Rows([
			$.Box('label', {text: label}),
			$.Box('label', {text: this._data[label].value}),
		]))
	}

	_onSegmentMouseOut(label) {
		this.doughnutHole.removeChildren()
	}

	onDataChange(items) {
		this.segments.removeChildren()
		this._segments = {}
		this._data     = {}

		const total = items.reduce((acc, o) => acc + o.value, 0)
		let   angle = 0

		for (const item of items) {
			const deg     = 90
			const segment = $.div('segment', {
				cssTransform : `rotate(${angle}deg)`,
			})
			this._segments[item.label] = segment
			this._data[item.label]  = item
			this.segments.append(segment)

			angle += item.value / total * 360

			segment._on('mouseover', () => { this._onSegmentMouseOver (item.label) })
			segment._on('mouseout',  () => { this._onSegmentMouseOut  (item.label) })
		}
	}

	onInit() {
		this.mixin($.DataOwnerMixin)
	}

	render() {
		return $.div([
			this.segments = $.div('segments'),
			this.doughnutHole = $.div('doughnut-hole')
		])
	}
}

$.define(PieChart, import.meta.url)