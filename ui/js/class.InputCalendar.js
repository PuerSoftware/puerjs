import $ from '../../index.js'

import FormInput from './class.FormInput.js'


class InputCalendar extends FormInput {
	constructor( ... args ) {
		super( ... args )
		this.props.default('tagName', 'input')
		this.props.default('type',    'text')
		this.props.default('isRange',   false)

		this.isShown        = false
		this._date          = null
		this._selectedDates = []
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
		const dayCmp = event.targetComponent
		const date   = new Date(dayCmp.props.year, dayCmp.props.month, dayCmp.props.text)
		dayCmp.addCssClass('selected')
		if (this.props.range) {

		} else {
			this._selectedDates = []
			this._selectedDates.push(date)
		}

		this._updateValue()
	}

	/************************************************/

	_update() {
		let [year, month, day] = $.Date.normalizeDate(
			this._date.getFullYear(),
			this._date.getMonth() + this._monthInc,
			this._date.getDate()
		)
		const date                  = new Date(year, month, day)
		this._dateString.props.text = $.Date.intlMonthYear(date.getTime())
		this._fillCalendar(date)
	}

	_updateValue() {
		this._selectedDates.sort()
		this.value = $.Date.internationalFormat(...this._selectedDates)
	}

	_fillCalendar(date) {
		const year  = date.getFullYear()
		const month = date.getMonth()

		const todayYear  = this._date.getFullYear()
		const todayMonth = this._date.getMonth()
		const todayDay   = this._date.getDate() // day of week

		const [prevYear, prevMonth] = $.Date.normalizeDate(year, month - 1)
		const currMonthLen          = $.Date.getDaysInMonth(year, month)
		const currMonthStart        = new Date(year, month, 0).getDay()
		const prevMonthLen          = $.Date.getDaysInMonth(prevYear, prevMonth)

		let cls
		let dayCount = -currMonthStart + 1
		for (let y=0; y<this._totalWeeks; y++) {
			for (let x=0; x<this._week.length; x++) {
				cls = []
				let [valueY, valueM, valueD] = $.Date.normalizeDate(year, month, dayCount)
				if (valueD === todayDay && valueM === todayMonth && valueY === todayYear) {
					console.log('today', valueD, valueM, valueY)
					cls.push('today')
				}

				const cmp = this._days[y][x]
				cmp.removeCssClass('prev-month', 'next-month', 'today')
				cls.length && cmp.addCssClass(cls)

				cmp.props.text  = valueD
				cmp.props.month = valueM
				cmp.props.year  = valueY
				dayCount ++
			}
		}

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
				td = $.td('day', {onclick: this._onDayClick.bind(this)})
				this._days[w][d] = td
				tr.append(td)
			}
		}
	}

	/************************************************/

	set date(timestamp) {
		this._date = new Date(timestamp)
		this._update()
	}

	get date() {
		return this._date
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

$.define(InputCalendar, import.meta.url)
export default InputCalendar