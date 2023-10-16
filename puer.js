import Puer from './core/class.Puer.js'


(() => {
	const tags = (
		'text,a,abbr,address,area,article,aside,audio,b,base,bdi,bdo,blockquote,body,br,button,'    +
		'canvas,caption,cite,code,col,colgroup,data,datalist,dd,del,details,dfn,dialog,div,'   +
		'dl,dt,em,embed,fieldset,figcaption,figure,footer,form,h1,h2,h3,h4,h5,h6,head,header,' +
		'hgroup,hr,html,i,iframe,img,input,ins,kbd,label,legend,li,link,main,map,mark,meta,'   +
		'meter,nav,noscript,object,ol,optgroup,option,output,p,param,picture,pre,progress,q,'  +
		'rp,rt,ruby,s,samp,script,section,select,small,source,span,strong,style,sub,summary,'  +
		'sup,table,tbody,td,template,textarea,tfoot,th,thead,time,title,tr,track,u,ul,var,video,wbr'
	).split(',')

	for (const tag of tags) {
		Puer.define(tag)
	}
})()

export { default as PuerError     } from './core/class.PuerError.js'
export { default as PuerComponent } from './core/class.PuerComponent.js'
export default Puer