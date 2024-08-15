import PuerChainableSet from './PuerChainableSet.js'

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
