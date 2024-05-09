import $ from '../core/class.Puer.js'


export default class DataOwnerMixin {
	static init(component, data) {
		component.props.require('name')
		component.props.require('dataSource')
		component.props.default('itemFilter', null)

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
	
		this._dataSet.dataSource = this._dataSource
	}

	get dataSource() {
		return this._dataSource
	}

	get dataSet() {
		return this._dataSet
	}

	onBeforeRemove() {
		this._dataSet.remove()
		console.log('DataSet', $.DataSet[this._dataSet.name])
		delete this._dataSet
		console.log('Mixin', this._dataSet)
	}
}
