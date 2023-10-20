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
}

export default StringMethods