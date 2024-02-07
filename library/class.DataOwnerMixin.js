import $                  from '../core/class.Puer.js'
import PuerComponentMixin from '../core/class.PuerComponentMixin.js'


export default class DataOwnerMixin extends PuerComponentMixin {
	static init(component) {
		component.props.require('dataSource')

		component._dataSet    = null
		component._dataSource = null
		component.dataSource  = component.props.dataSource
	}

	set dataSource(name) {
		if (this._dataSet) {
			for (const id of this._dataSet.itemIds) {
				this.onDataItemRemove(id)
			}
		}
		this.props.dataSource    = name
		this._dataSource         = $.DataSource[this.props.dataSource]
		this._dataSet            = $.DataSet.define(null, null, this.props.itemFilter, this.props.itemAdapter)

		const nop = () => {}

		// TODO: Refactor churchkhela
		this._dataSet.onData       = this.props.onDataChange     ? this.props.onDataChange     : this.onDataChange     ? this.onDataChange.bind(this)     : nop
		this._dataSet.onSort       = this.props.onDataSort       ? this.props.onDataSort       : this.onDataSort       ? this.onDataSort.bind(this)       : nop
		this._dataSet.onFilter     = this.props.onDataFilter     ? this.props.onDataFilter     : this.onDataFilter     ? this.onDataFilter.bind(this)     : nop
		this._dataSet.onItemAdd    = this.props.onDataItemAdd    ? this.props.onDataItemAdd    : this.onDataItemAdd    ? this.onDataItemAdd.bind(this)    : nop
		this._dataSet.onItemChange = this.props.onDataItemChange ? this.props.onDataItemChange : this.onDataItemChange ? this.onDataItemChange.bind(this) : nop
		this._dataSet.onItemRemove = this.props.onDataItemRemove ? this.props.onDataItemRemove : this.onDataItemRemove ? this.onDataItemRemove.bind(this) : nop

		this._dataSet.dataSource = this._dataSource
	}

	get dataSource() {
		return this._dataSource
	}

	get dataSet() {
		return this._dataSet
	}
}