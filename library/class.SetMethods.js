export default class SetMethods {
	static or(s1, s2) {
		return new Set([... s1, ... s2])
	}

    static xor(s1, s2) {
		const s = new Set()
		for (const item of SetMethods.or(s1, s2)) {
			if (!s1.has(item) || !s2.has(item)) {
				s.add(item)
			}
		}
		return s
	}

	static and(s1, s2) {
        const s = new Set()
        for (const item of s1) {
            if (s2.has(item)) {
                s.add(item)
            }
        }
        return s
    }
}