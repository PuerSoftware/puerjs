import PuerProxy from './class.PuerProxy.js'


class PuerState extends PuerProxy {
	constructor(data, onChange, owner) {
		return super(data, onChange, owner, {
			set(target, prop, value) {
				target.setProp(prop, value)
				return true
			}
		})
	}

	setProp(prop, value) {
		const oldValue = this.data[prop]
			? this.data[prop]
			: null

		if (value.isReference) {
			this.data[prop]       = Puer.dereference(value)
			this.references[prop] = value
		} else {
			this.data[prop]       = value
			this.references[prop] = Puer.reference(this.data, prop)
		}

		this.references[prop].owners.add(owner)

		this.updateOwners(prop)
	}
}

export default PuerState