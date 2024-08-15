import StringMethods from './StringMethods.js'


export default class Html {

	static element(name, attrs, events, html) {
		const element = document.createElement(name)
		for (const key in attrs) {
			element.setAttribute(key, attrs[key])
		}
		for (const key in events) {
			element.addEventListener(key, events[key], false)
		}
		if (html) {
			element.innerHTML = html
		}
		return element
	}

	static load(url, onLoad, ext=null) {
		ext  = ext || StringMethods.ext(url)
		let attrs  = {}
		let events = {}
		let name   = ''

		if (onLoad) {
			events['load']  = () => { onLoad(true)  }
			events['error'] = () => { onLoad(false) }
		}

		switch (ext) {
			case 'js':
				name = 'script'
				attrs = { src: url }
				document.head.appendChild(Html.element(name, attrs, events))
				break
			case 'css':
				name = 'link'
				attrs = { type: 'text/css', rel: 'stylesheet', href: url}
				document.head.appendChild(Html.element(name, attrs, events))
				break
			case 'jpg':
			case 'jpeg':
			case 'png':
			case 'webp':
			case 'gif':
			default:
				console.log('not implemented')
				return null
		}
	}

	static loadBatch(urls, onLoad) {
		let counter = urls.length
		let success = true

		const callback = (good) => {
			counter --
			success = success ? good : false
			if (counter == 0) {
				onLoad(success)
			}
		}

		for (const url of urls) {
			Html.load(url, callback)
		}
	}

	static cssVar(varName) {
		const styles = getComputedStyle(document.documentElement)
		return styles.getPropertyValue(varName).trim()
	}

	static getSvgSize(base64) {
		base64 = base64.replace('data:image/svg+xml;base64,', '')
		const svgString = atob(base64)
		const parser    = new DOMParser()
		const svgDoc    = parser.parseFromString(svgString, 'image/svg+xml')
		const svg       = svgDoc.documentElement

		return [ svg.getAttribute('width'), svg.getAttribute('height') ]
	}
}
