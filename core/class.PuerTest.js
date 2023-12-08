import $ from './class.Puer.js'


class PuerTest {
    constructor(name, tests) {
        this.name   = name
        this.tests  = tests
        this.length = Object.keys(tests).length
    }

    run() {
        let successCount = 0
        console.log('%c' + $.String.titleDivider(`${this.name} (${this.length})`, 50), 'font-weight: bold; color:white')
        for (const testName in this.tests) {
            this._run(
                testName,
                this.tests[testName][0],
                this.tests[testName][1]
            ) && successCount ++
        }
        const failedCount = this.length - successCount
        
        if (failedCount) {
            console.info(`%cFailed ${failedCount} of ${this.length}`, 'color: #FF6666')
        } else {
            console.info(`%cPassed ${successCount} of ${this.length}`, 'color: #66FF66')
        }
    }

    _code(fn) {
        const fnStr = fn.toString()
        const start = fnStr.indexOf('{') + 1
        const end   = fnStr.lastIndexOf('}')
        return '\t' + fnStr
            .slice(start, end)
            .trim()
            .split('\n')
            .map(str => str.trim())
            .join('\n\t')
    }

    _json(o) {
        const replacer = (key, value) =>
            value === undefined ? undefined : value
        return JSON.stringify(o, replacer)
    }

    _run(testName, expression, expected) {
        const output  = expression()
        const success = $.Object.compare(output, expected)
        if (success) {
            console.log('%cOK:', 'color: #66CC66', testName)
        } else {
            console.log('%cNOT OK:', 'color: #CC6666', testName)
            console.log('%c' + this._code(expression), 'color: #3399CC; font-style: italic')
            console.log(`${this._json(output)} !== ${this._json(expected)}`)
        }
		return success
    }

}

export default PuerTest