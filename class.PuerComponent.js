import BasePuerComponent from './class.BasePuerComponent.js'


class PuerComponent extends BasePuerComponent {
	constructor(props, children) {
		super(props, children)
	}

	checkType() {
		return this.className
	}
}


export default PuerComponent