
export default class WaitingQueue {
	constructor(isDone=null) {
		this.isDone     = isDone
		this.timeout    = 50
		this.q          = []
		this._isDone    = false
		this._isStarted = false
	}

	_poll() {
		setTimeout(() => {
			if (!this._checkDone()) {
				this._poll()
			}
		}, this.timeout)
	}

	_checkDone() {
		if (this.isDone && this.isDone()) {
			this.done()
			return true
		}
		return false
	}

	_dequeue() {
		for (const o of this.q) {
			o.func(... o.args)
		}
		this.q = []
	}

	enqueue(f, context, args) {
		this.q.push({
			func: f.bind(context),
			args: args
		})
		return this
	}

	done() {
		this._isDone    = true
		this._isStarted = false
		this._dequeue()
	}

	start() {
		if (!this._isStarted) {
			this._isStarted = true
			this._isDone    = false
			this.isDone && this._poll()
		}
	}
}