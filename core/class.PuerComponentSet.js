import PuerArrayProxy, {PuerArrayProxyPlugins} from './class.PuerArrayProxy.js'


class PuerComponentSet extends PuerArrayProxy {
	constructor(components, onChange) {
		super(components, [
			new PuerArrayProxyPlugins.MethodDecorator({}),
			new PuerArrayProxyPlugins.IndexAccessorDecorator(
				null,
				function (f, n, value) {
					const oldLength = this.length
					f(value)
					if (this.length !== oldLength) {
						onChange()
					}
				}
			),
			new PuerArrayProxyPlugins.ChainOperator({
				$   : 'getImmediateChainDescendants',
				$$  : 'getChainDescendants',
				$$$ : 'getChainAncestor'
			})
		])
	}
}

export default PuerComponentSet