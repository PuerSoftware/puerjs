class PuerProxyPlugin {
	constructor() {
	}

	engage(target, proxy, handler) {
		this.target  = target
		this.proxy   = proxy
		this.handler = handler
	}

	get() {
		return undefined
	}

	set() {
		return false
	}
}

export default PuerProxyPlugin