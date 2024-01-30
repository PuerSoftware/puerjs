class SetMethods {
	static union(s1, s2) {
		const s = new Set()
		for (const item of s1) { s.add(item) }
		for (const item of s2) { s.add(item) }
		return s
	}
    static difference(s1, s2) {
		const s = new Set()
		for (const item of SetMethods.union(s1, s2)) {
			if (!s1.has(item) || !s2.has(item)) {
				s.add(item)
			}
		}
		return s
	}

	static intersection(s1, s2) {
        const s = new Set()
        for (const item of s1) {
            if (s2.has(item)) {
                s.add(item)
            }
        }
        return s
    }
}

export default SetMethods
