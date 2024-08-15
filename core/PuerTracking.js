import $ from './Puer.js'

const API_URL     = 'https://api.ipify.org'
const COOKIE_NAME = 't'


export default class PuerTracking {
	static ep   = null // tracking endpoint
	static info = {}  // { user_agent: requere, ip: optional, user_id: optional, hash: optional}

	static _refreshIp(callback) {
		$.Request.get(
			API_URL,
			callback,
			{format: 'json'},
			{}
		)
	}

	static _refresh() {
		PuerTracking.info.user_agent = window.navigator.userAgent
		PuerTracking.info.hash       = $.getCookie(COOKIE_NAME)
	}

	static _track(trackData) {
		$.Request.post(
			PuerTracking.ep,
			(data, headers) => {
				$.setCookie(COOKIE_NAME, data.hash)
			},
			trackData,
		)
	}

	static track(actionId, refreshIp=false) {
		if (!PuerTracking.ep) {
			throw 'Call setEndpoint(url) first'
		}
		PuerTracking._refresh()
		if (refreshIp) {
			PuerTracking._refreshIp((data, headers) => {
				PuerTracking.info.ip = data.ip
				PuerTracking._track({
					... PuerTracking.info,
					action_id: actionId
				})
			})
		} else {
			PuerTracking._track({
				... PuerTracking.info,
				action_id: actionId
			})
		}
	}

	static setProp(prop, value) {
		PuerTracking.info[prop] = value
	}

	static setup(trackEp) {
		PuerTracking.ep = trackEp
	}
}
