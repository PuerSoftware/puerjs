class PuerNamespace {
	static define(cls) {
		this[cls.name] = cls
	}

	static defineNamespace(name) {
		this[name] = PuerNamespace
		this[name].namespace = name
	}
}

export default PuerNamespace