import PuerChainableSet from './class.PuerChainableSet.js'

class PuerComponentSet {
	constructor(items, onChange) {
		return new PuerChainableSet(items, onChange, {
			$   : 'getImmediateChainDescendants',
			$$  : 'getChainDescendants',
			$$$ : 'getChainAncestor'
		})
	}
}

export default PuerComponentSet