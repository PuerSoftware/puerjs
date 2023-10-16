import PuerProps from '../../../core/class.PuerProps.js'
import PuerTest  from '../../../core/class.PuerTest.js'


const obj = {
	 foo1   : 'bar1',
	 foo2   : 'bar,2'
}

/*************************************************************/

const Tests_PuerProps = {
	result: null,

	setupProps: () => {
		return new PuerProps({foo1: 'bar1', foo2: 'bar,2'},
			() => {
				Tests_PuerProps.result = 'onSet'
			},
			() => {
				Tests_PuerProps.result = 'onDelete'
			}
		)
	},

	testPropsSquareBracketAccessors: (props) => {
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

	testPropsDotAccessors: (props) => {
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

	testPropsIterators: (props) => {
		new PuerTest('Props iterators', {
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

	testExistingPropsMethods: (props) => {
		new PuerTest('Existing Props methods', {
			'has': [() => {
				return [props.has('foo1'), props.has('foo3')]
			}, [true, false]]
		})
	},

	testMethodsAddedToProps: (props) => {
		new PuerTest('Methods added to Props', {
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
			'props.require': [() => {
				try {
					props.require('foo4')
				} catch (e) {
					return 'error'
				}
			}, 'error'],
			'props.extractEvents': [() => {
				props.onclick = () => {console.log('onclick')}
				const events = props.extractEvents(new PuerProps())
				return [props.onclick, 'click' in events]
			},  [undefined, true]]
        }).run()
	},

	testPropsOnChangeCallbacks: (props) => {
		 new PuerTest('Props dot accessors', {
            'set existing key': [() => {
                props.foo1 = 'bar1b'
                return [props.foo1, Tests_PuerProps.result]
            },  ['bar1b', 'onSet']],
            'set new key': [() => {
                props.foo3 = 'bar3'
                return [props.foo3, Tests_PuerProps.result]
            },  ['bar3', 'onSet']],
            'delete existing key': [() => {
                delete props.foo3
                return [props.foo3, Tests_PuerProps.result]
            },  [undefined, 'onDelete']],
			 'delete undefined key': [() => {
                delete props.foo3
                return [props.foo3, Tests_PuerProps.result]
            },  [undefined, 'onDelete']]
        }).run()
	},
}

/*************************************************************/

export function testPuerProps() {
	const T_PP_NOCM = Tests_PuerProps

	let props = T_PP_NOCM.setupProps()
	T_PP_NOCM.testPropsDotAccessors(props)

	props = T_PP_NOCM.setupProps()
	T_PP_NOCM.testPropsSquareBracketAccessors(props)

	props = T_PP_NOCM.setupProps()
	T_PP_NOCM.testPropsIterators(props)

	props = T_PP_NOCM.setupProps()
	T_PP_NOCM.testExistingPropsMethods(props)

	props = T_PP_NOCM.setupProps()
	T_PP_NOCM.testMethodsAddedToProps(props)

	props = T_PP_NOCM.setupProps()
	T_PP_NOCM.testPropsOnChangeCallbacks(props)
}