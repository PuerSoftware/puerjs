import PuerProps from '../../../core/class.PuerProps.js'
import PuerTest  from '../../../core/class.PuerTest.js'


const obj = {
	 foo1   : 'bar1',
	 foo2   : 'bar,2'
}

/*************************************************************/

const Tests_PuerProps = {
	result: null,

	onPropChange: (prop) => {
		Tests_PuerProps.result = prop
	},

	setup: () => {
		return new PuerProps(
			{foo1: 'bar1', foo2: 'bar,2'},
			'onPropChange',
			Tests_PuerProps
		)
	},

	testSquareBracketAccessors: (props) => {
		 new PuerTest('Props [] accessors', {
            '[] accessor get existing key': [() => {
                return props['foo1']
            },  'bar1'],
            '[] accessor set existing key': [() => {
                props['foo1'] = 'bar1b'
                return props['foo1']
            },  'bar1b'],
            '[] accessor set/get new key': [() => {
                props['foo3'] = 'bar3'
                return props['foo3']
            },  'bar3'],
            '[] accessor delete': [() => {
                delete props['foo3']
                return props['foo3']
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
            },  "{foo1: 'bar1', foo2: 'bar,2'}"],
			'props.default()': [() => {
				props.default('foo3', 'bar3')
				props.default('foo2', 'bar2a')
				return [props.foo3, props.foo2]
			}, ['bar3', 'bar,2']],
			'props.require for not existing prop': [() => {
				try {
					props.require('foo4')
				} catch (e) {
					return 'error'
				}
			}, 'error'],
			'props.require for existing prop': [() => {
				try {
					props.require('foo1')
				} catch (e) {
					return 'error'
				}
				return 'no error'
			}, 'no error'],
			'props.require for existing prop (func)': [() => {
				try {
					props.f = () => {}
					props.require('f')
				} catch (e) {
					return 'error'
				}
				return 'no error'
			}, 'no error'],
			'props.extractEvents': [() => {
				props.onclick = () => {console.log('onclick')}
				const events = props.extractEvents(new PuerProps())
				return [props.onclick, 'click' in events]
			},  [undefined, true]]
        }).run()
	},

	testOnChangeCallbacks: (props) => {
		 new PuerTest('onChange callbacks', {
            'set existing key': [() => {
                props.foo1 = 'bar1b'
                return Tests_PuerProps.result
            },  ['foo1', 'bar1', 'bar1b']],
            'set new key': [() => {
                props.foo3 = 'bar3'
                return Tests_PuerProps.result
            },  ['foo3', undefined, 'bar3']],
            'delete existing key': [() => {
                delete props.foo3
                return Tests_PuerProps.result
            },  ['foo3', 'bar3', undefined]],
			 'delete undefined key': [() => {
                delete props.foo3
                return Tests_PuerProps.result
            },  ['foo3', undefined, undefined]],
        }).run()
	},
}

/*************************************************************/

export default function testPuerProps() {
	const T_PP = Tests_PuerProps
	
	T_PP.testDotAccessors(T_PP.setup())
	T_PP.testSquareBracketAccessors(T_PP.setup())
	T_PP.testIterators(T_PP.setup())
	T_PP.testOperators(T_PP.setup())
	T_PP.testAddedMethods(T_PP.setup())
	T_PP.testOnChangeCallbacks(T_PP.setup())
}

