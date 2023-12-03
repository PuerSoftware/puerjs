import Puer, {PuerComponent} from '../../puer.js'


class Modal extends PuerComponent {

	render() {
		return Puer.div({cssDisplay: 'none'}, [
			Puer.div('content', this.children),
			Puer.button('close-btn', {text: 'x', onclick: this.hide})
		])
	}
}

Puer.define(Modal, import.meta.url)
export default Modal