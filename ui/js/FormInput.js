import $ from '../../index.js'


class FormInput extends $.Component {
	constructor(props, children) {
		super(props, children)
		this.props.require('name')
		this.props.default('isHeader', false)
		this.props.default('autocomplete', 'off')
		this.props.default('disabled', false) // TODO: rename to isDisabled
		this.props.default('isEditable', true)
		this.props.default('isReadOnly', false)
		this.props.default('isPreviewMode', false)
		this.props.default('presentAs', 'text')
		this.props.default('defaultValue', '-')

		this.form         = null
		this.input        = null
		this.beforeDiv    = null
		this.afterDiv     = null
		this.field        = null
		this.inPlaceLabel = null
		this.initialValue = undefined

		this.disabledByDefault = this.props.disabled

		this.state.value = null
	}

	_triggerChange(oldValue, newValue) {
		if (String(oldValue) !== String(newValue)) {
			this._trigger('change', {
				newValue : newValue,
				oldValue : oldValue
			})
		}
	}

	_onChange(event) {
		this.form && this.form.onInputChange(event)
	}

	_updateInitialValue() {
		this.initialValue = this.input.element.value || undefined
	}

	set disabled(value) {
		if (this.input) {
			this.field && this.field.toggleCssClass('disabled', value)
			if (value) {
				this.input.setAttribute('disabled', true)
			} else {
				this.input.element.removeAttribute('disabled')
			}
			this.props.disabled = value
		}
	}

	get disabled() {
		return this.props.disabled
	}

	set value(value) {
		this.state.value = value
		if (this.input) {
			value            = value || ''
			const oldValue   = this.input.element.value
			this.input.element.value = value
			this._triggerChange(oldValue, value)
		}
	}

	get value() {
		return this.input && this.input.element
			? this.input.element.value
			: null
	}

	get stringValue() {
		return this.value
	}

	reset() {
		if (!this.disabledByDefault) {
			this.disabled = false
		}
		if (this.field) {
			this.field.error = ''
		}
		this.input.element.value = ''
		this.initialValue        = undefined
	}

	focus() {
		this.input.element.focus()
	}

	blur() {
		this.input.element.blur()
	}

	onFocus(e) {
		this.addCssClass('focus')
	}

	onBlur(e) {
		this.props.isEditable = false
		this.removeCssClass('focus')
	}

	onPropIsEditableChange(isEditable) {
		if (this.inPlaceLabel) {
			this.inPlaceLabel.toggle(!isEditable)
			this.input.toggle(isEditable)
			for (const child of this.children) {
				child.toggle(isEditable)
			}
			this.inPlaceLabel.props.text = this.stringValue || String(this.props.defaultValue)
			this.inPlaceLabel.toggleCssClass('empty', !this.stringValue)
			if (isEditable) {
				this.focus()
			}
		}

	}

	onInit() {
		this._on('change', this._onChange)
		this.form  = this.$$$.Form[0]
		this.field = this.$$$.FormField[0]
		this.disabled = this.props.disabled
	}

	render() {
		if (this.props.isPreviewMode) {
			switch(this.props.presentAs) {
				case 'text':
					return $.Box([
						$.div({text: this.state.value})
					])
				case 'link':
					return $.Box([
						$.a({
							href   : this.state.value,
							target : '_blank'
						}, [
							$.text(this.state.value)
						])
					])
				case 'image':
					return $.Box([
						$.img({src: this.state.value})
					])
			}
		}

		this.input        = $[this.props.tagName]({ ... this.props })
		this.inPlaceLabel = $.Box('in-place-label hidden')

		this._eventTarget = this.input
		const beforeProps = this.events.beforeclick ? { onclick: this.events.beforeclick } : {}
		const afterProps  = this.events.afterclick  ? { onclick: this.events.afterclick }  : {}

		const children = [
			this.beforeDiv = $.div('before', beforeProps),
			this.input,
			... this.children,
			this.inPlaceLabel,	
			this.afterDiv = $.div('after', afterProps)
		]
		return $.div(children)
	}
}

$.define(FormInput, import.meta.url)
export default FormInput