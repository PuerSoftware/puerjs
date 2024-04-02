import $             from '../../index.js'
import TextHighlight from './class.TextHighlight.js'


export default class PositionTextHighlight extends $.Component {
    constructor(... args) {
        super(... args)
        this.props.require('srcText')      // String
        this.props.require('positions') // {field: [position, length], ...}
        this.props.require('colors')  // {field: color, ...}

        this.state.highText = ''
    }

    _updateHighText() {
        const sep             = '```'
        const text            = this.props.srcText
        let positionsColors = [] // [{position: pos, color: col}, ...]
        const pieces          = []
        let highlightEnd      = 0
        let lastHighlight     = 0

        for (const key of Object.keys(this.props.positions)) {
            positionsColors.push({
                position : this.props.positions[key],
                color    : this.props.colors[key]
            })
        }

        positionsColors.sort((a, b) => {
            return a.position[0] - b.position[0]
        })

        for (let n = 0; n < text.length; n++) {
            const highlight = positionsColors[lastHighlight]
            if (!highlight) { break }
            const pos       = highlight.position
            const color     = highlight.color

            if (pos[0] === n) {
                pieces.push(text.slice(highlightEnd, n))
                highlightEnd = n + pos[1]
                const hText  = `${sep}[${color}]${text.slice(n, highlightEnd)}${sep}`
                pieces.push(hText)
                lastHighlight ++
            }
        }
        pieces.push(text.slice(highlightEnd, text.length - 1 ))

        this.state.highText = pieces.join('')
    }

    onPropTextChange()      { this._updateHighText() }
    onPropPositionsChange() { this._updateHighText() }
    onPropColorsChange()    { this._updateHighText() }

    render() {
        return $.TextHighlight({
            text: this.state.highText
        })
    }

}

$.define(PositionTextHighlight, import.meta.url)