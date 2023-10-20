import PuerState from '../../../core/class.PuerState.js'
import PuerTest  from '../../../core/class.PuerTest.js'

/*************************************************************/

const Tests_PuerState = {
	result: null,

	setup: () => {
		return new PuerState((prop, oldValue, newValue) => {
			if (oldValue !== newValue) {
				Tests_PuerState.result = prop
			}
		})
	},

	testSquareBracketAccessors: (state) => {
		 new PuerTest('Props [] accessors', {
			 '[] accessor set/get existing key': [() => {
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
	}
}