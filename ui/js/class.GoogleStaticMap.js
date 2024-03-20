import $ from '../../index.js'

import {DataOwnerMixin} from '../../library/index.js'


export default class GoogleStaticMap extends $.Component {
	static API_URL = 'https://maps.googleapis.com/maps/api/staticmap'

	constructor(... args) {
		super(... args)

		this.props.default('center',  [50.4504, 30.5245])
		this.props.default('width',   600)
		this.props.default('height',  400)
		this.props.default('zoom',    7)
		this.props.default('mapType', 'hybrid')
		this.props.default('markers',  [])
		this.props.default('mapId',    null)

		this.state.imgUrl = null
		this._markers     = {} // {lat_lng: markerComponent}
	}

	_getMarkerKey(lat, lng) { // (lat, lng) || (key)
		return lat && lng
			? `${lat}_${lng}`
			: lat
	}

	_latLngToPx(lat, lng) {
		const zoom                   = this.props.zoom
		const [centerLat, centerLng] = this.props.center
		const w                      = this.props.width
		const h                      = this.props.height

		const zoomFactor = Math.pow(2, zoom)

		const x = (lng + 180) * (256 * zoomFactor) / 360
		const latRad = lat => lat * Math.PI / 180
		const mercN = lat => Math.log(Math.tan((Math.PI / 4) + (latRad(lat) / 2)))
		const y = (256 * zoomFactor) * (1 - (mercN(lat) / Math.PI)) / 2

		const centerX = (centerLng + 180) * (256 * zoomFactor) / 360
		const centerY = (1 - Math.log(Math.tan(latRad(centerLat)) + 1 / Math.cos(centerLat * Math.PI / 180)) / Math.PI) / 2 * (256 * zoomFactor)

		const pixelX = x - centerX + w / 2
		const pixelY = y - centerY + h / 2

		const inBounds = pixelX >= 0 && pixelX <= w && pixelY >= 0 && pixelY <= h

		return { x: pixelX, y: pixelY, inBounds }
	}

	onDataChange() { this._updateImage() }

	_updateImage() {
		const center = this.props.center
		const o = {
			center  : `${center[0]},${center[1]}`,
			zoom    : this.props.zoom,
			size    : `${this.props.width}x${this.props.height}`,
			maptype : this.props.mapType,
			key     : this.props.apiKey,
			// signature : this.props.signature
		}
		if (this.props.mapId) {
			o.map_id = this.props.mapId
		}
		this.removeMarkers()
		this.state.imgUrl = `url(${GoogleStaticMap.API_URL}?${$.String.toQuery(o)})`

		const markers = this.props.dataSource
			? this.dataSet.items
			: this.props.markers

		for (const marker of markers) {
			this.addMarker(marker.lat, marker.lng, marker.icons, marker.label)
		}
	}

	/***************************************************/

	onPropZoomChange    (zoom)    { this._updateImage() }
	onPropCenterChange  (center)  { this._updateImage() }
	onPropMapTypeChange (mapType) { this._updateImage() }

	onPropMarkersChange () { !this.props.dataSource && this._updateImage() }
	onInit              () { this.props.dataSource  && this.mixin(DataOwnerMixin) }

	/***************************************************/

	addMarker(lat, lng, iconData, label='') {
		const coords = this._latLngToPx(lat, lng)

		if (coords.inBounds) {
			const marker = $.div('marker', {
				cssLeft            : coords.x - 15, // TODO: get dynamically marker radius
				cssTop             : coords.y - 15  , // TODO: get dynamically marker radius
				cssBackgroundImage : iconData.over
			})

			this.append(marker)
			this._markers[this._getMarkerKey(lat, lng)] = marker
		}
	}

	removeMarker(... args) {  // (lat, lng) || (key)
		const key    = this._getMarkerKey(... args)
		const marker = this._markers[key]
		if (marker) {
			marker.remove()
			delete this._markers[key]
		}
	}

	removeMarkers() {
		for (const key in this._markers) {
			this.removeMarker(key)
		}
	}

	set center(center)   { this.props.center = center   }
	get center()         { return this.props.center     }

	set zoom(zoom)       { this.props.zoom = zoom       }
	get zoom()           { return this.props.zoom       }

	set mapType(mapType) { this.props.mapType = mapType }
	get mapType()        { return this.props.mapType    }

	render() {
		return $.div({
			cssWidth           : this.props.width,
			cssHeight          : this.props.height,
			cssBackgroundImage : this.state.imgUrl
		})
	}

}

$.define(GoogleStaticMap, import.meta.url)