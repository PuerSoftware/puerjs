import $ from '../../index.js'

import FormInput from './class.FormInput.js'

/************************************************************************************************/

class _Day extends $.Component {
	set date(ymd) {
		const oldDate = this.date

		this.props.year  = ymd[0]
		this.props.month = ymd[1]
		this.props.text  = ymd[2]

		if (!$.Date.eq(...oldDate, ...this.date)) {
			this.selected = false
		}
	}

	get date() {
		return [
			this.props.year,
			this.props.month,
			this.props.text,
		]
	}

	get Date() {
		return new Date(...this.date)
	}

	set selected(select) {
		select
			? this.addCssClass('selected')
			: this.removeCssClass('selected')
	}

	clearCss() {
		this.removeCssClass('prev-month', 'next-month', 'today')
	}

	render() {
		return $.td('day', {... this.props})
	}
}

/************************************************************************************************/

class _DatesRange extends Array {
	constructor(... args) {
		super(... args)
		this._rangeStart = null
		this._rangeEnd   = null
		this._cmpStart   = null
		this._cmpEnd     = null

		this._isIntervalRegistered = false
	}

	/************************************************/

	_intervalRegistrationRequired() {
		if (!this._isIntervalRegistered) {
			throw 'Range interval must be registered, when this method is called'
		}
	}

	_sort() {
		this.sort((a, b) => {
			return a.Date - b.Date
		})
	}


	_isStart(d) { return this._rangeStart && $.Date.eq(this._rangeStart, d) }
	_isEnd(d) { return this._rangeEnd && $.Date.eq(this._rangeEnd, d) }

	/************************************************/

	get rangeString() {
		// Range start and range end must be registered at this moment
		return Array.from(this.rangeInterval)
			.map(date => $.Date.intlNumericFormat(date))
			.join(' - ')
	}

	get rangeInterval() {
		// Range start and range end must be registered at this moment
		if (this.length) {
			if (this._rangeEnd && !$.Date.eq(this._rangeStart, this._rangeEnd)) {
				return [this._rangeStart, this._rangeEnd]
			}
			return [this._rangeStart]
		}
		return []
	}

	/************************************************/

	clearSelection() {
		for (const cmp of this) {
			cmp.selected = false
		}
		this._rangeStart = null
		this._rangeEnd   = null
		this.splice(0, 2)
	}

	ensureSelection() {
		// Range start and range end must be registered at this moment
		for (const cmp of this) {
			if (this._isStart(cmp.Date) || this._isEnd(cmp.Date)) {
				cmp.selected = true
			} else {
				cmp.selected = false
			}
		}
	}

	replaceDateComponents(... components) {
		// Range start and range end must be registered at this moment
		for (const cmp of components) {
			console.log('OUT', cmp.Date)
			if (this._isStart(cmp.Date)) {
				this[0] = cmp
			}
			if (this._isEnd(cmp.Date)) {
				this[1] = cmp
			}
		}
	}

	registerRangeInterval() {
		if (this.length) {
			if (this._rangeStart) {
				this._sort()
				if (this[1]) {
					this._rangeEnd = this[1].Date
				}
			} else {
				this._rangeStart = this[0].Date
			}
		}
	}

	isInRange(date) {
		// Range start and range end must be registered at this moment
		if (this._rangeStart && this._rangeEnd) {
			return $.Date.gt(date, this._rangeStart) && $.Date.lt(date, this._rangeEnd)
		}
	}
}

/************************************************************************************************/

export default class InputCalendar extends FormInput {
	constructor( ... args ) {
		super( ... args )
		this.props.default('tagName', 'input')
		this.props.default('type',    'text')
		this.props.default('isRange',   false)

		this.isShown        = false
		this._date          = null
		this._selectedDates = new _DatesRange()
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

	_onClick() {
		this.isShown = !this.isShown
		this._calendar.toggle(this.isShown)
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
			if (this._selectedDates.length === 2) {
				this._selectedDates.clearSelection()
			}
		} else {
			this._selectedDates.clearSelection()
		}

		this._selectedDates.push(event.targetComponent)
		this._selectedDates.registerRangeInterval()
		this._selectedDates.ensureSelection()
		this.value = this._selectedDates.rangeString
		this.props.isRange && this._fillRange()
	}

	/************************************************/

	_walk(f) {
		for (let y=0; y<this._totalWeeks; y++) {
			for (let x = 0; x < this._week.length; x++) {
				f.bind(this)(this._days[y][x])
			}
		}
	}

	_getDaysByDates(dates) {
		const found = []
		this._walk(cell => {
			for (const date of dates) {
				if ($.Date.eq(date, cell.Date)) {
					found.push(cell)
				}
			}
		})
		return found
	}

	/************************************************/

	_update() {
		this._dateString.props.text = $.Date.intlMonthYear(this.normalDate.getTime())
		this._fillCalendar(this.normalDate)

		const cellToReplace = this._getDaysByDates(this._selectedDates.rangeInterval)

		this._selectedDates.replaceDateComponents(...cellToReplace)
		this._selectedDates.ensureSelection()
		this.props.isRange && this._fillRange()
	}

	_fillRange() {
		this._walk(cell => {
			if (this._selectedDates.isInRange(cell.Date)) {
				cell.addCssClass('selected-range')
			} else {
				cell.removeCssClass('selected-range')
			}
		})
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
			$.div({ text: '<', onclick: this._onPrevious.bind(this) }),
			$.div({ text: '>', onclick: this._onNext.bind(this)     })
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
		this._on('click', this._onClick)
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