import PuerObject from './class.PuerObject.js'
import Puer from './class.Puer.js'


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

    _getInstance(id) {
        let instance = null
        if (id in Puer.App.components) {
            console.log('found in app.components', id)
            instance = Puer.App.components[id]
            // this.children = instance.children
            // this.props    = instance.props
            console.log('CHILDREN', this.children)
        } else {
            console.log('NOT found in app.components', id)
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

        if (this.isCustom) {
            this.instance.children    = this.children
            const rootConstructor     = this.instance.render()
            this.instance.root        = rootConstructor.__register(this.xPath)
            this.instance.root.parent = this.instance
        } else {
            this.instance.root = this.instance
            this.children && this.children.forEach((child, index) => {
                // if (child.__register) {
                    const childInstance = child.__register(this.xPath, index)
                    this.instance.children.push(childInstance)
                    childInstance.parent = this.instance
                // }
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