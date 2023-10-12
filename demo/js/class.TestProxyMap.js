import PuerProxyMap, {PuerProxyMapPlugins} from '../../core/class.PuerProxyMap.js'


class TestProxyMap extends PuerProxyMap {
	constructor(onChange) {
		super({foo1: 'bar1', foo2: 'bar2'}, [
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