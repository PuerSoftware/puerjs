import $ from '../../index.js'

import FormInput from './class.FormInput.js'

/************************************************************************************************/

class _Day extends $.Component {
	constructor(... args) {
		super(... args)
		this.props.default('day'  , 0)
		this.props.default('month', 0)
		this.props.default('year' , 0)
	}

	setDate(ymd) {
		this.props.year  = ymd[0]
		this.props.month = ymd[1]
		this.props.day   = ymd[2]
	}

	get date() {
		return new Date(this.props.year, this.props.month, this.props.day)
	}

	clearCss() {
		this.removeCssClass('prev-month', 'next-month', 'today')
	}

	highlightRange(range) {
		if (range.length) {
			const start = range[0]
			const end   = range[1] || start
			this.removeCssClass('selected', 'start-range', 'end-range', 'mid-range')
			if ($.Date.eq(start, this.date)) {
				this.addCssClass('selected', 'start-range')
			}
			if ($.Date.eq(end, this.date)) {
				this.addCssClass('selected', 'end-range')
			}
			if ($.Date.gt(this.date, start) && $.Date.lt(this.date, end)) {
				this.addCssClass('selected', 'mid-range')
			}
		}
	}

	render() {
		return $.td('day', [
			$.span({text: this.props.day})
		])
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

		this.on($.Event.APP_CLICK,  this._onAppClick)
		this.on($.Event.APP_ESCAPE, this._onAppEscape)
	}

	/************************************************/

	_toggle(event) {
		this._calendar.toggle()
	}

	_onAppClick(event) {
		const targetElement = event.detail.event.target

		if (!this.element.contains(targetElement)) {
			this._calendar.hide()
		}
	}

	_onAppEscape(event) { this._calendar.hide() }

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

	_parseRangeString(rangeString) {
		const dates = []
		for (const s of rangeString.split('-')) {
			const [d, m, y] = s.split('/')
			dates.push(new Date(y, m - 1, d))
		}
		return dates
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
				cell.setDate(normalDate)
				dayCount ++
		})
	}

	_renderHeader() {
		return $.Columns('head', [
			this._dateString = $.div('month'),
			$.div('arrows', [
				$.div('prev', {onclick: this._onPrevious.bind(this) }),
				$.div('next', {onclick: this._onNext.bind(this)     }),
			]),
			$.div('close', {onclick: this._toggle.bind(this)})
		])
	}

	_renderCalendar() {
		const table = $.table()

		this._header = this._renderHeader()
		this._calendar.append([this._header, $.div('content', [table])])

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

	set value(value) {
		super.value = value
		if (this._getRangeString() !== value) {
			this._range = []
			this._range.push(... this._parseRangeString(value))
			this._range.sort((a, b) => a - b )
			this._highlightRange()
		}
	}

	get value() {
		return this._getRangeString()
	}

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
		this.input.element.setAttribute('readonly', 'true')
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
