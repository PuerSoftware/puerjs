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

    /********************** FRAMEWORK **********************/

    __register(xPath, app, parent, index=0) {
        this.xPath = xPath + '>' + this.cls.name + `[${index}]`
        this.props.id === 6 && console.log('__register', this.xPath, this.cls.name, this.props.id)

        if (this.xPath in app.components) {
            this.props.id === 6 && console.log('if', this.xPath, this.cls.name, this.props.id, app.components)
            this.instance = app.components[this.xPath]
        } else {
            this.props.id === 6 && console.log('else', this.xPath, this.cls.name, this.props.id)

            this.instance = new this.cls(this.props, this.children)
            this.instance.parent = parent
            
            app.components[this.xPath] = this.instance
            this.instance.id = this.xPath
            this.props.id === 6 && console.log('else___', app.components)
        }
        if (this.isCustom) {
            const rootConstructor = this.instance.render()
            rootConstructor.__register(this.xPath, app, this.instance)
        }

        this.children && this.children.forEach((child, index) => {
            child.__register(this.xPath, app, this.instance, index)
        })
    }

    __render(xPath, index=0) {
        
        this.xPath = xPath + '>' + this.cls.name + `[${index}]`
        console.log('__render', Puer.App.components, this.xPath)
        this.instance = Puer.App.components[this.xPath]
        if (!this.instance) {
            console.log(this.props.id)
            console.log(this.cls.name)
        }
        return this.instance.__render(this.xPath)
    }

    __onMount() {
		return this.instance.__onMount()
	}    
}

export default PuerConstructor