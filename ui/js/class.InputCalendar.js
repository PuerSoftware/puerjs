import $ from '../../index.js'

import FormInput from './class.FormInput.js'


class InputCalendar extends FormInput {
	constructor( ... args ) {
		super( ... args )
		this.props.default('tagName', 'input')
		this.props.default('type',    'text')

		this.isShown     = false
		this._date       = null
		this._totalWeeks = 6
		this._monthInc   = 0

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

	/************************************************/

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
				td = $.td('day', {text: d.toString()})
				this._days[w][d] = td
				tr.append(td)
			}
		}
	}

	_update() {
		let month = this._date.getMonth() + this._monthInc
		let year  = this._date.getFullYear()
		let day   = this._date.getDate()
		if (month < 0) {
			month = 12 + month
			year --
		}
		const date = new Date(year, month, day)
		this._dateString.props.text = $.Date.intlMonthYear(date.getTime())
		this._fillCalendar(date)
	}

	_fillCalendar(date) {
		const year  = date.getFullYear()
		const month = date.getMonth()

		const todayYear  = this._date.getFullYear()
		const todayMonth = this._date.getMonth()
		const todayDay   = this._date.getDate()

		console.log(year, month)
		let prevMonth = month - 1
		let prevYear = year
		if (prevMonth < 0) {
			prevYear --
			prevMonth = 12
		}

		console.log('prevMonth', prevMonth)

		const currMonthLen   = new Date(year, month, 0).getDate()
		const currMonthStart = new Date(year, month, 0).getDay()
		const prevMonthLen   = new Date(prevYear, prevMonth, 0).getDate()

		console.log('currMonthLen',   currMonthLen)
		console.log('currMonthStart', currMonthStart)
		console.log('prevMonthLen',   prevMonthLen)

		let startDayPrevMonth = prevMonthLen - currMonthStart + 1
		let dayCount = startDayPrevMonth
		let day
		let cls

		console.log('startDayPrevMonth', startDayPrevMonth)

		for (let y=0; y<this._totalWeeks; y++) {
			for (let x=0; x<this._week.length; x++) {
				cls = []

				if (day == todayDay - 1 && month == todayMonth && year == todayYear) {
					console.log('today', day, month, year)
					cls.push('today')
				}

				if (y === 0 && x < currMonthStart) {
					day = dayCount
					cls.push('prev-month')
				} else if (dayCount > prevMonthLen) {
					if (dayCount - prevMonthLen > currMonthLen) {
						day = dayCount - prevMonthLen - currMonthLen
						cls.push('next-month')
					} else {
						day = dayCount - prevMonthLen
					}
				} else {
					day = dayCount
				}

				const cmp = this._days[y][x]
				cmp.removeCssClass(['prev-month', 'next-month', 'today'])
				cls.length && cmp.addCssClass(cls)
				cmp.props.text = day
				
				dayCount ++
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