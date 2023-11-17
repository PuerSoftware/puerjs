class DateMethods {
    static 	format(date) {
		date = new Date(date)
		let day   = date.getDate().toString().padStart(2, '0')
		let month = (date.getMonth() + 1).toString().padStart(2, '0') // Add 1 because months are zero-indexed
		let year  = date.getFullYear().toString().substr(-2)          // Get the last two digits of the year
		return `${day}.${month}.${year}`
	}
}

export default DateMethods
