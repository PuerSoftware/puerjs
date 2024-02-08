import $ from '../../index.js'


export default class GoogleMap extends $.Component {
	static API_URL = 'https://maps.googleapis.com/maps/api/js'

	constructor(... args) {
		super(... args)
		this.defaultZoom = 5

		this.props.require('apiKey')

		this.props.default('center',  [50.4504, 30.5245])
		this.props.default('zoom',    this.defaultZoom)
		this.props.default('mapType', 'hybrid')
		this.props.default('styles',  [])
		this.props.default('icons',   {})

		this.props.default('zoomControl',       false)
		this.props.default('mapTypeControl',    false)
		this.props.default('scaleControl',      false)
		this.props.default('streetViewControl', false)
		this.props.default('rotateControl',     false)
		this.props.default('fullscreenControl', false)

		this.map             = null  // google.maps.Map
		this._markers        = {}    // { lat_lng: google.maps.Marker }
		this._markerIcons    = {}    // { lat_lng: {out: '', over: '', click: ''} }
		this._selectedMarker = null  // google.maps.Marker

		if (window.google && window.google.maps) {
			this._initMap()
		} else {
			this._loadApi()
		}
	}

	_getMarkerKey(lat, lng) { // (lat, lng) || (key)
		if (lat && lat.position) {
			return `${lat.position.lat()}_${lat.position.lng()}`
		}
		return lat && lng
			? `${lat}_${lng}`
			: lat
	}

	_loadApi() {
		const query = $.String.query({
			key      : this.props.apiKey,
			loading  : 'async',
			callback : 'onGoogleMapApiLoad'
		})
		const url = `${GoogleMap.API_URL}?${query}`
		window.onGoogleMapApiLoad = this._initMap.bind(this)
		$.Html.load(url, null, 'js')
	}

	_initMap() {
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

		this.props.dataSource && this.mixin($.DataOwnerMixin)
	}
	_onMarkerMouseOver(e) {
		const key    = this._getMarkerKey(e.latLng.lat(), e.latLng.lng())
		const marker = this._markers[key]
		if (key !== this._getMarkerKey(this._selectedMarker)) {
			this._setIcon(marker, 'over')
		}
	}

	_onMarkerMouseOut(e) {
		const key    = this._getMarkerKey(e.latLng.lat(), e.latLng.lng())
		const marker = this._markers[key]
		if (key !== this._getMarkerKey(this._selectedMarker)) {
			this._setIcon(marker, 'out')
		}
	}

	_onMarkerClick(e) {
		const key    = this._getMarkerKey(e.latLng.lat(), e.latLng.lng())
		const marker = this._markers[key]
		this._selectMarker(marker)
	}

	_onMarkerDoubleClick(e) {
		this.selectMarker(e.latLng.lat(), e.latLng.lng())
	}

	_setIcon(marker, iconState='out') {
		const key      = this._getMarkerKey(marker)
		const icon     = this._markerIcons[key][iconState]
		const iconSize = $.Html.getSvgSize(icon)

		marker.setIcon({
			url    : icon,
			anchor : new google.maps.Point(iconSize[0]/2, iconSize[1]/2)
		})
	}

	_selectMarker(marker) {
		if (this._selectedMarker) {
			this._setIcon(this._selectedMarker, 'out')
		}
		this._selectedMarker = marker
		this._setIcon(marker, 'click')
	}

	/***************************************************/

	onDataChange() {
		this.removeMarkers()
		for (const item of this.dataSet.items) {
			this.addMarker(item.lat, item.lng, item.icons, item.label)
		}
	}

	onPropZoomChange(zoom) {
		this.map && this.map.setZoom(zoom)
	}

	onPropCenterChange(center) {
		if (this.map) {
			const c = new google.maps.LatLng(center[0], center[1])
			this.map.setCenter(c)
		}
	}

	onPropMapTypeChange(mapType) {
		this.map && this.map.setMapTypeId(mapType)
	}

	/***************************************************/

	addMarker(lat, lng, iconData, label='') {
		iconData.out   = iconData.out.replace(/^url\('(.*)'\)$/, '$1')
		iconData.over  = iconData.over.replace(/^url\('(.*)'\)$/, '$1')
		iconData.click = iconData.click.replace(/^url\('(.*)'\)$/, '$1')

		let   marker
		const key    = this._getMarkerKey(lat, lng)
		const params = {
			position: {
				lat: lat,
				lng: lng
			},
			map   : this.map,
			title : label
		}
		try { marker = new google.maps.Marker(params) } catch (e) {}

		this._markers[key]     = marker
		this._markerIcons[key] = iconData
		this._setIcon(marker, 'out')

		marker.addListener('mouseover', this._onMarkerMouseOver.bind(this))
		marker.addListener('mouseout',  this._onMarkerMouseOut.bind(this))
		marker.addListener('click',     this._onMarkerClick.bind(this))
		marker.addListener('dblclick',  this._onMarkerDoubleClick.bind(this))
	}

	removeMarker(... args) {  // (lat, lng) || (key)
		const key = this._getMarkerKey(... args)
		this._markers[key].setMap(null)
		delete this._markers[key]
	}

	removeMarkers() {
		for (const key in this._markers) {
			this.removeMarker(key)
		}
	}

	showMarkers(markers=null) {
		let bounds = new google.maps.LatLngBounds()

		markers = markers || Object.values(this._markers)
		markers.forEach((marker) => {
		    bounds.extend(marker.getPosition())
		})
		this.map.fitBounds(bounds)
	}

	selectMarker(lat, lng) {
		const key    = this._getMarkerKey(lat, lng)
		const marker = this._markers[key]

		this._selectMarker(marker)
		setTimeout(() => {
			this.zoom = this.defaultZoom + 1
			setTimeout(() => {
				this.center = [lat, lng]
				setTimeout(() => {
					this.zoom = this.defaultZoom
				}, 250)
			}, 250)
		}, 250)
	}

	set center(center)   { this.props.center = center   }
	get center()         { return this.props.center     }

	set zoom(zoom)       { this.props.zoom = zoom       }
	get zoom()           { return this.props.zoom       }

	set mapType(mapType) { this.props.mapType = mapType }
	get mapType()        { return this.props.mapType    }
}


$.define(GoogleMap, import.meta.url)