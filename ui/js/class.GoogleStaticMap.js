import $ from '../../index.js'


export default class GoogleStaticMap extends $.Component {
	static API_URL = 'https://maps.googleapis.com/maps/api/staticmap'

	constructor(... args) {
		super(... args)

		this.props.default('center',  [50.4504, 30.5245])
		this.props.default('width',   600)
		this.props.default('height',  400)
		this.props.default('zoom',    7)
		this.props.default('mapType', 'hybrid')

		this.state.imgUrl = null
	}

	_latLngToPx(centerLat, centerLng, zoom, lat, lng, w, h) {
		const latRad = lat => Math.sin(lat * Math.PI / 180)
		const zoomFactor = Math.pow(2, zoom)

		const x = (lng + 180) * (256 * zoomFactor) / 360
		const y = (1 - Math.log(Math.tan(latRad(lat)) + 1 / Math.cos(lat * Math.PI / 180)) / Math.PI) / 2 * (256 * zoomFactor)

		const centerX = (centerLng + 180) * (256 * zoomFactor) / 360
		const centerY = (1 - Math.log(Math.tan(latRad(centerLat)) + 1 / Math.cos(centerLat * Math.PI / 180)) / Math.PI) / 2 * (256 * zoomFactor)

		const pixelX = x - centerX + w / 2
		const pixelY = y - centerY + h / 2

		const inBounds = pixelX >= 0 && pixelX <= w && pixelY >= 0 && pixelY <= h

		return { x: pixelX, y: pixelY, inBounds }
	}


	// 	GoogleMap.Icons = Object.assign({
	// 		GREEN_DOT: {
	// 			path         : google.maps.SymbolPath.CIRCLE,
	// 			fillColor    : '#78B065',
	// 			fillOpacity  : 1.0,
	// 			strokeWeight : 0,
	// 			scale        : 5  // radius
	// 		},
	// 		ORANGE_DOT: {
	// 			path         : google.maps.SymbolPath.CIRCLE,
	// 			fillColor    : '#F2B063',
	// 			fillOpacity  : 1.0,
	// 			strokeWeight : 0,
	// 			scale        : 5  // radius
	// 		}
	// 	}, this.props.icons)
	// }

	// onDataChange() {
	// 	this.removeMarkers()
	// 	for (const item of this.dataSet.items) {
	// 		this.addMarker(item.lat, item.lng, item.label, item.icon)
	// 	}
	// }


	_updateImage() {
		const center = this.props.center
		const o = {
			center    : `${center[0]},${center[1]}`,
			zoom      : this.props.zoom,
			size      : `${this.props.width}x${this.props.height}`,
			maptype   : this.props.mapType,
			key       : this.props.apiKey,
			// signature : this.props.signature
		}
		this.state.imgUrl = `url(${GoogleStaticMap.API_URL}?${$.String.query(o)})`
	}

	/***************************************************/

	onPropZoomChange    (zoom)    { this._updateImage() }
	onPropCenterChange  (center)  { this._updateImage() }
	onPropMapTypeChange (mapType) { this._updateImage() }
	onInit              ()        { this._updateImage() }

	/***************************************************/

	addMarker(lat, lng, label='', icon=null) {
	}

	removeMarker(... args) {  // (lat, lng) || (key)
		
	}

	removeMarkers() {
		for (const key in this.markers) {
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