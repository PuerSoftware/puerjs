import PuerProxyMap, {PuerProxyMapPlugins} from '../../../core/class.PuerProxyMap.js'
import PuerTest                            from '../../../core/class.PuerTest.js'


class TestProxyMap extends PuerProxyMap {
	constructor(obj, plugins) {
		super(obj, plugins)
	}
}

const obj = {
    foo1: 'bar1',
    foo2: 'bar,2'
}

/*************************************************************/

const Tests_ProxyMap_NoPlugins = {
    setupMap: () => {
        return new TestProxyMap(obj, [])
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

const Tests_ProxyMap_KeyAccessorDecoratorPlugin = {
    setupMap: () => {
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
    },

    testDecoratingDotAccessors: (map) => {
        new PuerTest('Decorating map dot accessors', {
            'decorate dot accessor get existing key': [() => {
                return map.foo1
            },  'get_bar1'],
            'decorate dot accessor set existing key': [() => {
                map.foo1 = 'bar1b'
                return map.foo1
            },  'get_set_bar1b'],
            'decorate dot accessor set/get new key': [() => {
                map.foo3 = 'bar3'
                return map.foo3
            },  'get_set_bar3'],
            'decorate dot accessor delete': [() => {
                delete map.foo3
                return map.foo3
            },  undefined],
        }).run()
    },

    testDecoratingSquareBracketAccessors: (map) => {
        new PuerTest('Map [] accessors', {
            'decorate [] accessor get existing key': [() => {
                return map['foo1']
            },  'get_bar1'],
            'decorate [] accessor set existing key': [() => {
                map['foo1'] = 'bar1b'
                return map['foo1']
            },  'get_set_bar1b'],
            'decorate [] accessor set/get new key': [() => {
                map['foo3'] = 'bar3'
                return map['foo3']
            },  'get_set_bar3'],
            'decorate [] accessor delete': [() => {
                delete map['foo3']
                return map['foo3']
            },  undefined],
        }).run()
    }
}


/*************************************************************/


const Test_ProxyMap_MethodDecoratorPlugin = {
    setupMap: () => {
        return new TestProxyMap(obj, [
            new PuerProxyMapPlugins.MethodDecorator({
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
                    f(prop)
                    return 'deleted'
                }
            })
        ])
    },

    testDecoratingGetAndSetMethods: (map) => {
        new PuerTest('Decorating get() and set() methods', {
            'decorate get(existing key)': [() => {
                return map.get('foo1')
            },  'get_bar1'],
            'decorate set(existing key)': [() => {
                map.set('foo1', 'bar1b')
                return map.get('foo1')
            },  'get_set_bar1b'],
            'decorate set(new key)/get(new key)': [() => {
                map.set('foo3', 'bar3')
                return map.get('foo3')
            },  'get_set_bar3'],
            'decorate delete(existing key)': [() => {
                let res = map.delete('foo3')
                return [res, map.get('foo3')]
            },  ['deleted', undefined]],
        }).run()
    }
}
	
/*************************************************************/

export function testProxyMap_NoPlugins() {
    const T_NP = Tests_ProxyMap_NoPlugins

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

export function testProxyMap_KeyAccessorDecoratorPlugin() {
    const T_KADP = Tests_ProxyMap_KeyAccessorDecoratorPlugin
    const T_NP   = Tests_ProxyMap_NoPlugins

	let map = T_KADP.setupMap()
    T_KADP.testDecoratingDotAccessors(map)	

	map = T_KADP.setupMap()
    T_KADP.testDecoratingSquareBracketAccessors(map)

    // Testing if plugin did not break existing functionality

    map = T_KADP.setupMap()
    T_NP.testMethodsAddedToMap(map)

    map = T_KADP.setupMap()
    T_NP.testExistingMapMethods(map)

    map = T_KADP.setupMap()
    T_NP.testMapIterators(map)

    // map = T_KADP.setupMap()
    // T_NP.testMapSquareBracketAccessors(map)

    // map = T_KADP.setupMap()
    // T_NP.testMapDotAccessors(map)   
}

/*************************************************************/

export function testProxyMap_MethodDecoratorPlugin() {
    const T_MDP = Test_ProxyMap_MethodDecoratorPlugin
    const T_NP  = Tests_ProxyMap_NoPlugins

    let map = T_MDP.setupMap()
    T_MDP.testDecoratingGetAndSetMethods(map)

    console.log('Testing if plugin did not break existing functionality:')

    map = T_MDP.setupMap()
    T_NP.testMethodsAddedToMap(map)

    map = T_MDP.setupMap()
    T_NP.testExistingMapMethods(map)

    map = T_MDP.setupMap()
    T_NP.testMapIterators(map)

    map = T_MDP.setupMap()
    T_NP.testMapSquareBracketAccessors(map)

    map = T_MDP.setupMap()
    T_NP.testMapDotAccessors(map) 
    
}

/*************************************************************/
