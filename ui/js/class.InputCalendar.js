import $ from '../../index.js'

import FormInput from './class.FormInput.js'

/************************************************************************************************/

class _Day extends $.Component {
	set date(ymd) {
		const oldDate = this.date

		this.props.year  = ymd[0]
		this.props.month = ymd[1]
		this.props.text  = ymd[2]

	}

	get date() {
		return new Date(this.props.year, this.props.month, this.props.text)
	}

	clearCss() {
		this.removeCssClass('prev-month', 'next-month', 'today')
	}

	highlightRange(range) {
		if (range.length) {
			const start = range[0]
			const end   = range[1] || start
			this.removeCssClass('selected', 'selected-range')
			if ($.Date.eq(start, this.date) || $.Date.eq(end, this.date)) {
				this.addCssClass('selected')
			} else if ($.Date.gt(this.date, start) && $.Date.lt(this.date, end)) {
				this.addCssClass('selected-range')
			}
		}
	}

	render() {
		return $.td('day', {... this.props})
	}
}

/************************************************************************************************/

export default class InputCalendar extends FormInput {
	constructor( ... args ) {
		super( ... args )
		this.props.default('tagName', 'input')
		this.props.default('type',    'text')
		this.props.default('isRange',   false)

		this._date          = null
		this._range         = []
		this._totalWeeks    = 6
		this._monthInc      = 0

		this._week = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun']
		this._days = Array.from(
			{ length: this._totalWeeks },
			() => new Array(this._week.length).fill(null)
		)

		this._header     = null
		this._calendar   = null
		this._dateString = null
	}

	/************************************************/

	_toggle() {
		this._calendar.toggle()
	}

	_onPrevious() {
		this._monthInc --
		this._update()
	}

	_onNext() {
		this._monthInc ++
		this._update()
	}

	_onDayClick(event) {
		if (this.props.isRange) {
			if (this._range.length === 2) {
				this._range = []
			}
		} else {
			this._range = []
		}
		this._range.push(event.targetComponent.date)
		this._range.sort((a, b) => a - b )
		this._highlightRange()
		this.value = this._getRangeString()
	}

	/************************************************/

	_walk(f) {
		for (let y=0; y<this._totalWeeks; y++) {
			for (let x = 0; x < this._week.length; x++) {
				f.bind(this)(this._days[y][x])
			}
		}
	}

	_getRangeString() {
		return Array.from(this._range)
			.map(date => $.Date.format(date, $.Date.FORMAT_SLASHES))
			.join(' - ')
	}

	/************************************************/

	_highlightRange() {
		this._walk(cell => {
			cell.highlightRange(this._range)
		})
	}

	_update() {
		this._dateString.props.text = $.Date.intlMonthYear(this.normalDate.getTime())
		this._fillCalendar(this.normalDate)
		this._highlightRange()
	}

	_fillCalendar(date) {
		const year  = date.getFullYear()
		const month = date.getMonth()

		const currMonthLen   = $.Date.getDaysInMonth(year, month)
		const currMonthStart = new Date(year, month, 0).getDay()

		let cls
		let dayCount = -currMonthStart + 1

		this._walk(cell => {
				cls = []
				const normalDate = $.Date.normalizeDate(year, month, dayCount)

				if ($.Date.eq(new Date(...normalDate), this._date)) {
					cls.push('today')
				}
				if (dayCount < 1) {
					cls.push('prev-month')
				}
				if (dayCount > currMonthLen) {
					cls.push('next-month')
				}

				cell.clearCss()
				cls.length && cell.addCssClass(cls)
				cell.date  = normalDate
				dayCount ++
		})
	}

	_renderHeader() {
		return $.Columns('head', [
			this._dateString = $.div(),
			$.div([
				$.div({ text: '<', onclick: this._onPrevious.bind(this) }),
				$.div({ text: '>', onclick: this._onNext.bind(this)     }),
			]),
			$.div([
				$.div('test', {text: 'x', onclick: this._toggle.bind(this)})
			])
		])
	}

	_renderCalendar() {
		const table = $.table()

		this._header = this._renderHeader()
		this._calendar.append([this._header, $.div([table])])

		let tr = $.tr()
		let td
		table.append(tr)
		for (let d = 0; d < this._week.length; d++) {
			td = $.th('day', {text: this._week[d]})
			tr.append(td)
		}

		for (let w = 0; w < this._totalWeeks; w++) {
			table.append(tr = $.tr())

			for (let d = 0; d < this._week.length; d++) {
				td = $._Day({onclick: this._onDayClick.bind(this)})
				this._days[w][d] = td
				tr.append(td)
			}
		}
	}

	/************************************************/

	set date(timestamp) {
		this._date = new Date(timestamp)
		this._date.setHours(0, 0 ,0 ,0)
		this._update()
	}

	get date() {
		return this._date
	}

	get normalDate() {
		return new Date(
			... $.Date.normalizeDate(
				this._date.getFullYear(),
				this._date.getMonth() + this._monthInc,
				this._date.getDate()
			)
		)
	}

	onRender() {
		this._renderCalendar()
	}

	onInit() {
		super.onInit()
		this._on('click', this._toggle)
		this.date = Date.now()
	}

	render() {
		this._calendar = $.Rows('calendar hidden')
		this.children.push(this._calendar)
		return super.render()
	}
}

$.define(_Day)
$.define(InputCalendar, import.meta.url)