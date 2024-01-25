import $ from '../../index.js'

export default class Code extends $.Component {
    constructor(...args) {
        super(...args)
        this.props.default( 'lang',        'js'     )
        this.props.default( 'code',        ''       )
        this.props.default( 'lineNumbers', true     )
        this.props.default( 'theme',       'prism'  )
        this.props.default( 'version',     '1.25.0' )

        const cdn            = 'https://cdnjs.cloudflare.com/ajax/libs/prism/1.25.0'
        const cssCdn         = `${cdn}/themes/${this.props.theme}.min.css`
        const jsCdn          = `${cdn}/prism.min.js`
        const langCdn        = `${cdn}/components/prism-${this.props.lang}.min.js`

        const urls = [cssCdn, jsCdn, langCdn]

        if (this.props.lineNumbers) {
            urls.push(`${cdn}/plugins/line-numbers/prism-line-numbers.min.css`)
            urls.push(`${cdn}/plugins/line-numbers/prism-line-numbers.min.js`)
        }
        $.Html.loadBatch(urls, this._onLoad.bind(this))
    }

    onPropCodeChange(code) {
    	console.log(this.props.code)
    }

    _onLoad(success) {
    	if (success) {
    		if (this.props.code) {
		    	const code = Prism.highlight(
		    		this.props.code,
		    		Prism.languages[this.props.lang],
		    		this.props.lang
		    	)
		    	this.$$.code[0].element.innerHTML = code
		    	this.props.lineNumbers && Prism.highlightAll()
		    }
	    } else {
	    	console.error('There were errors loading Prism code api')
	    }
    }

    render() {
        const langClass    = `language-${this.props.lang.toLowerCase()}`
        const lineNumClass = this.props.lineNumbers ? 'line-numbers' : ''
        return $.pre([$.code(`${langClass} ${lineNumClass}`)])
    }
}

$.define(Code)
