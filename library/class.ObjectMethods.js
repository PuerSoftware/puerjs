class ObjectMethods {
	static compare(o1, o2) {
		return o1 === o2 || JSON.stringify(o1) === JSON.stringify(o2)
	}

	static deepCopyPrimitive(o) {
		return JSON.parse(JSON.stringify(o))
	}
}

export default ObjectMethods