import PuerChainableSet from '../../../core/class.PuerChainableSet.js'
import PuerTest         from '../../../core/class.PuerTest.js'


/*************************************************************/

const Tests_PuerComponentSet = {
	result: null,

	setup: () => {
		class PuerComponentSet {
			constructor(items, onChange) {
				return new PuerChainableSet(items, onChange)
			}
		}

		return new PuerComponentSet(
			['zero', 'one', 'two'],
			(prop, oldValue, newValue) => {
				Tests_PuerComponentSet.result = [prop, oldValue, newValue]
			})
	},

	testSquareBracketAccessors: (cset) => {
		 new PuerTest('Props [] accessors', {
            '[] accessor get existing key': [() => {
                return cset[1]
            },  'one'],
            '[] accessor set existing key': [() => {
                cset[1] = 'one1'
                return [cset[1], Tests_PuerComponentSet.result]
            },  ['one1', ['1', 'one', 'one1']]],
            '[] accessor set/get new key': [() => {
                cset[3] = 'three'
                return cset[3]
            },  'three'],
            '[] accessor delete': [() => {
                delete cset[3]
                return cset[3]
            },  undefined],
        }).run()
	},

	testIterators: (cset) => {
		new PuerTest('Iterators', {
            'forEach': [() => {
                let counter = 0
                cset.forEach(() => {
                    counter ++
                })
                return counter
            },  3],
            'for ... of': [() => {
                let counter = 0
                for (const _ of cset) {
                    counter ++
                }
                return counter
            },  3],
			 'for ... in': [() => {
                let counter = 0
                for (const _ in cset) {
                    counter ++
                }
                return counter
            },  3]
        }).run()
	},

	testOperators: (cset) => {
		new PuerTest('Operators', {
			'delete': [() => {
				delete cset[0]
				return cset.length
			}, 2]
		}).run()
	},

	testExistingMethods: (cset) => {
		new PuerTest('Existing methods', {
			'push': [() => {
				cset.push('three')
				return [cset[3], Tests_PuerComponentSet.result]
			}, ['three', ['3', undefined, 'three']]],
			'pop': [() => {
				return cset.pop()
			}, 'three'],
			'unshift': [() => {
				cset.unshift('minus one')
				return cset[0]
			}, 'minus one'],
			'shift': [() => {
				return cset.shift()
			}, 'minus one']
		}).run()
	},

	testAddedMethods: (cset) => {
		new PuerTest('Added methods', {
            'toArray()': [() => {
                return cset.toArray()
            },  ['zero', 'one', 'two']],
            'toString()': [() => {
                return cset.toString()
            },  "[zero, one, two]"]
        }).run()
	}
}

/*************************************************************/


const Tests_PuerComponentSet_Operators = {
	result: null,

	setup: () => {
		class PuerComponentSet {
			constructor(items, onChange) {
				return new PuerChainableSet(items, null, { $: 'getChildren' })
			}
		}

		class FakeComponent {
			constructor(name, children) {
				this.name     = name
				this.children = children || []
			}
			getChildren(s) { return this.children.filter(child => child.name.startsWith(s)) }
			toString()     { return this.name }
			get $ ()       { return new PuerComponentSet([this], null, { $: 'getChildren' }).$ }
		}

		const components = [
			new FakeComponent('a1', [
				new FakeComponent('b1', [
					new FakeComponent('c1'),
					new FakeComponent('c2')
				]),
				new FakeComponent('g1')
			]),
			new FakeComponent('a2', [
				new FakeComponent('b2', [
					new FakeComponent('c3'),
					new FakeComponent('c4')
				]),
				new FakeComponent('h1')
			])
		]

		return new PuerComponentSet(components)
	},

	testChain1: (cset) => {
		new PuerTest('Chain test 1', {
			'this.$.toString()': [() => {
				return cset.$.toString()
			}, '[a1, a2]']
		}).run()
	},

	testChain2: (cset) => {
		new PuerTest('Chain test 2', {
			'this.$.b.toString()': [() => {
				// console.log(cset.$)
				return cset.$.b.toString()
			}, '[b1, b2]'],
		}).run()
	},

	testChain3: (cset) => {
		new PuerTest('Chain test 3', {
			'this.$.b[0].toString()': [() => {
				// console.log(cset.$.b[0])
				return cset.$.b[0].toString()
			}, 'b1'],
		}).run()
	},

	testChain4: (cset) => {
		new PuerTest('Chain test 4', {
			'this.$.b[0].$.c.toString()': [() => {
				// console.log(cset.$.b[0].$)
				return cset.$.b[0].$.c.toString()
			}, '[c1, c2]'],
		}).run()
	}
}

/*************************************************************/

export default function testPuerComponentSet() {
	const T_PCS = Tests_PuerComponentSet

	T_PCS.testSquareBracketAccessors(T_PCS.setup())
	T_PCS.testIterators(T_PCS.setup())
	T_PCS.testOperators(T_PCS.setup())
	T_PCS.testExistingMethods(T_PCS.setup())
	T_PCS.testAddedMethods(T_PCS.setup())

	const T_PCS_O = Tests_PuerComponentSet_Operators

	T_PCS_O.testChain1(T_PCS_O.setup())
	T_PCS_O.testChain2(T_PCS_O.setup())
	T_PCS_O.testChain3(T_PCS_O.setup())
	T_PCS_O.testChain4(T_PCS_O.setup())
}




