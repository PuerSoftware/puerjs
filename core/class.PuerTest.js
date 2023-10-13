import Puer from './class.Puer.js'


class PuerTest {
    constructor(name, tests) {
        this.name  = name
        this.tests = tests
    }

    run() {
        let successCount = 0
        console.log(Puer.String.titleDivider(this.name, 40))
        for (const testName in this.tests) {
            this._run(testName, this.tests[testName][0], this.tests[testName][1]) && successCount ++
        }
        const failedCount = Object.keys(this.tests).length - successCount
        console.info('Successful :', successCount)
        if (failedCount) {
            console.warn('Failed     :', failedCount)
        } else {
            console.info('Failed     :', failedCount)
        }
    }

    _run(testName, expression, expected) {
        const output  = expression()
        const success = Puer.Object.compare(output, expected)

        if (success) {
            console.info(`OK: ${testName}`)
        } else {
            console.warn(`FAILED: ${testName}`, expression)
            console.warn(`${output} !== ${expected}`)
        }
		return success
    }

}

export default PuerTest