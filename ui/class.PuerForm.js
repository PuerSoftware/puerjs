import Puer, {PuerComponent} from '../puer.js'


class PuerForm extends PuerComponent {
    constructor(props, title='My form', subtitle='My form subtitle') {
        super(arguments)

    }

    render() {
        return (
            div({autocomplete: 'off'}, [
                h1({text: this.props.title}),
                p({text: this.props.subtitle}),
                form({action: this.props.action, method: this.props.method, enctype: this.props.enctype}, [
                    ...this.children,
                    p([
                        button({type: 'submit', text: this.props.buttonCaption})
                    ])
                ])
            ])
        )
    }
}

Puer.define(PuerForm)
export default PuerForm

/*
<div class="form" autocomplete="off">
    <h1>{{ form.title }}</h1>
    <p>{{ form.subtitle }}</p>
    <form action="{{ form.action }}" method="{{ form.method }}" enctype="{{ form.enctype }}">
		{% csrf_token %}
		{{ form }}
	<p><button type="submit" class="btn btn-primary">{{ form.button_caption }}</button></p>
    </form>
</div>
*/