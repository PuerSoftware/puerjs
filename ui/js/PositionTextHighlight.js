import $             from '../../index.js'
import TextHighlight from './TextHighlight.js'


export default class PositionTextHighlight extends $.Component {
    constructor(... args) {
        super(... args)
        this.props.require('srcText')        // String
        this.props.require('positions')     // {field: [position, length], ...}
        this.props.require('textClasses')  // {field: color, ...}

        this.state.highText = ''
    }

    _updateHighText() {
        const sep             = '```'
        const text            = this.props.srcText
        let positionsClasses = [] // [{position: pos, cssClass: class}, ...]
        const pieces          = []
        let highlightEnd      = 0
        let lastHighlight     = 0

        for (const key of Object.keys(this.props.positions)) {
            if (this.props.positions[key]) {
                    positionsClasses.push({
                    position : this.props.positions[key],
                    cssClass : this.props.textClasses[key]
                })
            }
        }

        positionsClasses.sort((a, b) => {
            return a.position[0] - b.position[0]
        })

        for (let n = 0; n < text.length; n++) {
            const highlight = positionsClasses[lastHighlight]
            if (!highlight) { break }
            const pos       = highlight.position
            const cssClass  = highlight.cssClass

            if (pos[0] === n) {
                pieces.push(text.slice(highlightEnd, n))
                highlightEnd = n + pos[1]
                const hText  = `${sep}[${cssClass}]${text.slice(n, highlightEnd)}${sep}`
                pieces.push(hText)
                lastHighlight ++
            }
        }
        pieces.push(text.slice(highlightEnd, text.length - 1 ))

        this.state.highText = pieces.join('')
    }

    onPropSrcTextChange()    { this._updateHighText() }
    onPropPositionsChange()  { this._updateHighText() }
    onPropTextClassesChange()    { this._updateHighText() }

    render() {
        return $.TextHighlight({
            text: this.state.highText
        })
    }

}

$.define(PositionTextHighlight, import.meta.url)
