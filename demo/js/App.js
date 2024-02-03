import $       from '../../index.js'
import * as ui from '../../ui/index.js'

import IndexPage       from './class.IndexPage.js'
import ComponentsPage  from './class.ComponentsPage.js'
import HeaderMenu      from './class.HeaderMenu.js'

$.Constants.GOOGLE_MAPS_API_KEY = GOOGLE_MAPS_API_KEY

$.application(
	class App extends $.App {
		setTheme(e) {
			document.body.classList.remove('dark-theme', 'light-theme')
			document.body.classList.add(e.target.value)
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
		]),
		$.DataSource.define('Markers').fill([
			{ lat: 50.4504,  lng: 30.5245, label: 'Oleksii',   icon: 'vessel-icon-spot-project-hover'},
			{ lat: 50.9077,  lng: 34.7981, label: 'Alexander', icon: 'vessel-icon-eta'},
			{ lat: 49.4413,  lng: 32.0643, label: 'Ksenia',    icon: 'vessel-icon-fixed-dry-hover'},
			{ lat: 48.4816,  lng: 24.5819, label: 'Alex',      icon: 'vessel-icon-eta'},
			{ lat: 53.5488,  lng: 9.9872,  label: 'Ivan',      icon: 'vessel-icon-eta'},
			{ lat: 50.5791,  lng: 30.2151, label: 'Denys',     icon: 'vessel-icon-eta-wet-hover'},
		])
	}
)