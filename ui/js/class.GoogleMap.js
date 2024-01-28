import $ from '../../index.js'


export default class GoogleMap extends $.Component {
	static Icons = {}

	constructor(... args) {
		super(... args)

		this.props.default('lat', -35.397)
		this.props.default('lng', 150.644)
		this.props.default('zoom', 8)
		this.props.default('mapType', 'hybrid')
		this.props.default('styles',  [])

		this.props.default('zoomControl',       false)
		this.props.default('mapTypeControl',    false)
		this.props.default('scaleControl',      false)
		this.props.default('streetViewControl', false)
		this.props.default('rotateControl',     false)
		this.props.default('fullscreenControl', false)

		this.map  = null

		this._loadApi()
	}

	_loadApi() {
		if (window.google && window.google.maps) {
			this._onApiLoad()
		} else {
			const params = {
				key      : this.props.apiKey,
				loading  : 'async',
				callback : 'onGoogleMapApiLoad'
			}
			const url = 'https://maps.googleapis.com/maps/api/js?' +
				new URLSearchParams(params).toString()

			window.onGoogleMapApiLoad = this._onApiLoad.bind(this)
			$.Html.load(url, null, 'js')
		}
	}

	_onApiLoad() {
		this.map = new google.maps.Map(this.element, {
			center    : { lat: this.props.lat , lng: this.props.lng },
			zoom      : this.props.zoom,
			mapTypeId : this.props.mapType,

			zoomControl       : this.props.zoomControl,
			mapTypeControl    : this.props.mapTypeControl,
			scaleControl      : this.props.scaleControl,
			streetViewControl : this.props.streetViewControl,
			rotateControl     : this.props.rotateControl,
			fullscreenControl : this.props.fullscreenControl,

			styles: this.props.styles
		})

		GoogleMap.Icons = {
			GREEN_CIRCLE: {
				path         : google.maps.SymbolPath.CIRCLE,
				fillColor    : '#78B065',
				fillOpacity  : 1.0,
				strokeWeight : 0,
				scale        : 5  // radius
			},
			ORANGE_CIRCLE: {
				path         : google.maps.SymbolPath.CIRCLE,
				fillColor    : '#F2B063',
				fillOpacity  : 1.0,
				strokeWeight : 0,
				scale        : 5  // radius
			}
		}
		this.addMarker(this.props.lat, this.props.lng, 'Foobar')
		this.addMarker(this.props.lat - 0.3, this.props.lng, 'Foobar')
		this.addMarker(this.props.lat - 0.4, this.props.lng - 0.3, 'Foobar')
	}

	addMarker(lat, lng, label='', icon=null) {
		icon = GoogleMap.Icons[icon]
			? GoogleMap.Icons[icon]
			: GoogleMap.Icons.ORANGE_CIRCLE

		const params = {
			map      : this.map,
			position : { lat: lat , lng: lng },
			icon     : icon
		}
		label && (params['title'] = label)
		try { new google.maps.Marker(params) } catch (e) {}
	}
}


$.define(GoogleMap, import.meta.url)