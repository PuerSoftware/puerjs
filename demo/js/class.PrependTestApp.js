import Puer, {PuerComponent} from '../../puer.js'

class PrependTestApp extends PuerComponent {
	constructor(props, children) {
		super(props, children)
	}

	_renderLi(e) {
		this.prepend(
			li({text: this.children.length}, [
				div([
					h1({text: 'li txt'})
				])
			])
		)
	}

	render() {
		return div([
			button({text: 'Add li', onclick: this._renderLi}),
			ul({text: 'Test li list'},[this.children])
		])
	}
}

Puer.define(PrependTestApp)
export default PrependTestApp