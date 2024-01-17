import $ from '../../index.js'


class Link extends $.Component {
	constructor(... args) {
		super(... args)
		this._linkSet = null
	}

	navigate() {
		if (this._linkSet) {
			this._linkSet.select(this)
		}
		this.route(this.props.hash)
		if (this.props.f) {
			this.props.callback(this)
		}
	}

	_pathToHash(path) {
		const hashes = []
		for (const p of path) {
			let hash = `${p.name}:${p.value}`
			let childrenHash = this._pathToHash(p.routes)

			if (childrenHash) {
				hash += '[' + childrenHash + ']'
			}

			hashes.push(hash)
		}
		return  hashes.join(',')
	}

	set selected(select) {
		select
			? this.addCssClass('selected')
			: this.removeCssClass('selected')
	}

	onRoute(path) {
		this.selected = this._pathToHash(path).includes(this.props.hash)
	}

	onInit() {
		this._linkSet = this.$$$.LinkSet[0]
		if (this._linkSet) {
			this.onRoute = null
		}
	}

	render() {
		return $.div({onclick : this.navigate}, [
			$.a ({text : this.props.label})
		])
	}
}

$.define(Link, import.meta.url)
export default Link