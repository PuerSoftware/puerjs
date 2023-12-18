import $              from './class.Puer.js'
import {WaitingQueue} from '../library/index.js'

class PuerEvents extends EventTarget {
	static instance = null

	constructor(puer) {
		if (!PuerEvents.instance) {
			super()
			this.socket            = null
			this.outerQueue        = new WaitingQueue(() => { return this.isConnected }) // cashes events, that are waiting socket connection
			this.innerQueue        = new WaitingQueue(() => { return !$.isRouting     }) // cashes events, that are waiting end of routing
			this.isConnecting      = false
			this.isConnected       = false
			this._listenerMap      = new WeakMap()
			PuerEvents.instance    = this
			puer.Event.SYS_CONFIRM = 'SYS_CONFIRM'

		}
		return PuerEvents.instance
	}

	/*********************** PUBLIC ***********************/

	connect(endpoint) {
		this.isConnecting = true
		this.socket = new WebSocket(endpoint)

		this.socket.onopen = () => {
			this.isConnected  = true
			this.isConnecting = false
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
			this.innerQueue.enqueue(this.trigger, this, [name, data]).start()
		} else {
			this.dispatchEvent(new CustomEvent(name, { detail: data }))
		}
	}

	send(name, data) {
		if (!this.isConnected) {
			if (this.isConnecting) {
				// this._outerCache(name, data)
				this.outerQueue.enqueue(this.send, this, [name, data]).start()
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