class ObjectMethods {
	static compare(o1, o2) {
		return o1 === o2 || JSON.stringify(o1) === JSON.stringify(o2)
	}
}

export default ObjectMethods