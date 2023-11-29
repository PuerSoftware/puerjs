class ReferenceOwner {
	constructor(owner, prop, updateMethod) {
		this.owner        = owner
		this.prop         = prop
		this.updateMethod = updateMethod
	}

	update() {
		this.owner[this.updateMethod](this.prop)
	}
}

export default ReferenceOwner