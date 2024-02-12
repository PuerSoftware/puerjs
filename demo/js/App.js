import $       from '../../index.js'
import * as ui from '../../ui/index.js'

import IndexPage       from './class.IndexPage.js'
import ComponentsPage  from './class.ComponentsPage.js'
import HeaderMenu      from './class.HeaderMenu.js'

$.Constants.GOOGLE_DYNAMIC_MAPS_API_KEY = GOOGLE_DYNAMIC_MAPS_API_KEY
$.Constants.GOOGLE_STATIC_MAPS_API_KEY  = GOOGLE_STATIC_MAPS_API_KEY

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
		])
		$.DataSource.define('Markers')

		$.DataSource.define('PieChart').fill([
			{ label: 'Label 1', value: '50%' },
			{ label: 'Label 2', value: '28%' },
			{ label: 'Label 3', value: '22%' },
		])
	},
	() => {
		const markers = [
			{ lat: 50.4504,  lng: 30.5245, label: 'Oleksii',   icons: { out: 'vessel-icon-spot', over: 'vessel-icon-spot-project', click: 'vessel-icon-spot-project-selected' }},
			{ lat: 50.9077,  lng: 34.7981, label: 'Alexander', icons: { out: 'vessel-icon-spot', over: 'vessel-icon-spot-project', click: 'vessel-icon-spot-project-selected' }},
			{ lat: 49.4413,  lng: 32.0643, label: 'Ksenia',    icons: { out: 'vessel-icon-spot', over: 'vessel-icon-spot-project', click: 'vessel-icon-spot-project-selected' }},
			{ lat: 48.4816,  lng: 24.5819, label: 'Alex',      icons: { out: 'vessel-icon-spot', over: 'vessel-icon-spot-project', click: 'vessel-icon-spot-project-selected' }},
			{ lat: 53.5488,  lng: 9.9872,  label: 'Ivan',      icons: { out: 'vessel-icon-spot', over: 'vessel-icon-spot-project', click: 'vessel-icon-spot-project-selected' }},
			{ lat: 50.5791,  lng: 30.2151, label: 'Denys',     icons: { out: 'vessel-icon-spot', over: 'vessel-icon-spot-project', click: 'vessel-icon-spot-project-selected' }}
		]

		for (const marker of markers) {
			marker.icons.out   = $.Html.cssVar('--svg-' + marker.icons.out)
			marker.icons.over  = $.Html.cssVar('--svg-' + marker.icons.over)
			marker.icons.click = $.Html.cssVar('--svg-' + marker.icons.click)
		}

		$.DataSource.Markers.fill(markers)
	}
)