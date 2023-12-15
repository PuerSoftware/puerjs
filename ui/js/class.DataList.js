import $, {PuerComponent} from '../../puer.js'


export default class DataList extends PuerComponent {
	constructor(props, children) {
		super(props, children)
		this.props.require('dataSet', this)
		this.dataSet          = $.DataSet[this.props.dataSet]
		this.items            = {} // {id: itemComponent}
		this.state.itemListId = new $.Reference(this.dataSet.itemListId)
		this.state.filterMap  = new $.Reference(this.dataSet.filterMapId)
		this.state.sortMap    = new $.Reference(this.dataSet.sortMapId)
	}

	_addItem(item) {

	}

	_removeItem(id) {

	}

	onStateItemListIdChange(items) {

	}

	onStateFilterMapChange(filterMap) {

	}

	onStateSortMapChange(sortMap) {

	}
}