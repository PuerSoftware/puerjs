import PuerProxy from '../../../core/class.PuerProxy.js'
import PuerTest  from '../../../core/class.PuerTest.js'


const obj = {
	 foo1   : 'bar1',
	 foo2   : 'bar,2'
}

/*************************************************************/

const Tests_PuerState = {
	result: null,

	setup: () => {
		return new PuerProxy(
			{foo1: 'bar1', foo2: 'bar,2'},
			(prop, oldValue, newValue) => {
				Tests_PuerState.result = [prop, oldValue, newValue]
			}
		)
	},

	testSquareBracketAccessors: (state) => {
		 new PuerTest('State [] accessors', {
            '[] accessor get existing key': [() => {
                return state['foo1']
            },  'bar1'],
            '[] accessor set existing key': [() => {
                state['foo1'] = 'bar1b'
                return state['foo1']
            },  'bar1b'],
            '[] accessor set/get new key': [() => {
                state['foo3'] = 'bar3'
                return state['foo3']
            },  'bar3'],
            '[] accessor delete': [() => {
                delete state['foo3']
                return state['foo3']
            },  undefined],
        }).run()
	},

	testDotAccessors: (props) => {
		 new PuerTest('Props dot accessors', {
            'dot accessor get existing key': [() => {
                return props.foo1
            },  'bar1'],
            'dot accessor set existing key': [() => {
                props.foo1 = 'bar1b'
                return props.foo1
            },  'bar1b'],
            'dot accessor set/get new key': [() => {
                props.foo3 = 'bar3'
                return props.foo3
            },  'bar3'],
            'dot accessor delete': [() => {
                delete props.foo3
                return props.foo3
            },  undefined],
        }).run()
	},

	testIterators: (props) => {
		new PuerTest('Iterators', {
            'forEach': [() => {
                let counter = 0
                props.forEach(() => {
                    counter ++
                })
                return counter
            },  2],
            'for ... of': [() => {
                let counter = 0
                for (const [_, __] of props) {
                    counter ++
                }
                return counter
            },  2],
			 'for ... in': [() => {
                let counter = 0
                for (const _ in props) {
                    counter ++
                }
                return counter
            },  2]
        }).run()
	},

	testOperators: (props) => {
		new PuerTest('Operators', {
			'in': [() => {
				return ['foo1' in props, 'foo3' in props]
			}, [true, false]]
		}).run()
	},

	testAddedMethods: (props) => {
		new PuerTest('Added methods', {
            'props.toObject()': [() => {
                return  props.toObject()
            },  obj],
            'props.toString()': [() => {
                return  props.toString()
            },  "{foo1: 'bar1', foo2: 'bar,2'}"]
        }).run()
	},

	testOnChangeCallbacks: (state) => {
		 new PuerTest('onChange callbacks', {
            'set existing key': [() => {
                state.foo1 = 'bar1b'
                return Tests_PuerState.result
            },  ['foo1', 'bar1', 'bar1b']],
            'set new key': [() => {
                state.foo3 = 'bar3'
                return [state.foo3, Tests_PuerState.result]
            },  ['bar3', ['foo1', 'bar1', 'bar1b']]],
            'delete existing key': [() => {
                delete state.foo3
                return Tests_PuerState.result
            },  ['foo3', 'bar3', undefined]],
			 'delete undefined key': [() => {
                delete state.foo3
                return Tests_PuerState.result
            },  ['foo3', undefined, undefined]],
        }).run()
	},
}

/*************************************************************/

export default function testPuerState() {
	const T_PS = Tests_PuerState

	T_PS.testDotAccessors(T_PS.setup())
	T_PS.testSquareBracketAccessors(T_PS.setup())
	T_PS.testIterators(T_PS.setup())
	T_PS.testOperators(T_PS.setup())
	T_PS.testAddedMethods(T_PS.setup())
	T_PS.testOnChangeCallbacks(T_PS.setup())
}

