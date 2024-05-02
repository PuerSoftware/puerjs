import $ from '../../index.js'


export default class Notification extends $.Component {
    constructor(... args) {
        super(... args)
        this.props.default('timeout', 3000)
        this._notifications = {} // componentId: timeoutId

        this.on($.Event.NOTIFICATION, this._onNotification)
    }

    _startTimeout(notificationId) {
        const _this = this
        return setTimeout(() => {
            _this._onTimeout(notificationId)
        }, this.props.timeout)
    }

    _onTimeout(notificationId) {
        const _this        = this
        const notification = $.components[notificationId]
        notification.addCssClass('fade-out')
        setTimeout(() => {
            delete _this._notifications[notificationId]
            notification.remove()
        }, 1400)
    }

    _onItemMouseOver(e) {
        clearTimeout(this._notifications[e.targetComponent.id])
    }

    _onItemMouseOut(e) {
        const id = e.targetComponent.id
        this._notifications[id] = this._startTimeout(id)
    }

    _onNotification(e) {
        const notification = $.li('notification-item unselectable', {
            text        : e.detail.text,
            onmouseover : this._onItemMouseOver.bind(this),
            onmouseout  : this._onItemMouseOut.bind(this)
        })
        this._notifications[notification.id] = this._startTimeout(notification.id)
        this.prepend(notification)
        notification.append(
            $.Button({onclick: () => {notification.remove()}})
        )

    }

    render() {
        return $.ul()
    }
}

$.define(Notification, import.meta.url)