import Puer, {PuerComponent} from '../../puer.js'
import * as ui               from '../../ui/index.js'


/*
	{
		form: {action, enctype...},
		inputs: [
			{name, label, validation: {
				required: ..
				maxLength: ..
				custom: endpoint,
			}}
		]
	}
	
*/


class FormTestApp extends PuerComponent {
	constructor(props) {
		super(props)
	}

	render() {
		return Puer.ui_Form({}, [
			Puer.ui_FormField({label: 'Username'}, [
				Puer.ui_FormInput({type: 'text'}),
			]),
			Puer.ui_FormField({label: 'Password'}, [
				Puer.ui_FormInput({type: 'password'}),
			])
		])
	}
}

Puer.define(FormTestApp)
export default FormTestApp

/*

Input Constraints
required: The field must be filled before submission.
pattern="[regex]": Requires the input to match a specified regular expression.
min="[number]": Minimum numerical value for number and range input types, or minimum date for date input types.
max="[number]": Maximum numerical value for number and range input types, or maximum date for date input types.
maxlength="[number]": Maximum length of the input in characters.
minlength="[number]": Minimum length of the input in characters.
step="[number]": Incremental values that are considered valid, applied to number and range input types.

Type-Specific
type="email": Requires the input to be a valid email address.
type="url": Requires the input to be a valid URL.
type="number": Requires the input to be a numeric value.
type="tel": Requires the input to be a valid telephone number (not rigorously validated by all browsers).

Miscellaneous
readonly: Makes the input field read-only.
disabled: Disables the input field.
multiple: Allows multiple values (applies to email, file, and select).
autofocus: Automatically focuses on this element when the page loads.
novalidate (on <form>): Disables all validation for a form.
formnovalidate (on <input type="submit"> or <button>): Disables all validation when a certain submit button is clicked.

*/