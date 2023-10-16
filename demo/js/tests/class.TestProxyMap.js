import PuerProxyMap from '../../../core/class.PuerProxyMap.js'
import PuerTest     from '../../../core/class.PuerTest.js'


class TestProxyMap extends PuerProxyMap {
	constructor(obj, decorators) {
		super(obj, decorators)
	}
}

const obj = {
    foo1   : 'bar1',
    foo2   : 'bar,2'
}

/*************************************************************/

const Tests_ProxyMap_NoDecorator = {
    result : null,

    setupMap: () => {
        Tests_ProxyMap_NoDecorator.result = null
        return new TestProxyMap(obj, {})
    },

    testMethodsAddedToMap: (map) => {
        new PuerTest('Methods added to Map', {
            'map.toMap()': [() => {
                return  map.toMap()
            },  new Map(Object.entries(obj))],
            'map.toObject()': [() => {
                return  map.toObject()
            },  obj],
            'map.toString()': [() => {
                return  map.toString()
            },  "{foo1: 'bar1', foo2: 'bar,2'}"]
        }).run()
    },

    testExistingMapMethods: (map) => {
        new PuerTest('Existing map methods', {
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
    },

    testMapIterators: (map) => {
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
    },

    testMapSquareBracketAccessors: (map) => {
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
    },

    testMapDotAccessors: (map) => {
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
}

/*************************************************************/

const Test_ProxyMap_TrapDecorator = {
    result : null,

    setupMap: () => {
        Test_ProxyMap_TrapDecorator.result = null

        return new TestProxyMap(obj, {
            get: (f, prop) => {
                const res = f(prop)
                if (res) {
                    return 'get_' + res
                }
                return res
            },
            set: (f, prop, value) => {
                value = 'set_' + value
                return f(prop, value)
            },
            delete: (f, prop) => {
                Test_ProxyMap_TrapDecorator.result = 'deleted'
                return f(prop)
            }
        })
    },

    testMethodsAddedToMap: (map) => {
        new PuerTest('Methods added to Map', {
            'map.toMap()': [() => {
                return  map.toMap()
            },  new Map(Object.entries(obj))],
            'map.toObject()': [() => {
                return  map.toObject()
            },  obj],
            'map.toString()': [() => {
                return  map.toString()
            },  "{foo1: 'bar1', foo2: 'bar,2'}"]
        }).run()
    },

    testExistingMapMethods: (map) => {
        new PuerTest('Existing map methods', {
            'map.get() existing key': [() => {
                return map.get('foo1')
            },  'get_bar1'],
            'map.set() existing key': [() => {
                map.set('foo1', 'bar1b')
                return map.get('foo1')
            },  'get_set_bar1b'],
            'map.set() new key': [() => {
                map.set('foo3', 'bar3')
                return map.get('foo3')
            },  'get_set_bar3'],
            'map.delete() existing key': [() => {
                map.delete('foo3')
                return Test_ProxyMap_TrapDecorator.result
            }, 'deleted']
        }).run()
    },

    testMapIterators: (map) => {
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
    },

    testMapSquareBracketAccessors: (map) => {
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
                 return Test_ProxyMap_TrapDecorator.result
            },  'deleted'],
        }).run()
    },
    
    testMapDotAccessors: (map) => {
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
                return Test_ProxyMap_TrapDecorator.result
            },  'deleted'],
        }).run()
    }
}
	
/*************************************************************/

export function testProxyMap_NoPlugins() {
    const T_NP = Tests_ProxyMap_NoDecorator

	let map = T_NP.setupMap()
    T_NP.testMethodsAddedToMap(map)

    map = T_NP.setupMap()
    T_NP.testExistingMapMethods(map)

    map = T_NP.setupMap()
    T_NP.testMapIterators(map)

	map = T_NP.setupMap()
    T_NP.testMapSquareBracketAccessors(map)
	
	map = T_NP.setupMap()
    T_NP.testMapDotAccessors(map)	
}

/*************************************************************/

export function testProxyMap_TrapDecorator() {
    const T_TD = Test_ProxyMap_TrapDecorator

    let map = T_TD.setupMap()
    T_TD.testMethodsAddedToMap(map)
    
    map = T_TD.setupMap()
    T_TD.testExistingMapMethods(map)
    
    map = T_TD.setupMap()
    T_TD.testMapIterators(map)

    map = T_TD.setupMap()
    T_TD.testMapSquareBracketAccessors(map)
    
    map = T_TD.setupMap()
    T_TD.testMapDotAccessors(map)
    
}

/*************************************************************/
