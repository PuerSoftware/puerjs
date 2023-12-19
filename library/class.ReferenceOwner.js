class ReferenceOwner {


	constructor(owner, prop, updateMethod) {
		this.owner        = owner
		this.prop         = prop
		this.updateMethod = updateMethod
	}

	update() {
		setTimeout(
			() => { this.owner[this.updateMethod](this.prop) }, 1
		)
	}
}

export default ReferenceOwner