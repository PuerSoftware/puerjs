import Puer      from './class.Puer.js'
import PuerProxy from './class.PuerProxy.js'

class PuerProps extends PuerProxy {
	constructor(props={}, onChange, owner) {
		return super(props, onChange, owner)
	}

	default(prop, defaultValue) {
		if (!this.data.hasOwnProperty(prop)) {
			this.setProp(prop, defaultValue)
		}
	}

	require(prop, owner) {
		if (!this.references.hasOwnProperty(prop)) {
			throw new Puer.Error(`Property "${prop}" is required but not set.`, owner || this, 'require')
		}
	}

	extractEvents(owner) {
		const events = {}
		for (const prop in this.references) {
			let value = this.references[prop].dereference()
			if (typeof value === 'function' && prop.startsWith('on')) {
				events[prop.substring(2).toLowerCase()] = value.bind(owner)
				delete this.references[prop]
			}
		}
		return events
	}

	pop(prop) {
		const value = this.references[prop] 
			? this.references[prop].dereference()
			: null
		delete this.references[prop]
		return value
	}
}

export default PuerProps