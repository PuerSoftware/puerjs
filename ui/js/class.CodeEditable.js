import $ from '../../index.js'


export default class CodeEditable extends $.Component {
    constructor(...args) {
        super(...args)
        this.props.default( 'lang',    'html'   )
        this.props.default( 'code',    '<div id="1205"><h1 class="title" title="Hello World">Hello World</h1></div>')
        this.props.default( 'theme',   'prism'  )
        this.props.default( 'version', '1.25.0' )

        const cdn      = 'https://cdnjs.cloudflare.com/ajax/libs/prism/1.25.0'
        const cssCdn   = `${cdn}/themes/${this.props.theme}.min.css`
        const jsCdn    = `${cdn}/prism.min.js`
        const langCdn  = `${cdn}/components/prism-${this.props.lang}.min.js`

        const urls = [cssCdn, jsCdn, langCdn]

        $.Html.loadBatch(urls, this._onLoad.bind(this))

        this.state.codeEdited = this.props.code
    }

    _onLoad(success) { //TODO: loading check must be global
    	// if (success) {
    		if (this.props.code) {
                this.highlightCode(this.state.codeEdited)
                this.updateLineNumbers(this.state.codeEdited)
		    }
	    // } else {
	    // 	console.error('There were errors loading Prism code api')
	    // }
    }

    highlightCode(code) {
        const highlightedCode = Prism.highlight(
            code,
            Prism.languages[this.props.lang],
            this.props.lang
        )
        this.codeOutput.element.innerHTML = highlightedCode
    }

    onCodeChange(event) {
        this.state.codeEdited = event.target.value
        this.highlightCode(this.state.codeEdited)
        this.updateLineNumbers(this.state.codeEdited)
    }

    onCodeSave(event) {
        console.log('Code saved:', this.state.codeEdited) // Optionally, display a result in console
    }

    onKeydown(event) {
        if (event.key === 'Tab') {
            event.preventDefault()
            const codeInputElement = this.codeInput.element
            const start            = codeInputElement.selectionStart
            const end              = codeInputElement.selectionEnd
            const text             = codeInputElement.value

            codeInputElement.value          = text.substring(0, start) + '\t' + text.substring(end)
            codeInputElement.selectionStart = codeInputElement.selectionEnd = start + 1
            this.onCodeChange(event)
        }
    }

    updateLineNumbers(code) {
        const lines = code.split('\n').length
        let lineNumbersArr = []

        this.lineNumbers.element.innerHTML = ''
        for (let i = 1; i <= lines; i++) {
            lineNumbersArr.push($.div('line-number', {text : `${i}`}))
        }
        this.lineNumbers.append(lineNumbersArr)
    }
    // updateLineNumbers(code) {
    //     const lines = code.split('\n').length
    //     let lineNumbersHtml = ''

    //     for (let i = 1; i <= lines; i++) {
    //         lineNumbersHtml += `<div class="line-number">${i}</div>\n`
    //     }
    //     this.lineNumbers.element.innerHTML = lineNumbersHtml
    // }

    render() {
        const langClass    = `language-${this.props.lang.toLowerCase()}`
        return $.Columns([
            $.Columns('container', [
                this.lineNumbers = $.div('line-numbers'),
                $.Columns('editor', [
                    this.codeInput = $.textarea('code-input', {
                        text      : this.state.codeEdited,
                        oninput   : this.onCodeChange,
                        onblur    : this.onCodeSave,
                        onkeydown : this.onKeydown
                    }),
                    this.codeOutput = $.pre(`code-output ${langClass}`),
                ])
            ])
        ])
    }
}

$.define(CodeEditable, import.meta.url)
