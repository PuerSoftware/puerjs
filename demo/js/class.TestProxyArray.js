import PuerProxyArray, {PuerProxyArrayPlugins} from '../../core/class.PuerProxyArray.js'


class Item {
	constructor(number) {
		this.value = `classItem-${number}`
	}
}

class ItemChain {
	constructor() {
		this.props = {}
	}
}

const indexPlugin = new PuerProxyArrayPlugins.IndexAccessorDecorator(
	function (f, n) {
		console.log('indexPlugin GETTER before', f, n)
		const result = f(n)
		console.log('indexPlugin GETTER after', result)
		return result
	},
	function (f, n, value) {
		console.log('indexPlugin SETTER before', f, n, value)
		f(value)
		console.log('indexPlugin SETTER after')
	}
)

const decoratorPlugin = new PuerProxyArrayPlugins.MethodDecorator({
	push: function (f, item) {
		console.log('decoratorPlugin PUSH before', f, item)
		const newLength = f(item)
		console.log('decoratorPlugin PUSH after', newLength)
		return newLength
	},
	pop: function (f) {
		console.log('decoratorPlugin POP before', f)
		const el = f()
		console.log('decoratorPlugin POP after', el)
		return el
	},
	// forEach: function (f, callback) {
	// 	console.log('decoratorPlugin forEach before', f, callback)
	// 	f(callback)
	// 	console.log('decoratorPlugin forEach after')
	// }
})

class TestProxyArray {
	constructor() {
		let items = []
		for (let n = 0; n < 10; n++) {
			items.push(new Item(n))
		}

		this.arrayProxy = new PuerProxyArray(items, [
			indexPlugin,
			decoratorPlugin
		])
	}

	testIndexPlugin() {
		console.log('====================')
		// getter test
		const oldValue = this.arrayProxy[1]
		console.log('testIndexPlugin.getter-test oldValue:', oldValue)
		console.log('--------------------')
		// setter test
		this.arrayProxy[1] = new Item(22)
		console.log('--------------------')
		// getter test
		const newValue = this.arrayProxy[1]
		console.log('testIndexPlugin.getter-test newValue:', newValue)
	}

	testDecoratorPlugin() {
		console.log('====================')
		// push test
		const newLength = this.arrayProxy.push(new Item(33))
		console.log('testDecoratorPlugin.push newLength:', newLength)
		console.log('--------------------')
		// pop test
		const item = this.arrayProxy.pop()
		console.log('testDecoratorPlugin.pop item:', item)
		console.log('--------------------')
		// forEach test
		this.arrayProxy.forEach((item) => {
			console.log('\ttestDecoratorPlugin.forEach', item)
		})
	}

	testDecoratorPluginAny() {

	}

	testChainPlugin() {

	}
}

export default TestProxyArray