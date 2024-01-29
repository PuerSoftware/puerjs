import $ from '../../index.js'


export default class GoogleMap extends $.Component {
	static Icons = {}

	constructor(... args) {
		super(... args)

		this.props.default('center',  [50.4504, 30.5245])
		this.props.default('zoom',    7)
		this.props.default('mapType', 'hybrid')
		this.props.default('styles',  [])
		this.props.default('icons',   {})

		this.props.default('zoomControl',       false)
		this.props.default('mapTypeControl',    false)
		this.props.default('scaleControl',      false)
		this.props.default('streetViewControl', false)
		this.props.default('rotateControl',     false)
		this.props.default('fullscreenControl', false)

		this.map     = null  // google.maps.Map
		this.markers = {}    // { lat_lng: google.maps.Marker }

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
			center    : { lat: this.props.center[0] , lng: this.props.center[1] },
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

		this.mixin($.DataOwnerMixin)
		console.log('api loaded', 'mixin added')

		GoogleMap.Icons = Object.assign({
			GREEN_DOT: {
				path         : google.maps.SymbolPath.CIRCLE,
				fillColor    : '#78B065',
				fillOpacity  : 1.0,
				strokeWeight : 0,
				scale        : 5  // radius
			},
			ORANGE_DOT: {
				path         : google.maps.SymbolPath.CIRCLE,
				fillColor    : '#F2B063',
				fillOpacity  : 1.0,
				strokeWeight : 0,
				scale        : 5  // radius
			}
		}, this.props.icons)
	}

	onDataChange() {
		console.log('data change', this._dataset)
		this.removeMarkers()
		for (const item of this.dataSet.items) {
			this.addMarker(item.lat, item.lng, item.label, item.icon)
		}
		let _this = this
		setTimeout(() => {
			_this.showMarkers()
		} ,1000)
	}

	_getMarkerKey(lat, lng) { // (lat, lng) || (key)
		return lat && lng
			? `${lat}_${lng}`
			: lat
	}

	/***************************************************/

	onPropZoomChange(zoom) {
		this.map && this.map.setZoom(zoom)
	}

	onPropCenterChange(center) {
		const c = new google.maps.LatLng(center[0], center[1])
		this.map && this.map.setCenter(c)
	}

	/***************************************************/

	addMarker(lat, lng, label='', icon=null) {
		icon = GoogleMap.Icons[icon]
			? GoogleMap.Icons[icon]
			: icon

		const key = this._getMarkerKey(lat, lng)
		const params = {
			map      : this.map,
			position : { lat: lat , lng: lng },
		}
		icon  && ( params['icon']  = icon  )
		label && ( params['title'] = label )
		try { this.markers[key] = new google.maps.Marker(params) } catch (e) {
			console.log('google exception')
		}
		this.markers[key].key = key
		console.log(this.markers[key])
	}

	removeMarker(... args) {  // (lat, lng) || (key)
		const key = this._getMarkerKey(... args)
		this.markers[key].setMap(null)
		delete this.markers[key]
	}

	removeMarkers() {
		for (const key in this.markers) {
			this.removeMarker(key)
		}
	}

	showMarkers(markers=null) {
		let bounds = new google.maps.LatLngBounds()

		markers = markers || Object.values(this.markers)
		markers.forEach((marker) => {
		    bounds.extend(marker.getPosition())
		})
		this.map.fitBounds(bounds)
	}

	set center(center) { this.props.center = center	}
	get center()       { return this.props.center   }

	set zoom(zoom)     { this.props.zoom = zoom     }
	get zoom()         { return this.props.zoom     }
}


$.define(GoogleMap, import.meta.url)