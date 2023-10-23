import PuerState from '../../../core/class.PuerState.js'
import PuerTest  from '../../../core/class.PuerTest.js'

/*************************************************************/
const Tests_PuerState = {
	result: null,

	setup: () => {
		Tests_PuerState.result = null
		return new PuerState((prop, oldValue, newValue) => {
			if (oldValue !== newValue) {
				Tests_PuerState.result = prop + '_' + newValue
			}
		})
	},

	testSquareBracketAccessors: (state) => {
		 new PuerTest('State [] accessors', {
			 '[] accessor set/get new key': [() => {
                state['foo1'] = 'bar1'
                return [state['foo1'], Tests_PuerState.result]
            },  ['bar1', 'foo1_bar1']],
            '[] accessor set/get existing key': [() => {
                state['foo1'] = 'bar1a'
                return [state['foo1'], Tests_PuerState.result]
            },  ['bar1a', 'foo1_bar1a']],
            '[] accessor delete': [() => {
                delete state['foo3']
                return state['foo3']
            },  undefined],
        }).run()
	},

	testDotAccessors: (state) => {
		 new PuerTest('State dot accessors', {
            'dot accessor set/get new key': [() => {
                state.foo1 = 'bar1'
                return [state.foo1, Tests_PuerState.result]
            },  ['bar1', 'foo1_bar1']],
			'dot accessor set/get existing key': [() => {
                state.foo1 = 'bar1a'
                return [state.foo1, Tests_PuerState.result]
            },  ['bar1a', 'foo1_bar1a']],
            'dot accessor delete': [() => {
                delete state.foo1
                return state.foo1
            },  undefined],
        }).run()
	}
}