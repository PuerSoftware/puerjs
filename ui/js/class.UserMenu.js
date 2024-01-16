import $ from '../../index.js'
// import Rows  from './class.Rows.js' 


class UserMenu extends $.Component {
	constructor(props, children) {
		super(props, children)
	}

	render() {
		return $.Rows([
            $.div(),
            $.div(),
            $.div()
        ])
	}
}

$.define(UserMenu, import.meta.url)
export default UserMenu