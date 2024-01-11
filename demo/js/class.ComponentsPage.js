import $ from '../../index.js'


export default class ComponentsPage extends $.Component {
	render() {
		return $.div({text: 'ComponentsPage'})
	}
}

$.define(ComponentsPage, import.meta.url)