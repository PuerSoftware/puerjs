import $    from '../../index.js'
import Link from './class.Link.js'


export default class Tab extends Link {

	select() {
		this._navigate()
	}

	onActivate() {
        const tabs = this.$$$.Tabs[0] 
        tabs && tabs.select(this)
	}

    onDeactivate() {}
}

$.define(Tab, import.meta.url)