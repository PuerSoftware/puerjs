class PuerError extends Error {
	constructor(message, className, methodName) {
		message = `${className}.${methodName}(): ${message}`
		super(message)
		this.name = 'PuerError'
	}
}
export default PuerError