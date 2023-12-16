import $ from './class.Puer.js'


class PuerEvents extends EventTarget {
	static instance = null

	constructor(puer) {
		if (!PuerEvents.instance) {
			super()
			this.socket            = null
			this.outerCache        = [] // cashes events, that are waiting socket connection
			this.innerCache        = [] // cashes events, that are waiting end of routing
			this.isConnecting      = false
			this.isConnected       = false
			this.isAwaitingRouting = false
			this._listenerMap      = new WeakMap()
			PuerEvents.instance    = this
			puer.Event.SYS_CONFIRM = 'SYS_CONFIRM'

		}
		return PuerEvents.instance
	}

	/********************** PRIVATE **********************/

	_outerCache(name, data) {
		this.outerCache.push({
			name : name,
			data : data
		})
	}

	_outerUncache() {
		this.outerCache.forEach((event) => {
			this.send(event.name, event.data)
		})
		this.outerCache = []
	}
	_innerCache(name, data) {
		this.innerCache.push({
			name : name,
			data : data
		})
	}

	_innerUncache() {
		this.innerCache.forEach((event) => {
			this.trigger(event.name, event.data)
		})
		this.innerCache = []
	}

	_awaitEndOfRouting() {
		if ($.isRouting) {
			if (!this.isAwaitingRouting) {
				this.isAwaitingRouting = true
				setTimeout(this._awaitEndOfRouting.bind(this), 10)
			}
		} else {
			this.isAwaitingRouting = false
			this._innerUncache()
		}
	}

	/*********************** PUBLIC ***********************/

	connect(endpoint) {
		this.isConnecting = true
		this.socket = new WebSocket(endpoint)

		this.socket.onopen = () => {
			this.isConnected  = true
			this.isConnecting = false
			this._outerUncache()
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
			this.send($.Event.SYS_CONFIRM, {name: data.name, key: data.key})
		}

		this.socket.onclose = (event) => {
			console.log('WebSocket connection closed:', event)
		}
	}

	once(name, f) {
		this.on(name, f, true)
	}

	on(name, f, once=false) {
		let _f = (e) => { return f(e) }
		this._listenerMap.set(f, _f)
		this.addEventListener(name, _f, {once: once})
	}

	off(name, f) {
		let _f = this._listenerMap.get(f)
		this.removeEventListener(name, _f)
	}

	trigger(name, data) {
		if ($.isRouting) {
			this._innerCache(name, data)
			this._awaitEndOfRouting()
		} else {
			this.dispatchEvent(new CustomEvent(name, { detail: data }))
		}
	}

	send(name, data) {
		if (!this.isConnected) {
			if (this.connecting) {
				this._outerCache(name, data)
			} else {
				throw new $.Error('$.Events.connect() must be called prior to sending events', this, 'send')
			}
		} else {
			console.log('Sent event:', name, data)
			this.socket.send(JSON.stringify({ 'name' : name, 'data' : data }))
		}
	}

	define(events) {
		if ($.isArray(events)) {
			for (const event of events) {
				$.Event[event] = event
			}
		} else {
			$.Event[events] = events
		}
	}
}

export default PuerEvents