import PuerObject from './class.PuerObject.js'
import Puer       from './class.Puer.js'
import PuerError  from './class.PuerError.js'


class PuerConstructor extends PuerObject {
    constructor(cls, props, children, isCustom) {
        super()
        this.cls      = cls
        this.props    = props
        this.children = children
        this.isCustom = isCustom
        this.instance = null
        this.xPath    = null
    }

    /*********************** PRIVATE ***********************/

    _getInstance(id) {
        let instance = null
        if (Puer.App.has(id)) {
            instance      = Puer.App.components[id]
            this.children = instance.children
            // console.log('Found in components', instance.id, instance.props, instance)
        } else {
            instance          = new this.cls(this.props)
            instance.id       = id
            instance.isCustom = this.isCustom

            Puer.App.components[id] = instance
        }
        return instance
    }

    /********************** FRAMEWORK **********************/

    __register(xPath='PuerApp', index=0) {
        this.xPath    = xPath + '>' + this.cls.name + `[${index}]`
        this.instance = this._getInstance(this.xPath)

        this.instance.children = this.children

        if (this.isCustom) {
            this.tree                 = this.tree || this.instance.render()
            if (!this.tree) {
                throw new PuerError('Must return component tree', this.instance.className, 'render')
            }
            this.instance.root        = this.tree.__register(this.xPath)
            this.instance.root.parent = this.instance
        } else {
            this.instance.root = this.instance
            this.children && this.children.forEach((child, index) => {
                const childInstance = child.__register(this.xPath, index)
                childInstance.parent = this.instance
            })
        }

        this.instance.isCustom = this.isCustom
        this.instance.shadow   = this

        // console.log(this.xPath, this.instance)
        return this.instance
    }

    __render() {
        return this.instance.__render()
    }

    __onMount() {
		return this.instance.__onMount()
	}    
}

export default PuerConstructor