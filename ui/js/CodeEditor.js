import $ from '../../index.js'

export default class CodeEditor extends $.Component {
    constructor(...args) {
        super(...args)
        this.props.default( 'lang',    ''       )
        this.props.default( 'code',    ''       )
        this.props.default( 'theme',   'prism'  )
        this.props.default( 'version', '1.25.0' )

        const cdn      = `https://cdnjs.cloudflare.com/ajax/libs/${this.props.theme}/${this.props.version}`
        const cdnCss   = `${cdn}/themes/${this.props.theme}.min.css`
        const cdnJs    = `${cdn}/${this.props.theme}.min.js`
        const cdnLang  = `${cdn}/components/${this.props.theme}-${this.props.lang}.min.js`
        const urls     = [cdnCss, cdnJs, cdnLang]

        $.Html.loadBatch(urls, this._onLoad.bind(this))
    }

    _onLoad(success) {
        if (this.props.code) {
            this.highlightCode(this.props.code)
            this.updateLineNumbers(this.props.code)
        }
        if (this.props.code === '') {
            $.defer(() => {
                this.codeInput.element.focus()
            })
        }
    }

    onPropCodeChange(code) {
        this.highlightCode(code)
        this.updateLineNumbers(code)
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
        this.props.code = event.target.value
    }

    onCodeSave(event) {
        console.log('Code saved:', this.props.code)
    }

    onKeydown(event) {
        if ($.Constants.KeyCodeToKey[event.keyCode] === 'TAB') {
            event.preventDefault()
            const codeInputElement = this.codeInput.element
            const start            = codeInputElement.selectionStart
            const end              = codeInputElement.selectionEnd
            const text             = codeInputElement.value

            codeInputElement.value          = text.substring(0, start) + '\t' + text.substring(end)
            codeInputElement.selectionStart = codeInputElement.selectionEnd = start + 1
            this.props.code = codeInputElement.value
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

    render() {
        const langClass    = `language-${this.props.lang.toLowerCase()}`
        return $.Columns([
            $.Columns('container', [
                this.lineNumbers = $.div('line-numbers'),
                $.Columns('editor', [
                    this.codeInput = $.textarea('code-input', {
                        text      : this.props.code,
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

$.define(CodeEditor, import.meta.url)
