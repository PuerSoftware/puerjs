
class PuerNamespace {
	constructor(namespace) {
		this.namespace = namespace
	}

	static define(cls) {
		this[cls.name] = cls
	}

	static defineNamespace(name) {
		this[name] = new PuerNamespace(name)
	}
}