class ObjectMethods {
	static compare(o1, o2) {
		if ((typeof o1 )!== (typeof o2)) {
			return false
		}
		switch (typeof o1) {
			case 'object':
				for (const key in o1) {
					if (!ObjectMethods.compare(o1[key], o2[key])) { return false }
				}
				return true
			default:
				return o1 === o2
		}
	}
}

export default ObjectMethods