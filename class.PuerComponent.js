import BasePuerComponent from './class.BasePuerComponent.js'


class PuerComponent extends BasePuerComponent {
	constructor(props, children) {
		super(props, children)
	}

	checkType() {
		return this.className
	}

	isCustom() {
		return true
	}
}


export default PuerComponent