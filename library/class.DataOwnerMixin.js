import $                  from '../core/class.Puer.js'

export default class DataOwnerMixin {
	static init(component, data) {
		component.props.require('name')
		component.props.require('dataSource')

		component._dataSet    = null
		component._dataSource = null
		component.dataSource  = component.props.dataSource
		if (component.dataSource.isPreloadable) {
			$.onDataMixinInit()
		}
	}

	set dataSource(name) {
		if (this._dataSet) {
			for (const id of this._dataSet.itemIds) {
				this.onDataItemRemove(id)
			}
		}
		const dsName = `${name}__${this.className}__${this.name}` + $.String.randomHex(3)
		// console.log(dsName)

		this.props.dataSource    = name
		this._dataSource         = $.DataSource[this.props.dataSource]
		this._dataSet            = $.DataSet.define(dsName, null, this.props.itemFilter, this.props.itemAdapter)
		this._dataSet.owner      = this
		

		this._dataSet.onData = (... args) => {
			this._onDataChange      && this._onDataChange.call(this, ...args)
			this.props.onDataChange && this.props.onDataChange(... args)
			if (this.dataSource.isPreloadable) {
				$.onDataMixinLoad()
			}
		}
		this._dataSet.onSort = (... args) => {
			this._onDataSort      && this._onDataSort.call(this, ...args)
			this.props.onDataSort && this.props.onDataSort(... args)
		}
		this._dataSet.onFilter = (... args) => {
			this._onDataFilter      && this._onDataFilter.call(this, ...args)
			this.props.onDataFilter && this.props.onDataFilter(... args)
		}
		this._dataSet.onItemAdd = (... args) => {
			this._onDataItemAdd      && this._onDataItemAdd.call(this, ...args)
			this.props.onDataItemAdd && this.props.onDataItemAdd(... args)
		}
		this._dataSet.onItemChange = (... args) => {
			this._onDataItemChange      && this._onDataItemChange.call(this, ...args)
			this.props.onDataItemChange && this.props.onDataItemChange(... args)
		}
		this._dataSet.onItemRemove = (... args) => {
			this._onDataItemRemove      && this._onDataItemRemove.call(this, ...args)
			this.props.onDataItemRemove && this.props.onDataItemRemove(... args)
		}
		this._dataSet.onClear = (... args) => {
			this._onDataClear      && this._onDataClear.call(this, ...args)
			this.props.onDataClear && this.props.onDataClear(... args)
		}


		// TODO: Refactor churchkhela 
		// this._dataSet.onData       = onData
		// this._dataSet.onSort       = this.props.onDataSort       ? this.props.onDataSort       : this.onDataSort       ? this.onDataSort.bind(this)       : nop
		// this._dataSet.onFilter     = this.props.onDataFilter     ? this.props.onDataFilter     : this.onDataFilter     ? this.onDataFilter.bind(this)     : nop
		// this._dataSet.onItemAdd    = this.props.onDataItemAdd    ? this.props.onDataItemAdd    : this.onDataItemAdd    ? this.onDataItemAdd.bind(this)    : nop
		// this._dataSet.onItemChange = this.props.onDataItemChange ? this.props.onDataItemChange : this.onDataItemChange ? this.onDataItemChange.bind(this) : nop
		// this._dataSet.onItemRemove = this.props.onDataItemRemove ? this.props.onDataItemRemove : this.onDataItemRemove ? this.onDataItemRemove.bind(this) : nop
		// this._dataSet.onClear      = this.props.onDataClear      ? this.props.onDataClear      : this.onDataClear      ? this.onDataClear.bind(this)      : nop

	
		this._dataSet.dataSource = this._dataSource
	}

	get dataSource() {
		return this._dataSource
	}

	get dataSet() {
		return this._dataSet
	}
}
