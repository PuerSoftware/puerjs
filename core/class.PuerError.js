class PuerError extends Error {
	constructor(message, className='', methodName='') {
		if (typeof className !== 'string') {
			className = className.constructor.name
		}
		const where = className && methodName ? `${className}.${methodName}(): '` : ''
		message = `${where}${message}`
		super(message)
		this.name = 'PuerError'
	}
}
export default PuerError