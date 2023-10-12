import PuerProxyMap, {PuerProxyMapPlugins} from '../../core/class.PuerProxyMap.js'


class TestProxyMap extends PuerProxyMap {
	constructor(onChange) {
		super({foo1: 'bar1', foo2: 'bar2'}, [
			new PuerProxyMapPlugins.KeyAccessorDecorator(
				function(f, prop) {
					console.log('getter through key accessor', prop)
				},
				function(f, prop, value) {
					console.log('setter through key accessor', prop, value)
				}
			),
			new PuerProxyMapPlugins.PropertyDecorator(
				null,
				function (f, prop, value) {
					const oldValue = this[prop]
					f(value)
					if (this[prop] !== oldValue) {
						onChange(prop, this[prop])
					}
				}
			)
		])
	}
}

export default TestProxyMap