import Puer from './core/class.Puer.js'

(() => {
	const tags = (
		'text,a,abbr,address,area,article,aside,audio,b,base,bdi,bdo,blockquote,body,br,button,'      +
		'canvas,caption,cite,code,col,colgroup,data,datalist,dd,del,details,dfn,dialog,div,'          +
		'dl,dt,em,embed,fieldset,figcaption,figure,footer,form,h1,h2,h3,h4,h5,h6,head,header,'        +
		'hgroup,hr,html,i,iframe,img,input,ins,kbd,label,legend,li,link,main,map,mark,meta,'          +
		'meter,nav,noscript,object,ol,optgroup,option,output,p,param,picture,pre,progress,q,'         +
		'rp,rt,ruby,s,samp,script,section,select,small,source,span,strong,style,sub,summary,'         +
		'sup,table,tbody,td,template,textarea,tfoot,th,thead,time,title,tr,track,u,ul,var,video,wbr'
	).split(',')

	const attributes = (
		'accesskey,action,allow,allowfullscreen,allowpaymentrequest,alt,as,async,'                     +
		'autocomplete,autofocus,autoplay,border,charset,cite,class,color,cols,'                        +
		'colspan,content,contenteditable,controls,coords,crossorigin,data,data-*,'                     +
		'datetime,default,defer,dir,dirname,disabled,download,draggable,dropzone,'                     +
		'enctype,for,form,formaction,formenctype,formmethod,formnovalidate,formtarget,'                +
		'height,hidden,href,hreflang,http-equiv,id,imagesizes,imagesrcset,integrity,'                  +
		'ismap,itemprop,kind,label,lang,list,loop,max,maxlength,media,method,'                         +
		'min,minlength,multiple,muted,name,nonce,novalidate,onafterprint,onbeforeprint,'               +
		'onbeforeunload,onhashchange,onlanguagechange,onmessage,onmessageerror,onoffline,'             +
		'ononline,onpagehide,onpageshow,onpopstate,onrejectionhandled,onstorage,onunhandledrejection,' +
		'onunload,open,pattern,ping,placeholder,preload,property,readonly,referrerpolicy,'             +
		'rel,required,reversed,rows,rowspan,sandbox,scope,selected,shape,size,sizes,'                  +
		'spellcheck,src,srclang,srcset,start,step,style,tabindex,target,title,translate,'              +
		'type,usemap,value,width,wrap'
	).split(',')

	for (const tag of tags) {
		Puer.define(tag)
	}
	
	function dirName(filePath) {
		filePath = new URL(filePath).pathname
		return filePath.slice(0, filePath.lastIndexOf('/'))
	}
	Puer.path = dirName(import.meta.url) + '/'
	Puer.isAttr = (s) => { return attributes.indexOf(s.toLowerCase()) > -1 }
})()

export { default as PuerComponent } from './core/class.PuerComponent.js'
export { default as PuerApp       } from './core/class.PuerApp.js'

export default Puer