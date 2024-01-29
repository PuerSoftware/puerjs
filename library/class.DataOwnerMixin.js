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
				this.onDataRemoveItem(id)
			}
		}
		this.props.dataSource = name
		this._dataSource      = $.DataSource[this.props.dataSource]
		this._dataSet         = this._dataSource.defineDataSet(null, this.props.entryFilter)
		console.log('attached dataset', name)
		const nop = () => {}

		this._dataSet.onInit       = this.props.onDataInit       ? this.props.onDataInit       : this.onDataInit       ? this.onDataInit.bind(this)       : nop
		this._dataSet.onData       = this.props.onDataChange     ? this.props.onDataChange     : this.onDataChange     ? this.onDataChange.bind(this)     : nop
		this._dataSet.onSort       = this.props.onDataSort       ? this.props.onDataSort       : this.onDataSort       ? this.onDataSort.bind(this)       : nop
		this._dataSet.onFilter     = this.props.onDataFilter     ? this.props.onDataFilter     : this.onDataFilter     ? this.onDataFilter.bind(this)     : nop
		this._dataSet.onAddItem    = this.props.onDataAddItem    ? this.props.onDataAddItem    : this.onDataAddItem    ? this.onDataAddItem.bind(this)    : nop
		this._dataSet.onChangeItem = this.props.onDataChangeItem ? this.props.onDataChangeItem : this.onDataChangeItem ? this.onDataChangeItem.bind(this) : nop
		this._dataSet.onRemoveItem = this.props.onDataRemoveItem ? this.props.onDataRemoveItem : this.onDataRemoveItem ? this.onDataRemoveItem.bind(this) : nop

		console.log('registered ds methods', name)
	}

	get dataSource() {
		return this._dataSource
	}

	get dataSet() {
		return this._dataSet
	}
}