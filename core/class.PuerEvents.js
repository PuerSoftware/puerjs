import Puer from './class.Puer.js'


class PuerEvents extends EventTarget {
	static instance = null

	constructor() {
		if (!PuerEvents.instance) {
			super()
			this.socket            = null
			this.cache             = []
			this.is_connecting     = false
			this.is_connected      = false
			this._listenerMap      = new WeakMap()
			PuerEvents.instance    = this
			Puer.Event.SYS_CONFIRM = 'SYS_CONFIRM'
		}
		return PuerEvents.instance
	}

	/********************** PRIVATE **********************/

	_cache(name, data) {
		this.cache.push({
			name : name,
			data : data
		})
	}

	_uncache() {
		this.cache.forEach((event) => {
			this.send(event.name, event.data)
		})
		this.cache = []
	}

	/*********************** PUBLIC ***********************/

	connect(endpoint) {
		this.is_connecting = true
		this.socket = new WebSocket(endpoint)

		this.socket.onopen = () => {
			this.is_connected  = true
			this.is_connecting = false
			this._uncache()
		}

		this.socket.onmessage = (event) => {
			const data = JSON.parse(event.data)
			console.log('Received event: ', data.name, data.data)
	
			if (Array.isArray(data.data)) {
				data.data.forEach((item) => {
					this.trigger(data.name, item)
				})
			} else {
				this.trigger(data.name, data.data)
			}
			this.send(Puer.Event.SYS_CONFIRM, {name: data.name, key: data.key})
		}

		this.socket.onclose = (event) => {
			console.log('WebSocket connection closed:', event)
		}
	}

	once(name, f) {
		this.on(name, f, true)
	}

	on(name, f, once=false) {
		let _f = (e) => { return f(e.type, e.detail) }
		this._listenerMap.set(f, _f)
		this.addEventListener(name, _f, {once: once})
	}

	off(name, f) {
		let _f = this._listenerMap.get(f)
		this.removeEventListener(name, _f)
	}

	trigger(name, data) {
		this.dispatchEvent(new CustomEvent(name, { detail: data }))
	}

	send(name, data) {
		if (!this.is_connected) {
			if (this.connecting) {
				this._cache(name, data)
			} else {
				throw new Puer.Error('Puer.Events.connect() must be called prior to sending events', this, 'send')
			}
		} else {
			console.log('Sent event:', name, data)
			this.socket.send(JSON.stringify({ 'name' : name, 'data' : data }))
		}
	}

	define(events) {
		for (const event of events) {
			Puer.Event[event] = event
		}
	}
}

export default PuerEvents