class ObjectMethods {
	static compare(o1, o2) {
		return o1 === o2 || JSON.stringify(o1) === JSON.stringify(o2)
	}

	static deepCopy(o) {
		return JSON.parse(JSON.stringify(o))
	}

	static select(o, ss) {
		ss.split && (ss = ss.split('.'))
		const f = ObjectMethods.select
		let r = []
		if (ss.length) {
			const s = ss.shift()
			if (s === '*') {
				for (const k in o) {
					r = r.concat(f(o[k], [... ss]))
				}
			} else {
				r = f(o[s], [... ss])
				if (r === undefined)        { r = []  }
				else if (!Array.isArray(r)) { r = [r] }
			}
		} else {
			r = o
		}
		return r
	}
}

export default ObjectMethods