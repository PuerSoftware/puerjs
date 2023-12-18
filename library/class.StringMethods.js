class StringMethods {
    static random(len) {
        let result = ''
        const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789'
        const charactersLength = characters.length;
        let counter = 0
        while (counter < len) {
            result += characters.charAt(Math.floor(Math.random() * charactersLength))
            counter += 1
        }
        return result
    }

    static capitalize(s) {
        return s.charAt(0).toUpperCase() + s.slice(1)
    }

    static camelToKebab(s) {
        return s.replace(/([a-zA-Z])(?=[A-Z])/g, '$1-').toLowerCase()
    }

    static camelToLower(s) {
        return s.charAt(0).toLowerCase() + s.slice(1)
    }

    static camelToUpper(s) {
        return s.charAt(0).toUpperCase() + s.slice(1)
    }

    static titleDivider(title, n = 20, ch = '=') {
        let pad = Math.floor((n - title.length - 2) / 2)
        return ch.repeat(pad) + ' ' + title + ' ' + ch.repeat(n - title.length - 2 - pad)
    }

    static isNumeric(s) {
        if (typeof s !== 'string') { return false } // we only process strings!  
        return !isNaN(s) &&                         // use type coercion to parse the _entirety_ of the string (`parseFloat` alone does not do this)...
            !isNaN(parseFloat(s))                   // ...and ensure strings of whitespace fail
    }

    static randomHex(len) {
        const digits = '0123456789ABCDEF'
        let hex = ''
        for (let i=0; i<len; i++) {
            hex += `${digits[Math.floor(Math.random() * 16)]}`
        }
        return hex
    }

    static decodeHtmlEntities(s) {
        const el = document.createElement('div')
        el.innerHTML = s
        return el.textContent || el.innerText  || ''
    }

    static stripTags(s) {
        return StringMethods.decodeHtmlEntities(s)
    }

    static splitWithDelimitersPreserved(str, delimiter) {
        const regex = new RegExp(delimiter, 'gi')
        const a            = str.split(regex)
        const result       = []
        let [len, dlen, s] = [0, delimiter.length, '']

        for (let n = 0; n < a.length * 2 - 1; n++) {
            if (n % 2) { // delimiter
                result.push(str.substring(len, len + dlen))
                len += dlen
            } else {
                s = a[Math.floor(n) / 2]
                len += s.length
                result.push(s)
            }
        }

        return result
    }
}

export default StringMethods