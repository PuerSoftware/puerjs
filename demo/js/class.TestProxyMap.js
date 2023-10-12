import PuerProxyMap, {PuerProxyMapPlugins} from '../../core/class.PuerProxyMap.js'


class TestProxyMap extends PuerProxyMap {
	constructor(onChange) {
		super({foo1: 'bar1', foo2: 'bar2'}, [
			new PuerProxyMapPlugins.KeyAccessorDecorator(
				function(f, prop) {
					return f(prop)
				},
				function(f, prop, value) {
					console.log('setter through key accessor', prop, value)
					return f(prop, value)
				}
			)
			// new PuerProxyMapPlugins.PropertyDecorator(
			// 	null,
			// 	function (f, prop, value) {
			// 		return f(prop, value)
			// 	}
			// )
		])
	}
}

export default TestProxyMap