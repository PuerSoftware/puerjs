import $ from '../../index.js'


export default class IndexPage extends $.Component {
	render() {
		return $.div({text: 'IndexPage'})
	}
}

$.define(IndexPage, import.meta.url)