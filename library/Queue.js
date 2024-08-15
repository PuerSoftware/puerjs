export default class Queue {
	constructor() {
		this.q = []
	}

	dequeue() {
		const o = this.q.shift()
		o && o.func(... o.args)
	}

	enqueue(f, context, args) {
		this.q.push({
			func: f.bind(context),
			args: args
		})
	}

	isEmpty() {
		return this.q.length === 0
	}
}