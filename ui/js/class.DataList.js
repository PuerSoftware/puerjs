import $, {PuerComponent} from '../../puer.js'


export default class DataList extends PuerComponent {
	constructor(props, children) {
		super(props, children)
		this.props.require('dataSet', this)
		this.dataSet          = $.DataSet[this.props.dataSet]
		this.dataSet.onFilter = this.onFilter.bind(this)
		this.dataSet.onSort   = this.onSort.bind(this)
	}

	onFilter(map) {}

	onSort(map) {}

}