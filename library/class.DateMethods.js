import StringMethods from './class.StringMethods.js'


const monthNames = [
	'Jan', 'Feb',
	'Mar', 'Apr',  'May',
	'Jun', 'Jul',  'Aug',
	'Sep', 'Oct',  'Nov',
	'Dec'
]

class DateMethods {
	static _dateToMilliSeconds(timestamp) {
		const date = new Date(timestamp)
		timestamp = date.getTime()
		if (timestamp <= 9999999999) {
			timestamp *= 1000
		}
		return timestamp
	}

	static intlMonth(date, code='en-US') {
		const m = date.toLocaleString(code, { month: 'long' })
		return StringMethods.capitalize(m)
	}

    static format(date) {
		date = DateMethods._dateToMilliSeconds(date)
		date = new Date(date)
		const day   = date.getDate().toString().padStart(2, '0')
		const month = (date.getMonth() + 1).toString().padStart(2, '0') // Add 1 because months are zero-indexed
		const year  = date.getFullYear().toString().substr(-2)          // Get the last two digits of the year
		return `${day}.${month}.${year}`
	}

	static formatTime(date) { // TODO: rename this method
		date = DateMethods._dateToMilliSeconds(date)
		date = new Date(date)
		const hours   = date.getHours().toString()
		const minutes = date.getMinutes().toString()

		return `${hours}:${minutes}`
	}

	static intlMonthYear(date, code='en-US') { // TODO: rename this method
		date = DateMethods._dateToMilliSeconds(date)
		date = new Date(date)
		const m = DateMethods.intlMonth(date, code)
		const y = date.getFullYear().toString()

		return `${m} ${y}`
	}

	static internationalFormat(dateFrom, dateTo=null) {
		if (!dateFrom && !dateTo) { return null }
		dateFrom = DateMethods._dateToMilliSeconds(dateFrom)
		dateFrom = new Date(dateFrom)

		const yearFrom  = dateFrom.getFullYear()
		const monthFrom = dateFrom.getMonth()
		const dayFrom   = dateFrom.getDay()

		if (dateTo) {
			dateTo = DateMethods._dateToMilliSeconds(dateTo)
			dateTo = new Date(dateTo)

			const yearTo  = dateTo.getFullYear()
			const monthTo = dateTo.getMonth()
			const dayTo   = dateTo.getDay()

			if (monthFrom === monthTo) {
				return `${monthNames[monthFrom]} ${dayFrom}-${dayTo}, ${yearFrom}`
			} else {
				return `${monthNames[monthFrom]} ${dayFrom} - ${monthNames[monthTo]} ${dayTo}, ${yearFrom}`
			}

		} else {
			return `${monthNames[monthFrom]} ${dayFrom}, ${yearFrom}`
		}

	}

	static normalizeDate(y, m, d) {
		y += Math.floor(m / 12)
		m = Math.abs((m + 12) % 12)

		let daysInMonth = DateMethods.getDaysInMonth(y, m)
		if (d > daysInMonth) {
			console.log('if', y, m, '|',  daysInMonth)
			m ++
			d -= daysInMonth
		} else if (d < 1) {
			m --
			[y, m] = DateMethods.normalizeDate(y, m, 1)
			daysInMonth = DateMethods.getDaysInMonth(y, m)
			console.log('else if', y, m, '|',  daysInMonth)
			d += daysInMonth
		} else {
			return [y, m, d]
		}
		return DateMethods.normalizeDate(y, m, d)
	}

	static getDaysInMonth(y, m) {
		const monthDays = {}
		for (let n = 0; n < 12; n ++) {
			if (n === 1) { // February
				monthDays[n] = DateMethods.isLeapYear(y)
						? 29
						: 28
			} else if (n < 7) { // before August
				monthDays[n] = n % 2 === 0
					? 31
					: 30
			} else {
				monthDays[n] = n % 2 !== 0
					? 31
					: 30
			}
		}
		return monthDays[m]
	}

	static isLeapYear(y) {
		return (y % 4 === 0 && y % 100 !== 0) || (y % 400 === 0)
	}
}

export default DateMethods
