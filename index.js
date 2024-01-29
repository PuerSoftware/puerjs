import $       from './core/class.Puer.js'
import PuerApp from './core/class.PuerApp.js'

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
		'datetime,default,defer,dir,dirname,download,draggable,dropzone,'                              +
		'enctype,for,form,formaction,formenctype,formmethod,formnovalidate,formtarget,'                +
		'height,hidden,href,hreflang,http-equiv,imagesizes,imagesrcset,integrity,'                     +
		'ismap,itemprop,kind,label,lang,list,loop,max,maxlength,media,method,'                         +
		'min,minlength,multiple,muted,name,nonce,novalidate,onafterprint,onbeforeprint,'               +
		'onbeforeunload,onhashchange,onlanguagechange,onmessage,onmessageerror,onoffline,'             +
		'ononline,onpagehide,onpageshow,onpopstate,onrejectionhandled,onstorage,onunhandledrejection,' +
		'onunload,open,pattern,ping,placeholder,preload,property,readonly,referrerpolicy,'             +
		'rel,required,reversed,rows,rowspan,sandbox,scope,selected,shape,size,sizes,'                  +
		'spellcheck,src,srclang,srcset,start,step,style,tabindex,target,title,translate,'              +
		'type,usemap,value,width,wrap'
	).split(',')
	
	const events = (
		'abort,ended,addtrack,change,removetrack,messageerror,message,animationcancel,animationend,'        +
		'animationiteration,animationstart,copy,cut,dragend,dragenter,dragleave,dragover,dragstart,'        +
		'drag,drop,fullscreenchange,fullscreenerror,gotpointercapture,keydown,keypress,keyup,'              +
		'lostpointercapture,paste,pointercancel,pointerdown,pointerenter,pointerleave,pointerlockchange,'   +
		'pointerlockerror,pointermove,pointerout,pointerover,pointerup,readystatechange,scroll,'            +
		'selectionchange,touchcancel,touchend,touchmove,touchstart,transitioncancel,transitionend,'         +
		'transitionrun,transitionstart,visibilitychange,wheel,afterscriptexecute,auxclick,'                 +
		'beforescriptexecute,blur,click,compositionend,compositionstart,compositionupdate,contextmenu,'     +
		'dblclick,error,focusin,focusout,focus,gesturechange,gestureend,gesturestart,mousedown,'            +
		'mouseenter,mouseleave,mousemove,mouseout,mouseover,mouseup,mousewheel,select,'                     +
		'webkitmouseforcechanged,webkitmouseforcedown,webkitmouseforceup,webkitmouseforcewillbegin,'        +
		'cancel,open,loadend,loadstart,load,progress,webglcontextcreationerror,webglcontextlost,'           +
		'webglcontextrestored,toggle,close,beforeinput,input,formdata,reset,submit,invalid,search,'         +
		'canplaythrough,canplay,durationchange,emptied,loadeddata,loadedmetadata,pause,playing,play,'       +
		'ratechange,seeked,seeking,stalled,suspend,timeupdate,volumechange,waiting,slotchange,cuechange,'   +
		'enterpictureinpicture,leavepictureinpicture,versionchange,blocked,upgradeneeded,success,'          +
		'complete,devicechange,mute,unmute,merchantvalidation,paymentmethodchange,shippingaddresschange,'   +
		'shippingoptionchange,payerdetailchange,resourcetimingbufferfull,resize,bufferedamountlow,closing,' +
		'tonechange,gatheringstatechange,selectedcandidatepairchange,statechange,addstream,'                +
		'connectionstatechange,datachannel,icecandidateerror,icecandidate,iceconnectionstatechange,'        +
		'icegatheringstatechange,negotiationneeded,removestream,signalingstatechange,track,audioprocess,'   +
		'activate,contentdelete,install,notificationclick,pushsubscriptionchange,push,connect,audioend,'    +
		'audiostart,end,nomatch,result,soundend,soundstart,speechend,speechstart,start,voiceschanged,'      +
		'boundary,mark,resume,beginEvent,endEvent,repeatEvent,unload,removeTrack,afterprint,appinstalled,'  +
		'beforeprint,beforeunload,devicemotion,deviceorientation,gamepadconnected,gamepaddisconnected,'     +
		'hashchange,languagechange,offline,online,orientationchange,pagehide,pageshow,popstate,'            +
		'rejectionhandled,storage,unhandledrejection,vrdisplayactivate,vrdisplayblur,vrdisplayconnect,'     +
		'vrdisplaydeactivate,vrdisplaydisconnect,vrdisplayfocus,vrdisplaypointerrestricted,'                +
		'vrdisplaypointerunrestricted,vrdisplaypresentchange,timeout,inputsourceschange,selectend,'         +
		'selectstart,squeezeend,squeezestart,squeeze,save'
	).split(',')

	for (const tag of tags) {
		$.define(tag)
	}
	
	function dirName(filePath) {
		filePath = new URL(filePath).pathname
		return filePath.slice(0, filePath.lastIndexOf('/'))
	}
	$.path = dirName(import.meta.url) + '/'
	$.isAttr  = (s) => { return attributes.indexOf(s.toLowerCase()) > -1 || s.startsWith('data-') }
	$.isEvent = (s) => { return events.indexOf(s.replace(/^on/, '').toLowerCase())     > -1 }
})()


$.App = PuerApp

$.Events.define('APP_CLICK',              ['event'])
$.Events.define('APP_KEYUP',              ['event'])
$.Events.define('APP_ESCAPE',             ['event'])

$.Events.define('DATASOURCE_DATA',        ['itemIds'])
$.Events.define('DATASOURCE_ITEM_ADD',    ['item'])
$.Events.define('DATASOURCE_ITEM_CHANGE', ['item'])
$.Events.define('DATASOURCE_ITEM_REMOVE', ['itemId'])

// $.Events.define('DATASET_SORT',          ['event'])
// $.Events.define('DATASET_FILTER',        ['event'])

$.Events.define('LIST_ITEM_SELECT',       ['data', 'name'])
$.Events.define('LIST_ITEM_CHECK',        ['data', 'name', 'isChecked', 'isResend'])
$.Events.define('SEARCH',                 ['value']) // TODO: Move to DATASET_SEARCH?
$.Events.define('PAGINATE',               ['page'])
$.Events.define('FORM_RESPONSE',          ['error', 'errors', 'isSaved'])
$.Events.define('TAG_REMOVE',             ['label'])
$.Events.define('TAG_CLICK',              ['label'])


export default $