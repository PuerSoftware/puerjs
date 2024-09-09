import $ from './Puer.js'

const API_URL     = 'https://api.ipify.org'
const COOKIE_NAME = 'a'


export default class PuerAnalytics {
	static ep   = null // tracking endpoint
	static info = {}  // { user_agent: required, ip: optional, user_id: optional, visitor_id: optional}

	static _refreshIp(callback) {
		$.Request.get(
			API_URL,
			callback,
			{format: 'json'},
			{}
		)
	}

	static _refresh() {
		PuerAnalytics.info.user_agent = window.navigator.userAgent
		PuerAnalytics.info.visitor_id = $.getCookie(COOKIE_NAME)
	}

	static _trigger(trackData) {
		$.Request.post(
			PuerAnalytics.ep,
			(data, headers) => {
				$.setCookie(COOKIE_NAME, data.visitor_id)
			},
			trackData,
		)
	}

	static trigger(actionId, refreshIp=false) {
		if (!PuerAnalytics.ep) {
			throw 'Call setup(url) first'
		}
		PuerAnalytics._refresh()
		if (refreshIp) {
			PuerAnalytics._refreshIp((data, headers) => {
				PuerAnalytics.info.ip = data.ip
				PuerAnalytics._trigger({
					... PuerAnalytics.info,
					action_id: actionId
				})
			})
		} else {
			PuerAnalytics._trigger({
				... PuerAnalytics.info,
				action_id: actionId
			})
		}
	}

	static setProp(prop, value) {
		PuerAnalytics.info[prop] = value
	}

	static login(userId) {
		PuerAnalytics.setProp('user_id', userId)
	}

	static setup(trackEp) {
		PuerAnalytics.ep = trackEp
	}
}
