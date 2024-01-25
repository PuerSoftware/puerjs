import $       from '../../index.js'
import * as ui from '../../ui/index.js'

import IndexPage       from './class.IndexPage.js'
import ComponentsPage  from './class.ComponentsPage.js'
import HeaderMenu      from './class.HeaderMenu.js'

$.application(
	class App extends $.App {
		setTheme(e) {
			document.body.classList.remove('dark-theme', 'light-theme')
			document.body.classList.add(e.targetComponent.value)
		}

		render() {
			return $.Rows([
				$.Columns('header', [
					$.Rows('left', [
						$.h2({text: 'PuerJS'}),
						$.HeaderMenu()
					]),
					$.Rows('right', [
						$.InputToggle({
							name     : 'theme',
							onChange : this.setTheme,
							selected : 'dark-theme',
							options  : [
								{value: 'dark-theme',  label: 'Dark'},
								{value: 'light-theme', label: 'Light'}
							]
						})
					])
				]),
				$.div('pages', [
					$.IndexPage({
						route          : 'page:index',
						isDefaultRoute : true
					}),
					$.ComponentsPage({
						route: 'page:component'
					})
				])
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