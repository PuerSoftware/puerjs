import $       from '../../index.js'
import * as ui from '../../ui/index.js'

import IndexPage       from './class.IndexPage.js'
import ComponentsPage  from './class.ComponentsPage.js'
import MenuHeader      from './class.MenuHeader.js'

$.application(
	class App extends $.App {
		render() {
			return $.div([
				$.div('header', [
					$.h2({text: 'PuerJS'}),
					$.MenuHeader()
				]),
				$.IndexPage({
					route          : 'page:index',
					isDefaultRoute : true
				}),
				$.ComponentsPage({
					route: 'page:component'
				}),
			])
		}
	}, import.meta.url,
	() => {
		$.DataSource.define('Ports').fill([
			{ value: '1', port: 'Port1', code: 'UA', country: 'Ukraine'},
			{ value: '2', port: 'Port2', code: 'UA', country: 'Ukraine'},
			{ value: '3', port: 'Port3', code: 'UA', country: 'Ukraine'},
			{ value: '4', port: 'Port4', code: 'UA', country: 'Ukraine'},
		])
	}
)