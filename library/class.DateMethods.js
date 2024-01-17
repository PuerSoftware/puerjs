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
}

export default DateMethods
