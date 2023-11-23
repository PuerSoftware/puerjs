import Puer, {PuerComponent} from '../../puer.js'


class Modal extends PuerComponent {

    render() {
        return div({cssDisplay: 'none'}, [
            div('content', this.children),
			button('close-btn', {text: 'x', onclick: this.hide})
        ])
    }
}

Puer.define(Modal, import.meta.url)
export default Modal