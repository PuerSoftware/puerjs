class ReferenceOwner {
	constructor(owner, prop, updateMethod) {
		this.owner  = owner
		this.prop   = prop
		this.update = owner[updateMethod].bind(owner)
	}
}

export default ReferenceOwner