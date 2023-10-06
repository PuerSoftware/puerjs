class PuerError extends Error {
	constructor(message, className, methodName) {
		const where = className && methodName ? `${className}.${methodName}(): '` : ''
		message = `${where}${message}`
		super(message)
		this.name = 'PuerError'
	}
}
export default PuerError