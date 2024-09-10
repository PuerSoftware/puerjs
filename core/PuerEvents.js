import $              from './Puer.js'
import {WaitingQueue} from '../library/index.js'


class PuerEvents extends EventTarget {
	static Authorization = Settings
		? Settings.ACCESS_TOKEN || null
		: null
	static instance = null

	constructor(puer) {
		if (!PuerEvents.instance) {
			super()
			this.socket            = null
			this.outerQueue        = new WaitingQueue(() => { return this.isConnected }) // cashes events, that are waiting socket connection
			this.innerQueue        = new WaitingQueue(() => { return !$.isRouting && !$.isPreloading}) // cashes events, that are waiting end of routing
			this.isConnecting      = false
			this.isConnected       = false
			this._listenerMap      = new WeakMap()
			PuerEvents.instance    = this
		}
		return PuerEvents.instance
	}

	/*********************** PRIVATE ***********************/

	_validateEventDetail(name, detail) {
		const requiredProps = $.EventProps[name].concat(['targetName', 'target'])
		const props         = Object.keys(detail)
		const missingProps  = requiredProps.filter(x => !props.includes(x))

		if (missingProps.length > 0) {
			throw `Event detail ${name} is missing props: "${missingProps.join(', ')}"`
		}
		// const extraProps =  props.filter(x => !requiredProps.includes(x))
		// if (extraProps.length > 0) {
		// 	throw `Props "${extraProps.join(', ')}" are not defined in event details of "${name}"`
		// }
	}

	/*********************** PUBLIC ***********************/

	connect(endpoint, onOpen=null, onClose=null) {
		this.isConnecting = true
		if (PuerEvents.Authorization) {
			endpoint = `${endpoint}?token=${PuerEvents.Authorization}`
		}
		this.socket = new WebSocket(endpoint)

		this.socket.onopen = (event) => {
			this.isConnected  = true
			this.isConnecting = false
			onOpen && onOpen(event)
			console.log('Websocket connection open')
		}

		this.socket.onmessage = (event) => {
			const eventData = JSON.parse(event.data)
			const data      = eventData.data
			console.log('Received event: ', eventData.name, data)

			if (Array.isArray(data)) {
				data.forEach((item) => {
					this.trigger(eventData.name, item)
				})
			} else {

				data.targetName = 'backend'
				data.target     = {id: 0, isActiveEventTarget: true}
				this.trigger(eventData.name, data)
			}
		}

		this.socket.onclose = (event) => {
			onClose && onClose(event)
			console.log('WebSocket connection closed:', event)
		}
	}

	once(name, f) {
		this.on(name, f, null, true)
	}

	on(name, f, fKey=null, once=false) {
		fKey = fKey || f
		this._listenerMap.set(fKey, f)
		this.addEventListener(name, f, {once: once})
	}

	off(name, fKey) {
		let f = this._listenerMap.get(fKey)
		this.removeEventListener(name, f)
	}

	trigger(name, detail) {
		if (!this.innerQueue.isDone()) {
			this.innerQueue.enqueue(this.trigger, this, [name, detail]).start()
		} else {
			this._validateEventDetail(name, detail)
			this.dispatchEvent(new CustomEvent(name, { detail: detail }))
		}
	}

	send(name, data) {
		if (!this.isConnected) {
			if (this.isConnecting) {
				this.outerQueue.enqueue(this.send, this, [name, data]).start()
			} else {
				throw new $.Error('$.Events.connect() must be called prior to sending events', this, 'send')
			}
		} else {
			console.log('Sent event:', name, data)
			this.socket.send(JSON.stringify({ 'name' : name, 'data' : data }))
		}
	}

	define(name, props=null) { // TODO: Combine Event & Events
		$.Event[name]      = name
		$.EventProps[name] = props || []
	}
}

export default PuerEvents
