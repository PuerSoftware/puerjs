import PuerProxyMap, {PuerProxyMapPlugins} from '../../../core/class.PuerProxyMap.js'
import PuerTest                            from '../../../core/class.PuerTest.js'


class TestProxyMap extends PuerProxyMap {
	constructor(obj, plugins) {
		super(obj, plugins)
	}
}

const obj = {
    foo1: 'bar1',
    foo2: 'bar2'
}

function createTestProxyMap_NoPlugins() {
    return new TestProxyMap(obj, [])
}

function createTestProxyMap_KeyAccessorDecoratorPlugin() {
	return new TestProxyMap(obj, [
			new PuerProxyMapPlugins.KeyAccessorDecorator(
				function(f, prop) {
					const res = f(prop)
					if (res) {
						return 'get_' + res
					}
					return res
				},
				function(f, prop, value) {
					value = 'set_' + value
					return f(prop, value)
				}
			)
	])
}

function createTestProxyMap_PropertyDecoratorPlugin() {
	return new TestProxyMap(obj, [
			new PuerProxyMapPlugins.PropertyDecorator(
				function (f, prop) {
					return f(prop)
				},
				function (f, prop, value) {
					return f(prop, value)
				}
			)]
	)
}


export function testProxyMap_NoPlugins() {
		let map = createTestProxyMap_NoPlugins()

        new PuerTest('Methods added to Map', {
			'map.toMap()': [() => {
                return  map.toMap()
            },  new Map(Object.entries(obj))],
            'map.toObject()': [() => {
			    return  map.toObject()
            },  obj],
            'map.toString()': [() => {
			    return  map.toString()
            },  '{"foo1":"bar1","foo2":"bar2"}']
        }).run()

        map = createTestProxyMap_NoPlugins()

        new PuerTest('Map existing methods', {
            'map.get() existing key': [() => {
                return map.get('foo1')
            },  'bar1'],
            'map.set() existing key': [() => {
                map.set('foo1', 'bar1a')
                return map.get('foo1')
            },  'bar1a'],
            'map.set() new key': [() => {
                map.set('foo3', 'bar3')
                return map.get('foo3')
            },  'bar3'],
            'map.delete() existing key': [() => {
                map.delete('foo3')
                return map.get('foo3')
            }, undefined]
        }).run()

        map = createTestProxyMap_NoPlugins()

        new PuerTest('Map iterators', {
			'forEach': [() => {
				let counter = 0
				map.forEach(() => {
					counter ++
                })
                return counter
            },  2],
            'for ... of': [() => {
				let counter = 0
                for (const [_, __] of map) {
					counter ++
                }
				return counter
            },  2]
        }).run()

	map = createTestProxyMap_NoPlugins()

	new PuerTest('Map [] accessors', {
        '[] accessor get existing key': [() => {
            return map['foo1']
        },  'bar1'],
        '[] accessor set existing key': [() => {
            map['foo1'] = 'bar1b'
            return map['foo1']
        },  'bar1b'],
        '[] accessor set/get new key': [() => {
            map['foo3'] = 'bar3'
            return map['foo3']
        },  'bar3'],
        '[] accessor delete': [() => {
            delete map['foo3']
            return map['foo3']
        },  undefined],
    }).run()

	map = createTestProxyMap_NoPlugins()

	new PuerTest('Map dot accessors', {
        'dot accessor get existing key': [() => {
            return map.foo1
        },  'bar1'],
        'dot accessor set existing key': [() => {
            map.foo1 = 'bar1b'
            return map.foo1
        },  'bar1b'],
        'dot accessor set/get new key': [() => {
            map.foo3 = 'bar3'
            return map.foo3
        },  'bar3'],
        'dot accessor delete': [() => {
            delete map.foo3
            return map.foo3
        },  undefined],
	}).run()
}

export function testProxyMap_KeyAccessorDecoratorPlugin() {
	let map = createTestProxyMap_KeyAccessorDecoratorPlugin()

	new PuerTest('Map dot accessors', {
        'dot accessor get existing key': [() => {
            return map.foo1
        },  'get_bar1'],
        'dot accessor set existing key': [() => {
            map.foo1 = 'bar1b'
            return map.foo1
        },  'get_set_bar1b'],
        'dot accessor set/get new key': [() => {
            map.foo3 = 'bar3'
            return map.foo3
        },  'get_set_bar3'],
        'dot accessor delete': [() => {
            delete map.foo3
            return map.foo3
        },  undefined],
	}).run()

	map = createTestProxyMap_KeyAccessorDecoratorPlugin()

    new PuerTest('Map [] accessors', {
        '[] accessor get existing key': [() => {
            return map['foo1']
        },  'get_bar1'],
        '[] accessor set existing key': [() => {
            map['foo1'] = 'bar1b'
            return map['foo1']
        },  'get_set_bar1b'],
        '[] accessor set/get new key': [() => {
            map['foo3'] = 'bar3'
            return map['foo3']
        },  'get_set_bar3'],
        '[] accessor delete': [() => {
            delete map['foo3']
            return map['foo3']
        },  undefined],
    }).run()
}
