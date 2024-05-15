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

	static snakeToKebab(s) {
		return s.toLowerCase().replace('_', '-')
	}

	static toKebab(s) {
		return s.toLowerCase().replace(' ', '-')
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

	static toInt(s) {
		return parseInt(('' + s).replace(/[^\d-]+/g, ''), 10)
	}

	static toFloat(s) {
		return parseFloat(('' + s).replace(/[^\d.-]+/g, ''))
	}

	static toUnits(s) {
		return ('' + s).replace(/^[^\d.-]*[\d.-]+/g, '')
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

	static ext(s) {
		const path = s.split(/[#?]/)[0]
		return path.match(/\.([0-9a-z]+)$/i)?.[1].toLowerCase()
	}

	static splitCaseSafe(str, delimiters, index=0) {
		if (index >= delimiters.length) {
			return str ? [{
				value   : str,
				isMatch : false
			}] : []
		}
		const delimiter    = delimiters[index]
		const regex        = new RegExp(delimiter, 'gi')
		const a            = str.split(regex)
		let result         = []
		let [len, dlen, s] = [0, delimiter.length, '']

		for (let n = 0; n < a.length * 2 - 1; n++) {
			if (n % 2) { // delimiter
				result.push({
					value   : str.substring(len, len + dlen),
					isMatch : true
				})
				len += dlen
			} else {
				s = a[Math.floor(n) / 2]
				len += s.length
				result = result.concat(StringMethods.splitCaseSafe(s, delimiters, index + 1))
			}
		}

		return result
	}

	static toQuery(o, array_encoder=null) {
		const params = new URLSearchParams()
		for (const key in o) {
			if (Array.isArray(o[key]) && array_encoder) {
				params.append(array_encoder(o[key]))
			} else {
				// Directly append key-value pair for non-array values
				params.append(key, o[key])
			}
		}
		return params.toString()
	}

	static fromQuery(q) {
		return Object.fromEntries(new URLSearchParams(q))
	}
}

export default StringMethods