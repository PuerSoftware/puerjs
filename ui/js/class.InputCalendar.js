import $ from '../../index.js'

import FormInput from './class.FormInput.js'


class InputCalendar extends FormInput {
	constructor( ... args ) {
		super( ... args )
		this.props.default('tagName', 'input')
		this.props.default('type',    'text')
		this.isShown   = false

		this._totalWeeks = 6
		this._daysOfWeek = 7
		this._days       = Array.from(
			{ length: this._totalWeeks },
			() => new Array(this._daysOfWeek).fill(null)
		)

		this._calendar = null
	}

	_onClick(event) {
		this.isShown = !this.isShown
		this._calendar.toggle(this.isShown)
	}

	onInit() {
		super.onInit()
		this._on('click', this._onClick)
		this._renderCalendar()
	}

	_renderCalendar() {
		// const calendar = $.Box('calendar hidden')
		for (let week = 0; week < this._totalWeeks; week++) {
			for (let day = 0; day < this._daysOfWeek; day++) {
				const dayCell = $.div('day-cell', {text: day})
				this._days[week][day] = dayCell
				this._calendar.append(dayCell)
			}
		}
		// return calendar
	}

	_fillCalendar(year, month) {

	}

	render() {
		this._calendar = $.table('calendar hidden')
		this.children.push(this._calendar)
		return super.render()
	}
}

$.define(InputCalendar, import.meta.url)
export default InputCalendar