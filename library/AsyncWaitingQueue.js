export default class AsyncWaitingQueue {
	constructor() {
		this.q       = []
		this._isDone = true
	}

	_dequeueItem() {
		if (this.q.length) {
			const item = this.q.splice(0, 1)[0]
			item.func(... item.args)
		}
	}

	_dequeue() {
		this._dequeueItem()
		if (this.q.length) {
			this._isDone = false
		}
	}

	enqueue(f, context, args) {
		this.q.push({
			func: f.bind(context),
			args: args
		})
		return this
	}

	isDone(done) {
		if (done !== undefined) {
			this._isDone = done
			done && this._dequeue()
		} 
		return this._isDone
	}
}