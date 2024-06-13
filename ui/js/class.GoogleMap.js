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
		this.props.default('mapIds',  []) // list of map ids to load
		this.props.default('mapId',   '') // map id of current map
		this.props.default('styles',  [])
		this.props.default('icons',   {})
		this.props.default('minZoom', 2)

		this.props.default('zoomControl',       false)
		this.props.default('mapTypeControl',    false)
		this.props.default('scaleControl',      false)
		this.props.default('streetViewControl', false)
		this.props.default('rotateControl',     false)
		this.props.default('fullscreenControl', false)

		this.map                = null  // google.maps.Map
		this._markers           = {}    // { lat_lng: google.maps.Marker }
		this._markersData       = {}    // { lat_lng: data }
		this._markerIcons       = {}    // { lat_lng: {out: '', over: '', click: ''} }
		this._selectedMarker    = null  // google.maps.Marker
		this._selectedMarkerKey = null  // lat_lng

		if (window.google && window.google.maps) {
			this._initMap()
		} else {
			this._loadApi()
		}
	}

	_getMarkerKey(lat, lng) { // (lat, lng) || (key)
		if (lat && lat.position) {
			return `${lat.position.lat}_${lat.position.lng}`
		}
		return lat && lng
			? `${lat}_${lng}`
			: lat
	}

	_loadApi() {
		const query = $.String.toQuery({
			key       : this.props.apiKey,
			map_ids   : this.props.mapIds.join(','),
			loading   : 'async',
			libraries : 'maps,marker',
			callback  : 'onGoogleMapApiLoad'
		})
		const url = `${GoogleMap.API_URL}?${query}`
		window.onGoogleMapApiLoad = this._initMap.bind(this)
		$.Html.load(url, null, 'js')
	}

	_initMap(doMixin=true) {
		if (doMixin && this.props.dataSource) {
			this.mixin($.DataOwnerMixin)
		}
		this.map = new google.maps.Map(this.element, {
			center    : { lat: this.props.center[0] , lng: this.props.center[1] },
			zoom      : this.props.zoom,
			mapTypeId : this.props.mapType,
			mapId     : this.props.mapId,
			minZoom   : this.props.minZoom,

			zoomControl       : this.props.zoomControl,
			mapTypeControl    : this.props.mapTypeControl,
			scaleControl      : this.props.scaleControl,
			streetViewControl : this.props.streetViewControl,
			rotateControl     : this.props.rotateControl,
			fullscreenControl : this.props.fullscreenControl,

			styles: this.props.styles,

			restriction: {
				strictBounds: true,
				latLngBounds: {
					north: 85,
					south: -85,
					west: -180,
					east: 180
				}
			}
		})
	}

	_reloadMap() {
		if (window.google && window.google.maps) {
			this._initMap(false)
			this.dataSet && this._onDataLoad()
			if (this._selectedMarkerKey && this._markers[this._selectedMarkerKey]) {
				this._selectMarker(this._markers[this._selectedMarkerKey])
			}
		}
	}

	_onMarkerMouseOver(marker) {
		if (marker !== this._selectedMarker) {
			this._setIcon(marker, 'over')
		}
		this.trigger($.Event.MAP_MARKER_OVER, {data: this._getMarkerData(marker)})
	}

	_onMarkerMouseOut(marker) {
		if (marker !== this._selectedMarker) {
			this._setIcon(marker, 'out')
		}
		this.trigger($.Event.MAP_MARKER_OUT, {data: this._getMarkerData(marker)})
	}

	_onMarkerClick(marker) {
		this._selectMarker(marker)
	}

	_onMarkerDoubleClick(marker) {
		this.selectMarker(marker.position.lat, marker.position.lng)
	}

	_getMarkerData(marker) {
		return this._markersData[
			this._getMarkerKey(marker.position.lat, marker.position.lng)
		]
	}

	_setIcon(marker, iconState='out') {
		const key      = this._getMarkerKey(marker)
		const icon     = this._markerIcons[key][iconState]
		const iconSize = $.Html.getSvgSize(icon.replace(/^url\('(.*)'\)$/, '$1'))

		marker.content.style.backgroundImage  = this._markerIcons[key][iconState]
		marker.content.style.backgroundSize   = 'contain'
        marker.content.style.backgroundRepeat = 'no-repeat'
        marker.content.style.width            = `${iconSize[0]}px`
        marker.content.style.height           = `${iconSize[1]}px`
	}

	_selectMarker(marker) {
		if (this._selectedMarker) {
			this._setIcon(this._selectedMarker, 'out')
		}
		this._selectedMarker    = marker
		this._selectedMarkerKey = this._getMarkerKey(marker.position.lat, marker.position.lng) 
		this._setIcon(marker, 'click')
		this.trigger($.Event.MAP_MARKER_SELECT, {data: this._getMarkerData(marker)})
	}

	/***************************************************/

	_onDataLoad() {
		this.removeMarkers()
		for (const item of this.dataSet.items) {
			this.addMarker(item.lat, item.lng, item.icons, item.label, item.data)
		}
	}

	_onDataItemAdd(item) {
		this.addMarker(item.lat, item.lng, item.icons, item.label, item.data)
	}

	_onDataItemChange(item) {
		this.updateMaker(item.lat, item.lng, item.icons, item.label, item.data)
	}

	/***************************************************/

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

	onPropMapIdChange(mapId) {
		if (window.google) {
			this._reloadMap()
		}
	}

	/***************************************************/

	addMarker(lat, lng, iconData, label='', data=null) {
		const _this  = this
		const key    = this._getMarkerKey(lat, lng)
		const params = {
			position: {
				lat: lat,
				lng: lng
			},
			map     : this.map,
			title   : label,
			content : document.createElement('div')
		}
		const marker = new google.maps.marker.AdvancedMarkerElement(params)

		marker.addListener('click', (e) => {
			_this._onMarkerClick(marker)
		})
		marker.content.addEventListener('mouseover', (e) => {
			_this._onMarkerMouseOver(marker)
		})
		marker.content.addEventListener('mouseout', (e) => {
			_this._onMarkerMouseOut(marker)
		})
		marker.content.addEventListener('dblclick', (e) => {
			_this._onMarkerDoubleClick(marker)
		})

		this._markers[key]     = marker
		this._markersData[key] = data
		this._markerIcons[key] = iconData

		this._setIcon(marker, 'out')
	}

	updateMaker(lat, lng, iconData, label='', data=null) {
		const key        = this._getMarkerKey(lat, lng)
		const isSelected = this._selectMarker === this._markers[key]
		this.removeMarker(lat, lng)
		this.addMarker(lat, lng, iconData, label, data)
		isSelected && this._setIcon[this._markers[key], 'click']
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
		this.zoom = this.defaultZoom + 1
		this.center = [lat, lng]
	}

	set center(center)   { this.props.center = center   }
	get center()         { return this.props.center     }

	set zoom(zoom)       { this.props.zoom = zoom       }
	get zoom()           { return this.props.zoom       }

	set mapType(mapType) { this.props.mapType = mapType }
	get mapType()        { return this.props.mapType    }
}


$.define(GoogleMap, import.meta.url)