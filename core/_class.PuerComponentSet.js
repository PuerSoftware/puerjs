import PuerProxyArray, {PuerProxyArrayPlugins} from './class.PuerProxyArray.js'


class PuerComponentSet extends PuerProxyArray {
	constructor(components, onChange) {
		console.log(components)
		super(components, [
			new PuerProxyArrayPlugins.MethodDecorator({}),
			new PuerProxyArrayPlugins.IndexAccessorDecorator(
				null,
				function (f, n, value) {
					const oldLength = this.length
					f(value)
					if (this.length !== oldLength) {
						onChange()
					}
				}
			),
			new PuerProxyArrayPlugins.ChainOperator({
				$   : 'getImmediateChainDescendants',
				$$  : 'getChainDescendants',
				$$$ : 'getChainAncestor'
			})
		])
	}
}

export default PuerComponentSet