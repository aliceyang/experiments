!function(window,$){if(!window.Airbnb){window.Airbnb={}
}var Airbnb=window.Airbnb;
var airbnbDomainRe=/\/\/[\.\w]+airbnb.+[:\d]?\//,relativePathRe=/^\/\w/,initialized=false;
function isAirbnbUrl(url){return airbnbDomainRe.test(url)||relativePathRe.test(url)
}$.extend(Airbnb,{defaultOptions:{isUserLoggedIn:false,locale:null},initHooks:[initPlaceholderShim,initSnapEngage,initUpdateCached,initCSRFHeader,postToGTM,initAdminFeed],addInitHook:function(hook){if(initialized){hook()
}else{Airbnb.initHooks.push(hook)
}},init:function(options){var EventEmitter=require("std::emitter");
Airbnb.mediator=new EventEmitter();
Airbnb.setOptions(options);
if(Airbnb.userAttributes.name){Airbnb.setOptions({isUserLoggedIn:true})
}$(document).trigger("userattributeschange.airbnb",Airbnb.userAttributes);
_.each(Airbnb.initHooks,function(hook){hook()
});
initialized=true;
$(window).load(doConversions)
},getCookieHost:getCookieHost,doConversions:doConversions,getCSRFToken:getCSRFToken,onLogin:function(callback){if(Airbnb.userAttributes.hasOwnProperty("id")){callback()
}else{Airbnb.SignInUp.addLoginCallback(callback)
}},setOptions:function(options){if(options&&options.isUserLoggedIn!=null){Airbnb.Utils.isUserLoggedIn=options.isUserLoggedIn
}Airbnb.options=$.extend({},Airbnb.defaultOptions,Airbnb.options,options)
},StringValidator:{Regexes:{url:/(https?)|(webcal):\/\/([-\w\.]+)+(:\d+)?(\/([\w\/_\.]*(\?\S+)?)?)?/,email:/^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/,date:/[0-9]{2}\/[0-9]{2}\/[0-9]{4}/,phone:/((.*)?\d(.*?)){10,15}/},validate:function(type,item){if(type===undefined||item===undefined||typeof item!="string"){return false
}return(item.match(Airbnb.StringValidator.Regexes[type])!==null)
}}});
function initSnapEngage(){if(JSCookie.cookie("snapengage")&&!$("#SnapABug_W").length){$.getScript("/snapengage/widget")
}}function getCookieHost(){var host,start,hostLength,hostParts;
hostParts=document.location.hostname.split(".");
hostLength=hostParts.length;
start=_.indexOf(hostParts,"airbnb");
host="."+hostParts.slice(start,hostLength).join(".");
return host
}function doConversions(){var host;
if(JSCookie.cookie("conversion_account_created")){dataLayer.push({event:"user_sign_up"});
_gaq.push(["_trackEvent","Users","Signup",JSCookie.cookie("affiliate")+"_"+Airbnb.userAttributes.id]);
host=getCookieHost();
JSCookie.cookie("conversion_account_created",null,{domain:host,path:"/"})
}if(JSCookie.cookie("reservation_accepted")){var hosting_id=JSCookie.cookie("reservation_accepted");
dataLayer.push({event:"new_reservation",hosting_id:hosting_id});
host=getCookieHost();
JSCookie.cookie("reservation_accepted",null,{domain:host,path:"/"})
}}function initPlaceholderShim(){if(!$.fn.placeholder.input||!$.fn.placeholder.textarea){$("input[placeholder], textarea[placeholder]").placeholder()
}}function getCSRFToken(){return JSCookie.cookie("_csrf_token")
}function initCSRFHeader(){$.ajaxSetup({beforeSend:function(xhr,options){if(isAirbnbUrl(options.url)){Airbnb.initUserAttributes();
xhr.setRequestHeader("X-CSRF-Token",getCSRFToken())
}}})
}function postToGTM(){function castToInteger(bool){return bool?1:0
}if(typeof dataLayer==="undefined"){return
}var options=Airbnb.options;
var userAttributes=Airbnb.userAttributes;
var isUser=castToInteger(options.isUserLoggedIn);
var isHost=castToInteger(userAttributes.is_active_host);
var domain=window.location.hostname;
var bev=JSCookie.cookie("bev");
var random=castToInteger(Airbnb.Utils.hashCode(bev)%2==0);
var attributes={l:options.locale,d:domain,au:isUser,ah:isHost,ra:random};
dataLayer.push({google_tag_params:attributes,l:options.locale,d:domain,au:isUser,ah:isHost,ra:random})
}function initAdminFeed(){if(Airbnb.Utils.isAdmin()&&Airbnb.userAttributes.just_logged_in){var is_o2=$(".flash-container")[0]!==undefined;
$.get("/admin/general/recent_activity"+(is_o2?"?o2=true":""),function(data){if(is_o2){$(".flash-container").after(data)
}else{$("#content_wrapper").prepend(data);
$(".alert-info a.close").click(function(){$(".alert-info").fadeOut()
})
}})
}}function initUpdateCached(){if(Airbnb.userAttributes.update_cached){$(window).load(updateCachedPage)
}}function updateCachedPage(){$.get("/home/update_cached",function(data){for(var key in data){$("#"+key).after(data[key])
}})
}}(window,jQuery);
window.Airbnb=window.Airbnb||{};
(function($,Airbnb){Airbnb.Utils={isUserLoggedIn:false,fb_status:function(){return JSCookie.cookie("fbs")
},fbInitHasPublishAction:function(){if(Airbnb.Utils.fb_status()!=="not_connected"){FB.api({method:"fql.query",query:"SELECT publish_actions FROM permissions WHERE uid = me()"},function(response){Airbnb.Utils.fbHasPublishAction=(response&&response[0]&&response[0].publish_actions==="1")
})
}},keyPressEventName:$.browser.mozilla?"keypress":"keydown",isDev:function(){if(typeof Airbnb.Utils._isDev==="undefined"){Airbnb.Utils._isDev=$("body").hasClass("development")
}return Airbnb.Utils._isDev
},isAdmin:function(){return !!(Airbnb.userAttributes&&Airbnb.userAttributes.is_admin)
},changeLocale:function(new_locale){var new_url=window.location.pathname+"?"+$.param($.query.load(window.location.href).set("locale",new_locale).keys)+window.location.hash;
window.location.replace(new_url)
},changeCurrency:function(new_currency,callback){$.post("/users/change_currency",{new_currency:new_currency},callback)
},followRedirectIfPresent:function(xhr){try{var response=$.parseJSON(xhr.responseText);
if(typeof response.redirect!=="undefined"){window.location=response.redirect
}}catch(err){}},decode:function(val){return $("<div/>").html(val).text()
},initVideoLightbox:function($Selector,title,embedCode,width,height){if($("#video_lightbox_content").length===0){$("body").append('<div id="video_lightbox_content"></div>')
}$($Selector).colorbox({inline:true,href:"#video_lightbox_content",width:width,height:height,onLoad:function(){$("#video_lightbox_content").html(embedCode)
},onComplete:function(){$("#cboxTitle").html(title)
},onCleanup:function(){$("#video_lightbox_content").html("");
$("#cboxTitle").html("")
}})
},selectKeys:function(hash,keys){var output,prop,index;
output={};
if(!keys){return{}
}if(keys instanceof Array){for(index=0;
index<keys.length;
index++){if(hash.hasOwnProperty(keys[index])){output[keys[index]]=hash[keys[index]]
}}return output
}for(prop in keys){if(keys.hasOwnProperty(prop)&&hash.hasOwnProperty(prop)){if(typeof keys[prop]==="boolean"){if(keys[prop]){output[prop]=hash[prop]
}}else{output[keys[prop]]=hash[prop]
}}}return output
},remap:function(hash,keys){var prop,output={};
for(prop in hash){if(hash.hasOwnProperty(prop)){if(keys.hasOwnProperty(prop)){if(typeof keys[prop]!=="boolean"){output[keys[prop]]=hash[prop]
}else{if(keys[prop]){output[prop]=hash[prop]
}}}else{output[prop]=hash[prop]
}}}return output
},log:function(){var console=window.console;
if(console&&console.log&&Airbnb.Utils.isDev()){var log;
if(typeof console.log==="object"){log=function(){for(var i=0,l=arguments.length;
i<l;
i++){console.log(arguments[i])
}}
}else{log=console.log
}log.apply(console,arguments)
}},interceptLink:function(callback){return function(e){var ref=e.currentTarget;
callback.call(this);
if(e.isDefaultPrevented()||e.metaKey||e.ctrlKey){return
}setTimeout(function(){window.location.href=ref.href
},200);
e.preventDefault()
}
},resetUser:function(){Airbnb.initUserAttributes();
Airbnb.setOptions({isUserLoggedIn:Airbnb.userAttributes.name!=null})
},fbButtonClickHandlerFactory:function(placement,onSuccess,onFailure){function track(eventName){window._gaq.push(["_trackEvent","Authenticate",eventName,placement])
}return function(e){e.preventDefault();
track("FacebookClick");
FB.login(function(response){var populate_uri;
if(response.authResponse){track("FacebookLogin");
var $target=$(e.currentTarget);
if(Airbnb.Utils.isUserLoggedIn&&($target.data("ajax_populate")||$target.data("populate_uri"))){populate_uri=$target.data("populate_uri")||"/users/populate_from_facebook";
Airbnb.Reauth.submit({type:"POST",url:populate_uri,dataType:"JSON"}).then(onSuccess).fail(onFailure)
}else{onSuccess()
}}else{track("FacebookDeny");
onFailure()
}},{scope:Airbnb.FACEBOOK_PERMS})
}
},sanitizeFilename:function(filename){if(typeof(filename)!=="string"){return""
}return filename.replace(/[^\w.-]/g,"")
},withGooglePlaces:function(callback){if(typeof google==="undefined"||!google.maps||!google.maps.places){if(typeof window.onGoogleMapsPlacesLoad==="undefined"){window.onGoogleMapsPlacesLoad=function(){Airbnb.Mediator.trigger("google.maps.places.load");
window.onGoogleMapsPlacesLoad=undefined
};
LazyLoad.js(window.googleMapsUrl+"&callback=onGoogleMapsPlacesLoad")
}Airbnb.Mediator.on("google.maps.places.load",callback)
}else{callback()
}},logGoogleMapsTimings:function(){var initLib=location.protocol+window.googleMapsUrl,libs=["main","common","stats","onion","usage"],timings={},perf=window.performance;
if(!perf||!perf.getEntriesByType||!perf.getEntriesByName){return
}if(perf.getEntriesByName(initLib).length>0){timings.initLib=perf.getEntriesByName(initLib)[0].duration
}var resources=perf.getEntriesByType("resource");
for(var i=0;
i<resources.length;
i++){var name=resources[i].name;
if(/\/\/maps\.gstatic\..*\.js$/.test(name)){for(var j=0;
j<libs.length;
j++){if(name.indexOf(libs[j])>-1){timings[libs[j]]=resources[i].duration;
libs.splice(libs.indexOf(libs[j]),1);
break
}}}}if(!_.isEmpty(timings)){Airbnb.Tracking.logEvent({event_name:"google_maps_loaded",event_data:timings})
}},hashCode:function(str){var hash=0,i,ch,len;
if(!str){return hash
}for(i=0,len=str.length;
i<len;
i++){ch=str.charCodeAt(i);
hash=((hash<<5)-hash)+ch;
hash=hash&hash
}return hash
},preload:function(assets){var i=assets.length,doc=document,isIE="fileSize" in doc,o;
while(i--){if(isIE){new Image().src=assets[i];
continue
}o=doc.createElement("object");
o.data=assets[i];
o.width=o.height=0;
o.style.position="absolute";
doc.body.appendChild(o)
}},readCookie:function(name){var match=new RegExp("("+name+")=([^;]*)").exec(document.cookie);
if(!match){return""
}return decodeURIComponent(match[2]).replace(/\+/g," ")
}}
})(jQuery,window.Airbnb||{});
!function(window,$,amplify,Airbnb){var Facebook={onFBInit:function(callback){$(document).on("fbInit",callback);
if(typeof FB!=="undefined"){callback()
}},init:function(options){window.fbAsyncInit=function(){if(window.FB){FB.init({appId:options.appId,status:true,cookie:true,xfbml:true,oauth:true});
FB.getLoginStatus(function(response){var fbsValue=response&&response.status!=="unknown"?response.status:null,host;
JSCookie.cookie("fbs",fbsValue,{path:"/"});
$(document).trigger("fbLoginStatus");
if(JSCookie.cookie("fb_logout")){FB.logout();
host=Airbnb.getCookieHost();
JSCookie.cookie("fb_logout",null,{domain:host,path:"/"})
}else{if(/fb_action_ids=/.test(document.location.search)){$.post("/users/detect_fb_session")
}if(Airbnb.userAttributes&&!Airbnb.Utils.isUserLoggedIn&&(response.status==="connected")&&autologin()){$.post("/users/facebook_auto_login",function(data){if(data.success){Airbnb.SignInUp.broadcastLogin()
}else{autologin(false)
}},"json")
}}$(document).trigger("fbInit")
})
}};
Airbnb.FACEBOOK_PERMS=options.scope
}};
function autologin(value){return !amplify.store("nofbautologin",value)
}if(typeof module!=="undefined"&&module.exports){module.exports=Facebook
}else{provide("airbnb.facebook",Facebook)
}}(window,jQuery,amplify,Airbnb);
(function(){var Api;
Api=(function(){function Api(config){if(config){this.configure(config)
}}Api.prototype.key=function(){return this.config.key
};
Api.prototype.configure=function(config){this.config=config
};
Api.prototype.locale=function(){var _ref;
return this.config.locale||((_ref=Airbnb.options)!=null?_ref.locale:void 0)
};
Api.prototype.params=function(params){return _.extend({},params,{key:this.key(),currency:Airbnb.userAttributes.curr,locale:this.locale()})
};
Api.prototype.getUrl=function(apiPath,params){var sep;
if(params==null){params={}
}if(!(this.config.baseUrl&&this.key())){throw"Missing API config info"
}sep=~apiPath.indexOf("?")?"&":"?";
return""+this.config.baseUrl+apiPath+sep+($.param(this.params(params)))
};
Api.prototype.request=function(method,apiPath,options){if(options==null){options={}
}options.url=this.getUrl(apiPath);
options.type=method;
options.dataType="json";
return $.ajax(options)
};
Api.prototype.get=function(apiPath,options){return this.request("GET",apiPath,options)
};
Api.prototype.post=function(apiPath,options){return this.request("POST",apiPath,options)
};
return Api
})();
this.Airbnb.Api=new Api
}).call(this);
!function(){$(document).ajaxError(function(event,xhr,settings){if(isApi(settings.url)){logError(xhr.status)
}});
var apiRe=/(:\/\/api\.[\w\.]*airbnb.com)|(:\/\/[\w\.]*airbnb\.[\w+\.]*\/api\/)/;
function isApi(url){return apiRe.test(url)
}function logError(status){var bucket="debug.api.error."+status,params={method:"increment",bucket:bucket};
$.post("/ajax_statsd",params,"json")
}}();
(function(global,Airbnb,_){function initHandlebars(instance){global.Handlebars&&Handlebars.registerHelper("t",function(key,options){if(typeof key=="string"){return new Handlebars.SafeString(instance.t(key,options.hash))
}else{var translationKey=key.fn(this);
return new Handlebars.SafeString(instance.t(translationKey))
}})
}var I18nManager=function(){this.phrases={};
this.options={}
};
I18nManager.prototype.init=function(options){this.options=options
};
I18nManager.prototype.locale=function(){return(Airbnb.options&&Airbnb.options.locale)||"en"
};
I18nManager.prototype.country=function(){return this.options.country
};
I18nManager.prototype.currency=function(){return Airbnb.userAttributes.curr||"USD"
};
I18nManager.prototype.symbolForCurrency=function(currency){var symbol,currencyOptions;
currency=currency||this.currency();
currencyOptions=this.currencyOptions(currency);
if(currencyOptions){symbol=currencyOptions.symbol
}else{symbol=currency
}return symbol
};
I18nManager.prototype.currencyOptions=function(currency){var currencyOptions;
currency=currency||this.currency();
if(this.options.currencies&&(currencyOptions=this.options.currencies[currency])){return currencyOptions
}else{this.warn('Missing currency data for "'+currency+'".')
}};
I18nManager.prototype.currencies=function(){var result=[];
var currencies=this.options.currencies;
for(var name in currencies){if(currencies.hasOwnProperty(name)){result.push(name)
}}return result
};
I18nManager.prototype.current_locale_name=function(){return this.options.current_locale_name||"English"
};
I18nManager.prototype.languages=function(){return this.options.languages
};
I18nManager.prototype.featured_languages=function(){if(this.options.featured_languages){return this.options.featured_languages
}this.options.featured_languages=this.options.languages.slice(0,11);
return this.options.featured_languages
};
I18nManager.prototype.overflow_languages=function(){if(this.options.overflow_languages){return this.options.overflow_languages
}this.options.overflow_languages=this.options.languages.slice(11);
return this.options.overflow_languages
};
I18nManager.prototype.priceString=function(amount,currency,options){options=options||{};
currency=currency||this.currency();
var currencyOptions,symbol,str,position,locale,symbolFirst;
currencyOptions=this.currencyOptions(currency);
symbol=this.symbolForCurrency(currency);
locale=this.locale();
position=currencyOptions.options&&currencyOptions.options.position;
if(position==="after"){symbolFirst=false
}else{if(position==="special"){if(currency==="EUR"){if(_.include(["fr","de","it","es"],locale)){symbolFirst=false
}else{symbolFirst=true
}}}else{symbolFirst=true
}}if(options.span){if(symbolFirst){str=['<span class="currency_symbol symbol before">',symbol,"</span>",amount].join("")
}else{str=[amount,'<span class="currency_symbol symbol after">',symbol,"</span>"].join("")
}}else{if(symbolFirst){str=[symbol,amount].join("")
}else{str=[amount,symbol].join("")
}}if(options.code===true||(options.code!==false&&currencyOptions.code_required)){if(options.span){str+=[' <span class="currency_symbol code after">',currency,"</span>"].join("")
}else{str+=[" ",currency].join("")
}}return str
};
I18nManager.prototype.guestConvertFromUsd=function(amount,options){options=_.defaults(options||{},{format:false});
var guestExchange,amountUsd,output,priceStringOptions;
guestExchange=Airbnb.userAttributes.guest_exchange;
amountUsd=Math.round(parseInt(amount,10)*guestExchange);
if(options.format){priceStringOptions=_.clone(options);
delete priceStringOptions.format;
output=this.priceString(amountUsd,null,priceStringOptions)
}else{output=amountUsd
}return output
};
I18nManager.prototype.warn=function(string){global.console&&global.console.warn&&global.console.warn("WARNING: "+string)
};
I18nManager.prototype.extend=function(phrases){for(var key in phrases){if(phrases.hasOwnProperty(key)){this.phrases[key]=phrases[key]
}}};
I18nManager.prototype.t=function(key,options){var result;
if(!options){options={}
}else{if(typeof options==="string"){options={"default":options}
}}var phrase=this.phrases[key]||options["default"]||"";
if(phrase===""){this.warn('Missing translation for key: "'+key+'"');
result=key
}else{result=phrase;
if(options.smart_count!=null&&options.smart_count.length!=null){options.smart_count=options.smart_count.length
}if(this.smartCountChoose){result=this.smartCountChoose(result,this.locale(),options.smart_count)
}result=this.interpolate(result,options)
}return result
};
I18nManager.prototype.get=function(){return this.t.apply(this,arguments)
};
I18nManager.prototype.interpolate=function(phrase,options){for(var arg in options){if(arg!=="default"&&options.hasOwnProperty(arg)){phrase=phrase.replace(new RegExp("%\\{"+arg+"\\}","g"),options[arg])
}}return phrase
};
I18nManager.prototype.pluralize=function(object,count){if(count!=null&&typeof count.length!=="undefined"){count=count.length
}var key;
if(count===0){key="pluralize."+object+".zero"
}else{if(count===1){key="pluralize."+object+".one"
}else{key="pluralize."+object+".many"
}}return this.t(key,{count:count})
};
global.I18n=new I18nManager();
Airbnb.Translations=global.I18n;
if(typeof global.t=="undefined"){global.t=function(){return global.I18n.t.apply(global.I18n,arguments)
}
}initHandlebars(global.I18n)
})(window,Airbnb,_);
(function(I18n,_){var DELIMITER="||||";
var PLURAL_TYPES={chinese_like:function(n){return 0
},german_like:function(n){return n!==1?1:0
},french_like:function(n){return n>1?1:0
},russian_like:function(n){return n%10===1&&n%100!==11?0:n%10>=2&&n%10<=4&&(n%100<10||n%100>=20)?1:2
},czech_like:function(n){return(n===1)?0:(n>=2&&n<=4)?1:2
},polish_like:function(n){return(n===1?0:n%10>=2&&n%10<=4&&(n%100<10||n%100>=20)?1:2)
},icelandic_like:function(n){return(n%10!==1||n%100===11)?1:0
}};
var PLURAL_TYPE_NAME_TO_LANGUAGES={chinese_like:["id","ja","ko","ms","th","tr","zh"],german_like:["da","de","en","es","fi","el","he","hu","it","nl","no","pt","sv"],french_like:["fr","tl"],russian_like:["hr","ru"],czech_like:["cs"],polish_like:["pl"],icelandic_like:["is"],};
var LANGUAGE_TO_PLURAL_TYPE_NAME=_.inject(PLURAL_TYPE_NAME_TO_LANGUAGES,function(carry,languages,type){for(var i in languages){carry[languages[i]]=type
}return carry
},{});
var TRIM_RE=/^\s+|\s+$/g;
function trim(str){return str.replace(TRIM_RE,"")
}function choose(text,locale,count){var ret,texts,chosen_text;
if(count!=null&&text){texts=text.split(DELIMITER);
chosen_text=texts[pluralTypeIndex(locale,count)]||texts[0];
ret=trim(chosen_text)
}else{ret=text
}return ret
}function pluralTypeName(locale){return LANGUAGE_TO_PLURAL_TYPE_NAME[I18n.locale()]||LANGUAGE_TO_PLURAL_TYPE_NAME.en
}function pluralTypeIndex(locale,count){return PLURAL_TYPES[pluralTypeName(locale)](count)
}I18n.smartCountChoose=choose
})(I18n,_);
(function(){this.JST||(this.JST={});
this.JST["header/user_profile_image"]=(function(){this.JST||(this.JST={});
this.JST["header/user_profile_image"]=Handlebars.template(function(Handlebars,depth0,helpers,partials,data){this.compilerInfo=[2,">= 1.0.0-rc.3"];
helpers=helpers||Handlebars.helpers;
data=data||{};
var buffer="",stack1,functionType="function",escapeExpression=this.escapeExpression;
buffer+='<img width="20" height="20" src="';
if(stack1=helpers.src){stack1=stack1.call(depth0,{hash:{},data:data})
}else{stack1=depth0.src;
stack1=typeof stack1===functionType?stack1.apply(depth0):stack1
}buffer+=escapeExpression(stack1)+'" alt="">\n';
return buffer
});
return this.JST["header/user_profile_image"]
}).call(this)
}).call(this);
(function(){this.JST||(this.JST={});
this.JST["header/faq_dropdown_row"]=(function(){this.JST||(this.JST={});
this.JST["header/faq_dropdown_row"]=Handlebars.template(function(Handlebars,depth0,helpers,partials,data){this.compilerInfo=[2,">= 1.0.0-rc.3"];
helpers=helpers||Handlebars.helpers;
data=data||{};
var buffer="",stack1,stack2,self=this,functionType="function",escapeExpression=this.escapeExpression;
function program1(depth0,data){var stack1,stack2;
stack2=helpers["if"].call(depth0,((stack1=depth0.userAttributes),stack1==null||stack1===false?stack1:stack1.is_content_manager),{hash:{},inverse:self.noop,fn:self.program(2,program2,data),data:data});
if(stack2||stack2===0){return stack2
}else{return""
}}function program2(depth0,data){return'\n  <a class="icon icon-arrow-up faq-edit faq-edit-up" href="#"></a>\n  <a class="icon icon-arrow-down faq-edit faq-edit-down" href="#"></a>\n  <a class="icon icon-remove faq-edit faq-edit-remove" href="#"></a>\n'
}buffer+='<li class="header-dropdown-list-item faqs-ajaxed-in"\n    data-faq="'+escapeExpression(((stack1=((stack1=depth0.link),stack1==null||stack1===false?stack1:stack1.id)),typeof stack1===functionType?stack1.apply(depth0):stack1))+'" data-priority="'+escapeExpression(((stack1=((stack1=depth0.link),stack1==null||stack1===false?stack1:stack1.priority)),typeof stack1===functionType?stack1.apply(depth0):stack1))+'">\n  <a href="/help/question/'+escapeExpression(((stack1=((stack1=((stack1=depth0.link),stack1==null||stack1===false?stack1:stack1.faq)),stack1==null||stack1===false?stack1:stack1.id)),typeof stack1===functionType?stack1.apply(depth0):stack1))+'?ref=help-dropdown"\n     class="faq_link">'+escapeExpression(((stack1=((stack1=((stack1=depth0.link),stack1==null||stack1===false?stack1:stack1.faq)),stack1==null||stack1===false?stack1:stack1.localized_question)),typeof stack1===functionType?stack1.apply(depth0):stack1))+"</a>\n";
stack2=helpers["if"].call(depth0,((stack1=depth0.userAttributes),stack1==null||stack1===false?stack1:stack1.is_admin),{hash:{},inverse:self.noop,fn:self.program(1,program1,data),data:data});
if(stack2||stack2===0){buffer+=stack2
}buffer+="\n</li>\n";
return buffer
});
return this.JST["header/faq_dropdown_row"]
}).call(this)
}).call(this);
(function(){provide("header/magenta_favicon","https://a0.muscache.com/airbnb/static/logotype_favicon_magenta-6358483feae753f8e4b01920bf3cdab8.ico")
})();
!function(global,exports,$,utils){function updateProfileImg(url){$("#header .user-profile-image").html(JST["header/user_profile_image"]({src:url}))
}var _=global._,Airbnb=global.Airbnb,EventEmitter=global.require("std::emitter"),Header,faqLinkTemplate,HeaderSearchBar;
HeaderSearchBar=_.inherit(EventEmitter,function(options){var clickHandled=false,that=this;
EventEmitter.call(this);
this.$el=$(options.el);
this.$=function(selector){return this.$el.find(selector)
};
this.searchbarStates={allClosed:0,autocomplete:1,settingsOpen:2};
this.$locationSearch=this.$("#header-location");
this.$searchForm=this.$("#search-form");
this.$searchSettings=this.$("#header-search-settings");
this.active=true;
if(this.$locationSearch.length<=0){this.active=false;
return
}this.$locationSearch.one("focus",function(){Airbnb.Utils.withGooglePlaces(that.setupAutocomplete)
});
this.setupAutocomplete=function(){that.autocomplete=new google.maps.places.Autocomplete(that.$locationSearch.get(0),{types:["geocode"]});
google.maps.event.addListener(that.autocomplete,"place_changed",function(){that.emit("place_changed",that.serializeData());
that.openSettings()
})
};
this.searchState=this.searchbarStates.allClosed;
this.autocompleteContainer=$(".pac-container");
this.$searchForm.airbnbInputDateSpan();
this.$searchForm.on("submit",function(event){that.emit("submit",that.serializeData($(this),event));
setTimeout(function(){if(that.autocompleteOpen()){that.setAutocomplete();
that.autocompleteContainer.css({width:"280px"})
}},10);
clickHandled=true;
if(!event.isDefaultPrevented()){event.preventDefault();
Airbnb.SearchUtils.handleFormSubmit(event.currentTarget)
}});
this.$locationSearch.keydown(function(e){var key=e.which,$this=$(this);
if(key===13){e.preventDefault();
if($this.val()!==""){that.$searchSettings.addClass("shown")
}}if(that.autocompleteContainer[0]===undefined){that.autocompleteContainer=$(".pac-container")
}that.setAutocomplete()
});
this.$searchSettings.mousedown(function(e){clickHandled=true
});
$("body").on("mousedown",".pac-container, .ui-datepicker",function(e){clickHandled=true
});
$(document).mousedown(function(e){if(!clickHandled){that.closeSearch()
}else{clickHandled=false
}})
});
HeaderSearchBar.prototype.setLocation=function(location){this.$locationSearch.val(location)
};
HeaderSearchBar.prototype.openSettings=function(){this.$searchSettings.addClass("shown");
this.searchState=this.searchbarStates.settingsOpen;
$("#header-search-checkin").focus().datepicker("show")
};
HeaderSearchBar.prototype.autocompleteOpen=function(){if(this.autocompleteContainer===undefined){return false
}return(this.autocompleteContainer.css("display")==="block")
};
HeaderSearchBar.prototype.setAutocomplete=function(){this.$searchSettings.removeClass("shown");
this.searchState=this.searchbarStates.autocomplete
};
HeaderSearchBar.prototype.closeSearch=function(){this.$searchSettings.removeClass("shown");
this.emit("close");
this.searchState=this.searchbarStates.allClosed
};
HeaderSearchBar.prototype.serializeData=function($el,event){var i,iter,length;
$el=$el||this.$searchForm;
event=event||null;
var serializedArray=$el.serializeArray();
var serializedObject={};
for(i=0,length=serializedArray.length;
i<length;
i++){iter=serializedArray[i];
serializedObject[iter.name]=iter.value
}return{data:serializedObject,event:event}
};
Header=_.inherit(EventEmitter,function(options){EventEmitter.call(this);
this.$el=$("#header");
this.personalizeHeader();
this.initDropdowns();
this.trackLysButton()
});
Header.prototype.trackLysButton=function(){$("#list-your-space").on("click",function(e){Airbnb.Tracking.setUiRef("header_"+window.location.pathname)
})
};
Header.prototype.personalizeHeader=function(){var self=this;
this.userAttributes=Airbnb.userAttributes;
if(this.userAttributes){$.each(this.userAttributes,function(key,value){if(typeof self[key]==="function"){self[key](value)
}})
}this.$el.toggleClass("logged_in",Airbnb.Utils.isUserLoggedIn);
this.$el.toggleClass("is_host",Airbnb.userAttributes.has_been_host);
this.initHeader();
this.setFavicon()
};
Header.prototype.name=function(name){this.$el.find(".value_name").text(name)
};
Header.prototype.setLocation=function(location){this.searchbar.setLocation(location)
};
Header.prototype.setFavicon=function(){if(this.userAttributes.revert_to_admin){$("#favicon").attr("href",require("header/magenta_favicon"))
}};
Header.prototype.num_h=function(hostingCount){hostingCount=parseInt(hostingCount,10);
var $li=this.$el.find(".header-dropdown .listings");
if(hostingCount===0){$li.hide()
}else{if(hostingCount===1){$li.find("span.singular").show();
$li.find("span.plural").hide()
}this.$el.find(".header-dropdown .reservations").show()
}};
Header.prototype.can_see_meetups=function(canSeeMeetups){if(canSeeMeetups){var $meetups=this.$el.find(".meetups");
$meetups.css("display","block")
}};
Header.prototype.can_see_groups=function(canSeeGroups){if(canSeeGroups){var $groups=this.$el.find(".groups");
$groups.css("display","block")
}};
Header.prototype.unread_message_count=function(count){if(count>0){this.$el.find(".unread_count, .alert-count").show().addClass("in").text(count)
}};
Header.prototype.show_header_search=function(show){if(show){this.$el.addClass("show_search")
}};
Header.prototype.initDropdowns=function(){$(".header-list-item.dropdown > a").on("click",function(event){var $this=$(this),$dropdown=$this.siblings(".header-dropdown"),hideThatShit=function(){$dropdown.fadeOut(150);
$this.removeClass("active");
$(document).unbind("click.header_dropdown")
};
event.preventDefault();
if(!$this.hasClass("active")){$dropdown.fadeIn(50);
$this.addClass("active");
setTimeout(function(){$(document).bind("click.header_dropdown",function(e){if(!$(".help_search_box").is(":focus")){hideThatShit()
}})
},0)
}else{hideThatShit()
}})
};
Header.prototype.buildLinkFromFaqLink=function(link){var faqLinkTemplate=JST["header/faq_dropdown_row"];
return faqLinkTemplate({link:link,userAttributes:this.userAttributes})
};
Header.prototype.loadFaqs=function(page,rule,force){var $helpLink=$(".help-toggle"),$dropdown=$(".help-dropdown"),$loading=$dropdown.find(".loading"),html="",self=this;
if(!rule){rule=""
}$.ajax({type:"GET",url:"/faq_links",data:{query:{page:page,rule:rule}},dataType:"json",success:function(data){$(".faqs-ajaxed-in").remove();
if(data.length<1&&rule!=="guest_default"&&!force){if(rule!=="host_default"&&/host_/.exec(rule)){return self.loadFaqs(page,"host_default")
}else{return self.loadFaqs(page,"guest_default")
}}var faqLinks=data,i=0;
for(i;
i<faqLinks.length;
i++){html+=self.buildLinkFromFaqLink(faqLinks[i].faq_link)
}$loading.before(html);
$loading.addClass("hidden")
},complete:function(xhr,ajaxOptions,thrownError){$(".all_faqs").removeClass("hidden")
}})
};
Header.prototype.initCustomFaqs=function(){var $helpLink=$(".help-toggle"),$dropdown=$(".help-dropdown"),$loading=$dropdown.find(".loading"),html="",self=this;
$helpLink.one("click",function(){$(".faqs-ajaxed-in").remove();
$.ajax({type:"GET",url:"/old_help/populate_help_dropdown",dataType:"json",success:function(data){var faqs=data.faqs,i=0;
for(i=0;
i<faqs.length;
i++){html+='<li class="header-dropdown-list-item faqs-ajaxed-in"><a href="'+faqs[i].link+'?ref=help-dropdown" class="faq_link">'+faqs[i].title+"</a></li>"
}$loading.before(html);
$loading.addClass("hidden")
},complete:function(xhr,ajaxOptions,thrownError){$(".all_faqs").removeClass("hidden")
}})
})
};
Header.prototype.initHeader=function(){var amplify=global.amplify,userpic_url=amplify.store("header_userpic_url"),$faqAdmin,self=this,$helpDropdown=$(".help-dropdown");
Airbnb.Tracking.Moonshine.track("impression");
this.searchbar=new HeaderSearchBar({el:"#header-search"});
this.searchbar.on("open",function(){self.$el.addClass("search_open")
});
this.searchbar.on("close",function(){self.$el.removeClass("search_open")
});
this.searchbar.on("submit",function(options){self.emit("search",options)
});
this.searchbar.on("place_changed",function(options){self.emit("search",options)
});
this.unread_message_count(this.userAttributes.num_msg);
if(Airbnb.Utils.isUserLoggedIn){$("#header-logout").click(function(e){Airbnb.SignInUp.doLogout();
e.preventDefault()
});
if(userpic_url===undefined){$.getJSON("/users/header_userpic.json",function(resp){if(resp!==undefined){amplify.store("header_userpic_url",resp.url,{expires:86400000});
updateProfileImg(resp.url)
}})
}else{updateProfileImg(userpic_url)
}}if(this.userAttributes.is_admin&&this.userAttributes.is_content_manager&&this.userAttributes.custom_faq_links){$.get("/faq_links/admin_form",{page:$("input[name='faq_link[page]']").val()},function(resp){var $faqRuleSelector;
$faqAdmin=$("#faqadmin");
$faqAdmin.html(resp.html);
$faqAdmin.show();
$faqRuleSelector=$("select[name='faq_link[rule]']");
$("#faqadmin").on("click","#header_load_faqs",function(e){e.preventDefault();
self.loadFaqs($("input[name='faq_link[page]']").val(),$faqRuleSelector.val(),true)
});
$faqAdmin.find("form").bind("submit",function(e){e.preventDefault();
$.ajax({url:"/faq_links",type:"POST",dataType:"json",data:$(this).serialize(),success:function(data){self.loadFaqs($("input[name='faq_link[page]']").val(),$("select[name='faq_link[rule]']").val(),true)
}})
});
$helpDropdown.on("click",".faq-edit-down",function(e){e.preventDefault();
var $this=$(this),$parent=$this.parent(),faqData=$parent.data(),$otherFaq=$parent.next(".header-dropdown-list-item"),otherFaqData,data;
if($otherFaq.length){otherFaqData=$otherFaq.data();
data={_method:"POST",faq_links:[{id:faqData.faq,priority:faqData.priority+1},{id:otherFaqData.faq,priority:faqData.priority}]};
$.ajax({url:"/faq_links",type:"PUT",dataType:"json",data:data,success:function(data){$parent.data({priority:faqData.priority+1,faq:faqData.faq});
$otherFaq.data({priority:faqData.priority,faq:otherFaqData.faq});
$parent.next().after($parent)
}})
}});
$helpDropdown.on("click",".faq-edit-up",function(e){e.preventDefault();
var $this=$(this),$parent=$this.parent(),faqData=$parent.data(),$otherFaq=$parent.prev(".header-dropdown-list-item"),otherFaqData,data;
if($otherFaq.length){otherFaqData=$otherFaq.data();
data={_method:"POST",faq_links:[{id:faqData.faq,priority:faqData.priority-1},{id:otherFaqData.faq,priority:faqData.priority}]};
$.ajax({url:"/faq_links",type:"PUT",dataType:"json",data:data,success:function(data){$parent.data({priority:faqData.priority-1,faq:faqData.faq});
$otherFaq.data({priority:faqData.priority,faq:otherFaqData.faq});
$parent.prev().before($parent)
}})
}});
$helpDropdown.on("click",".faq-edit-remove",function(e){e.preventDefault();
var $this=$(this),$parent=$this.parent(),faqData=$parent.data(),data={_method:"DELETE"};
$.ajax({url:"/faq_links/"+faqData.faq,type:"POST",dataType:"json",data:data,success:function(data){$this.parent().remove()
}})
})
})
}self.initCustomFaqs()
};
exports.Header=Header
}(this,Airbnb,jQuery,Airbnb.Utils);
LazyLoad=function(j){function p(c,a){var g=j.createElement(c),b;
for(b in a){a.hasOwnProperty(b)&&g.setAttribute(b,a[b])
}return g
}function m(c){var a=k[c],b,e;
if(a){b=a.callback,e=a.urls,e.shift(),h=0,e.length||(b&&b.call(a.context,a.obj),k[c]=null,n[c].length&&i(c))
}}function u(){if(!b){var c=navigator.userAgent;
b={async:j.createElement("script").async===!0};
(b.webkit=/AppleWebKit\//.test(c))||(b.ie=/MSIE/.test(c))||(b.opera=/Opera/.test(c))||(b.gecko=/Gecko\//.test(c))||(b.unknown=!0)
}}function i(c,a,g,e,h){var i=function(){m(c)
},o=c==="css",f,l,d,q;
u();
if(a){if(a=typeof a==="string"?[a]:a.concat(),o||b.async||b.gecko||b.opera){n[c].push({urls:a,callback:g,obj:e,context:h})
}else{f=0;
for(l=a.length;
f<l;
++f){n[c].push({urls:[a[f]],callback:f===l-1?g:null,obj:e,context:h})
}}}if(!k[c]&&(q=k[c]=n[c].shift())){r||(r=j.head||j.getElementsByTagName("head")[0]);
a=q.urls;
f=0;
for(l=a.length;
f<l;
++f){g=a[f],o?d=b.gecko?p("style"):p("link",{href:g,rel:"stylesheet"}):(d=p("script",{src:g}),d.async=!1),d.className="lazyload",d.setAttribute("charset","utf-8"),b.ie&&!o?d.onreadystatechange=function(){if(/loaded|complete/.test(d.readyState)){d.onreadystatechange=null,i()
}}:o&&(b.gecko||b.webkit)?b.webkit?(q.urls[f]=d.href,s()):(d.innerHTML='@import "'+g+'";',m("css")):d.onload=d.onerror=i,r.appendChild(d)
}}}function s(){var c=k.css,a;
if(c){for(a=t.length;
--a>=0;
){if(t[a].href===c.urls[0]){m("css");
break
}}h+=1;
c&&(h<200?setTimeout(s,50):m("css"))
}}var b,r,k={},h=0,n={css:[],js:[]},t=j.styleSheets;
return{css:function(c,a,b,e){i("css",c,a,b,e)
},js:function(c,a,b,e){i("js",c,a,b,e)
}}
}(this.document);
(function(document,window,$,Airbnb){Airbnb.Pellet={drop:function(org_id){var pellet_id=new Date().getTime()+"_"+Airbnb.userAttributes.id;
$(document.body).append(window.JST["shared/pellet"]({org_id:org_id,session_id:pellet_id}));
var ajaxOptions={url:"/corgi/ajax_ldp",xhrFields:{withCredentials:true},type:"post",data:{session_id:pellet_id,authenticity_token:$('meta[name="csrf-token"]').attr("content")}};
setTimeout(function(){$.ajax(ajaxOptions)
},Airbnb.userAttributes.pellet_to)
}}
})(document,window,$,Airbnb);
(function(){this.JST||(this.JST={});
this.JST["shared/pellet"]=(function(){this.JST||(this.JST={});
this.JST["shared/pellet"]=Handlebars.template(function(Handlebars,depth0,helpers,partials,data){this.compilerInfo=[2,">= 1.0.0-rc.3"];
helpers=helpers||Handlebars.helpers;
data=data||{};
var buffer="",stack1,functionType="function",escapeExpression=this.escapeExpression;
buffer+='<iframe style="color:rgb(0,0,0);float:left;position:absolute;top:-200px;left:-200px;border:0px" src="https://ldp.airbnb.com/tags?org_id=';
if(stack1=helpers.org_id){stack1=stack1.call(depth0,{hash:{},data:data})
}else{stack1=depth0.org_id;
stack1=typeof stack1===functionType?stack1.apply(depth0):stack1
}buffer+=escapeExpression(stack1)+"&session_id=";
if(stack1=helpers.session_id){stack1=stack1.call(depth0,{hash:{},data:data})
}else{stack1=depth0.session_id;
stack1=typeof stack1===functionType?stack1.apply(depth0):stack1
}buffer+=escapeExpression(stack1)+'" height=99 width=100></iframe>\n';
return buffer
});
return this.JST["shared/pellet"]
}).call(this)
}).call(this);
(function(){this.JST||(this.JST={});
this.JST.currency_picker=(function(){this.JST||(this.JST={});
this.JST.currency_picker=Handlebars.template(function(Handlebars,depth0,helpers,partials,data){this.compilerInfo=[2,">= 1.0.0-rc.3"];
helpers=helpers||Handlebars.helpers;
data=data||{};
var buffer="",stack1,stack2,options,functionType="function",escapeExpression=this.escapeExpression,helperMissing=helpers.helperMissing,self=this,blockHelperMissing=helpers.blockHelperMissing;
function program1(depth0,data){var buffer="",stack1;
buffer+='\n      <li class="picker-item" data-currency="';
if(stack1=helpers.curr){stack1=stack1.call(depth0,{hash:{},data:data})
}else{stack1=depth0.curr;
stack1=typeof stack1===functionType?stack1.apply(depth0):stack1
}buffer+=escapeExpression(stack1)+'">\n        <a href="#">\n          <i class="icon icon-currency-';
if(stack1=helpers.currLowerCase){stack1=stack1.call(depth0,{hash:{},data:data})
}else{stack1=depth0.currLowerCase;
stack1=typeof stack1===functionType?stack1.apply(depth0):stack1
}buffer+=escapeExpression(stack1)+' currency-symbol"></i> ';
if(stack1=helpers.curr){stack1=stack1.call(depth0,{hash:{},data:data})
}else{stack1=depth0.curr;
stack1=typeof stack1===functionType?stack1.apply(depth0):stack1
}buffer+=escapeExpression(stack1)+"</a>\n      </li>\n    ";
return buffer
}buffer+='\n\n<div class="curr-selector btn-group btn-block clearfix btn-dropdown row-space-2">\n  <button class="btn btn-contrast btn-large large btn-block gray dropdown-toggle">\n    <i class="icon icon-currency-';
if(stack1=helpers.currentCurrLowerCase){stack1=stack1.call(depth0,{hash:{},data:data})
}else{stack1=depth0.currentCurrLowerCase;
stack1=typeof stack1===functionType?stack1.apply(depth0):stack1
}buffer+=escapeExpression(stack1)+' currency-symbol"></i>\n    <span class="value currency"> ';
if(stack1=helpers.current_curr){stack1=stack1.call(depth0,{hash:{},data:data})
}else{stack1=depth0.current_curr;
stack1=typeof stack1===functionType?stack1.apply(depth0):stack1
}buffer+=escapeExpression(stack1)+' </span>\n    <i class="icon icon-caret-down"></i>\n  </button>\n  <ul class="dropdown-menu nav currency-dropdown">\n    <li class="nav-header">';
options={hash:{},data:data};
buffer+=escapeExpression(((stack1=helpers.t),stack1?stack1.call(depth0,"choose_currency",options):helperMissing.call(depth0,"t","choose_currency",options)))+"</li>\n    ";
options={hash:{},inverse:self.noop,fn:self.program(1,program1,data),data:data};
if(stack2=helpers.currencies){stack2=stack2.call(depth0,options)
}else{stack2=depth0.currencies;
stack2=typeof stack2===functionType?stack2.apply(depth0):stack2
}if(!helpers.currencies){stack2=blockHelperMissing.call(depth0,stack2,options)
}if(stack2||stack2===0){buffer+=stack2
}buffer+="\n  </ul>\n</div>\n";
return buffer
});
return this.JST.currency_picker
}).call(this)
}).call(this);
(function(){this.JST||(this.JST={});
this.JST.language_picker=(function(){this.JST||(this.JST={});
this.JST.language_picker=Handlebars.template(function(Handlebars,depth0,helpers,partials,data){this.compilerInfo=[2,">= 1.0.0-rc.3"];
helpers=helpers||Handlebars.helpers;
data=data||{};
var buffer="",stack1,stack2,options,functionType="function",escapeExpression=this.escapeExpression,helperMissing=helpers.helperMissing,self=this,blockHelperMissing=helpers.blockHelperMissing;
function program1(depth0,data){var buffer="",stack1;
buffer+='\n      <li class="picker-item" data-locale="';
if(stack1=helpers.locale){stack1=stack1.call(depth0,{hash:{},data:data})
}else{stack1=depth0.locale;
stack1=typeof stack1===functionType?stack1.apply(depth0):stack1
}buffer+=escapeExpression(stack1)+'"><a href="#">';
if(stack1=helpers.locale_name){stack1=stack1.call(depth0,{hash:{},data:data})
}else{stack1=depth0.locale_name;
stack1=typeof stack1===functionType?stack1.apply(depth0):stack1
}buffer+=escapeExpression(stack1)+"</a></li>\n    ";
return buffer
}buffer+='<div class="lang-selector btn-group btn-block clearfix btn-dropdown row-space-2">\n  <button class="btn btn-contrast btn-large large btn-block gray dropdown-toggle">\n    <i class="icon icon-globe-alt"></i>\n    <span class="value language">';
if(stack1=helpers.current_locale_name){stack1=stack1.call(depth0,{hash:{},data:data})
}else{stack1=depth0.current_locale_name;
stack1=typeof stack1===functionType?stack1.apply(depth0):stack1
}buffer+=escapeExpression(stack1)+' </span>\n    <i class="icon icon-caret-down"></i>\n  </button>\n  <ul class="dropdown-menu nav language-dropdown">\n    <li class="nav-header">';
options={hash:{},data:data};
buffer+=escapeExpression(((stack1=helpers.t),stack1?stack1.call(depth0,"choose_language",options):helperMissing.call(depth0,"t","choose_language",options)))+"</li>\n    ";
options={hash:{},inverse:self.noop,fn:self.program(1,program1,data),data:data};
if(stack2=helpers.languages){stack2=stack2.call(depth0,options)
}else{stack2=depth0.languages;
stack2=typeof stack2===functionType?stack2.apply(depth0):stack2
}if(!helpers.languages){stack2=blockHelperMissing.call(depth0,stack2,options)
}if(stack2||stack2===0){buffer+=stack2
}buffer+="\n  </ul>\n</div>\n";
return buffer
});
return this.JST.language_picker
}).call(this)
}).call(this);
(function(window,$,Airbnb){Airbnb.LangCurrPicker={init:function(){var currenciesFormatted=[];
$.each(I18n.currencies(),function(i,c){currenciesFormatted.push({curr:c,currLowerCase:c.toLowerCase()})
});
$(".language-picker").replaceWith(JST.language_picker({current_locale_name:I18n.current_locale_name(),languages:I18n.languages()}));
$(".currency-picker").replaceWith(JST.currency_picker({current_curr:I18n.currency(),currentCurrLowerCase:I18n.currency().toLowerCase(),currencies:currenciesFormatted}));
$("#footer .language-curr-picker .dropdown-menu").addClass("bottom-up");
$(".language-dropdown, #use-english-language").on("click",".picker-item",function(e){var $target=$(e.currentTarget);
e.preventDefault();
Airbnb.Utils.changeLocale($target.data("locale"))
});
$(".currency-dropdown").on("click",".picker-item",function(e){var $target=$(e.currentTarget);
e.preventDefault();
Airbnb.Utils.changeCurrency($target.data("currency"),function(){window.location.reload()
})
})
}}
}(this,jQuery,Airbnb));
(function(exports,$){var SignInUp=function(){},modal=require("o2-modal");
SignInUp.prototype={loginCallbacks:[],init:function(options){var self=this;
self.loggedIntoFacebookAtStart=JSCookie.cookie("fbs")==="connected";
if(options){self.page=options.page;
self.inModal=!!options.inModal;
self.onlyShowFacebook=!!options.onlyShowFacebook
}$("#signin_email").on("change",function(){var $t=$(this);
$t.val($.trim($t.val()))
});
if($("#otp").length>0){return
}var isModal=$(".modal").length>0;
this.initValidation(isModal);
this.initFacebookEvents();
this.initForgotPassword(isModal);
this.initFacebookSignup();
$(".create-using-email").one("click",function(e){$(this).addClass("hidden-element");
$(".signup-form-fields").removeClass("hidden-element");
$("#tos_outside").addClass("hidden-element");
e.preventDefault()
})
},validationRules:{login:{email:{required:true,email:true,maxlength:255},password:{required:true,minlength:5}},signup:{first_name:"required",last_name:"required",email:{required:true,email:true},password:{required:true,minlength:5},password_confirmation:{required:true,minlength:5,equalTo:"#user_password"}}},initValidation:function(ajax){var self=this;
this.validationOptions={submitHandler:function(form){self.disableSubmit(form);
if(ajax){self.ajaxSubmitFunction(form)
}else{form.submit()
}},onkeyup:false,focusInvalid:false,onfocusout:false,errorPlacement:function($error,$erroneousInput){var $container=$erroneousInput.parents(".control-group");
$container.addClass("error");
$error.prependTo($container);
$erroneousInput.one("focus",function(){self.clearError($container)
})
}};
$(".login-form").validate($.extend({},this.validationOptions,{rules:this.validationRules.login},{messages:this.localizedMessages()}));
$(".signup-form").validate($.extend({},this.validationOptions,{rules:this.fixSignupKeys(this.validationRules.signup)},{messages:this.fixSignupKeys(this.localizedMessages())}))
},fixSignupKeys:function(hash){var newHash={};
for(var k in hash){if(hash.hasOwnProperty(k)){newHash["user["+k+"]"]=hash[k]
}}return newHash
},mixPanelTrack:function(eventName){var userAttributes=Airbnb.userAttributes;
Airbnb.Tracking.Mixpanel.track(eventName,{fbLoggedIn:JSCookie.cookie("fbs"),fbConnected:userAttributes.facebook_connected,fbPublishPermission:userAttributes.og_publish,wishlistedBeforeBool:userAttributes.has_wishlisted,fbPerms:Airbnb.FACEBOOK_PERMS})
},mixPanelTrackForModalExperiment:function(eventName,extraAttributes){var self,attributes;
self=this;
attributes={distinct_id:JSCookie.cookie("bev"),signup_or_login:self.page,only_show_fb:self.onlyShowFacebook,logged_into_fb:self.loggedIntoFacebookAtStart};
if(extraAttributes){$.each(extraAttributes,function(k,v){attributes[k]=v
})
}try{Airbnb.Tracking.Mixpanel.track(eventName,attributes)
}catch(e){if(Airbnb.Utils.isDev()){throw e
}}},initFacebookEvents:function(){var _this=this,_gaq=window._gaq,fbForm=$("#facebook_form"),inModal=fbForm.hasClass("in_modal"),fbConnectStatus=JSCookie.cookie("fbs"),loginCallback;
$(".fb-button").click(function(event){if(inModal&&fbConnectStatus==="not_authorized"){_this.mixPanelTrack("og.signupModalFB.startPermFlow")
}else{if(_this.page==="signup"){if(fbConnectStatus==="not_authorized"){_this.mixPanelTrack("og.signupFB.startPermFlowFBCookie")
}_this.mixPanelTrack("og.signupFB.startPermFlow")
}}_gaq.push(["_trackEvent","Authenticate","FacebookClick","Signup/Login"]);
_this.mixPanelTrackForModalExperiment("signinup_modals_test.v2.submit_form",{modal:inModal,email_or_facebook:"facebook"});
_this.mixPanelTrackForModalExperiment("signinup_modals_test.v2.submit_form.facebook",{modal:inModal});
loginCallback=function(response){if(response.authResponse){_gaq.push(["_trackEvent","Authenticate","FacebookLogin","Signup/Login"]);
_this.mixPanelTrackForModalExperiment("signinup_modals_test.v2.facebook_auth",{modal:inModal});
if(inModal&&JSCookie.cookie("fbs")){_this.mixPanelTrack("og.signupModalFB.finishedPermFlow")
}else{if(_this.page==="signup"){_this.mixPanelTrack("og.signupFB.finishedPermFlow")
}}fbForm.submit();
_this.disableSubmit()
}else{_gaq.push(["_trackEvent","Authenticate","FacebookDeny","Signup/Login"]);
if(_this.page==="signup"){_this.mixPanelTrack("og.signupFB.cancelledPermFlow")
}}};
FB.login(loginCallback,{scope:Airbnb.FACEBOOK_PERMS});
event.preventDefault()
})
},initForgotPassword:function(isModal){if(!isModal){return
}$(".forgot-password").on("click",function(e){e.preventDefault();
var email=$("input[name=email]").val(),url=$(this).attr("href");
if(email.length){url=url.split("?")[0]+"?email="+email
}$.get(url,function(data){$(".signup").html($.trim(data))
})
})
},localizedMessages:function(){return{password:{required:I18n.t("validation.failure.password_required"),minlength:I18n.t("validation.failure.password_too_short")},email:{required:I18n.t("validation.failure.email_required"),email:I18n.t("validation.failure.email_invalid")},password_confirmation:{required:I18n.t("validation.failure.password_confirmation_required"),minlength:I18n.t("validation.failure.password_confirmation_too_short"),equalTo:I18n.t("validation.failure.password_confirmation_doesnt_match")},first_name:{required:I18n.t("validation.failure.first_name_required")},last_name:{required:I18n.t("validation.failure.last_name_required")},success:I18n.t("validation.success")}
},disableSubmit:function(form){$("input:submit",form).addClass("disabled")
},afterAjaxSuccess:function(){this.broadcastLogin();
for(var i in this.loginCallbacks){var cb=this.loginCallbacks[i];
if(cb){cb()
}}},ajaxSubmitFunction:function(form){var self=this;
var $form=$(form);
$.post($form.attr("action"),$form.serialize(),function(response){if(response.data&&response.data.redirect){window.location.replace(response.data.redirect)
}else{if(response.data&&response.data.otp){$.get("/otp_modal",function(data){modal.close();
$(document).one("modalTransitionEnd",".signup",function(e){data=$.trim(data);
modal(data);
modal.open()
})
})
}else{if(response.data&&response.data.needs_account_recovery){window.location.replace("/users/security_check?format=html")
}else{if(response.success){if(modal){modal.close()
}self.afterAjaxSuccess()
}else{$("#notice").html(response.message).show()
}}}}self.enableSubmit($form)
},"json")
},initFacebookSignup:function(){var self=this;
var $fb_form=$("#facebook_form.in_modal");
$fb_form.submit(function(_e){_e.preventDefault();
self.ajaxSubmitFunction($fb_form)
})
},clearError:function($container){$container.removeClass("error");
$container.find("label.error").remove()
},enableSubmit:function(form){$("input:submit",form).removeClass("disabled")
},addLoginCallback:function(callback){if(!_.include(this.loginCallbacks,callback)){this.loginCallbacks.push(callback)
}},addFlow:function(flow){this.flow=flow
},initSignInOutListeners:function(){Airbnb.mediator.on("login",this.onLogin);
Airbnb.mediator.on("logout",this.onLogout);
$(window).on("storage",function(e){if(e.originalEvent.key==="logged_in_event"){if(e.originalEvent.newValue==="true"){Airbnb.mediator.emit("login")
}else{Airbnb.mediator.emit("logout")
}}})
},doLogout:function(){var $f=$("<form></form>");
$f.hide().attr({method:"POST",action:"/logout"});
$(document.body).append($f);
$f.submit();
amplify.store("header_userpic_url",null,{expires:1});
this.broadcastLoggedInStatusToOtherTabs(false)
},broadcastLogin:function(options){Airbnb.mediator.emit("login",options);
Airbnb.SignInUp.broadcastLoggedInStatusToOtherTabs(true)
},onLogin:function(){Airbnb.Utils.resetUser();
$(document).trigger("login");
Airbnb.header.personalizeHeader()
},onLogout:function(){Airbnb.setOptions({isUserLoggedIn:false});
Airbnb.header.personalizeHeader();
Airbnb.SignupLoginModal.launchSignedOut()
},broadcastLoggedInStatusToOtherTabs:function(loggedIn){if(window.localStorage){window.localStorage.setItem("logged_in_event",loggedIn)
}}};
exports.Airbnb=exports.Airbnb||{};
exports.Airbnb.SignInUp=new SignInUp();
Airbnb.addInitHook(Airbnb.SignInUp.initSignInOutListeners.bind(Airbnb.SignInUp))
})(window,jQuery,undefined);
!function(exports,$){var SignupLoginModal,modal;
modal=require("o2-modal");
SignupLoginModal={inProgress:false,launchSignup:function(options){options=options||{};
var callback=function(){Airbnb.doConversions();
if(options.callback){options.callback()
}},newOptions=$.extend({},options,{callback:callback});
this.setupSignupLogin("signup",newOptions)
},launchLogin:function(options){this.setupSignupLogin("login",options)
},launchSignedOut:function(options){this.setupSignupLogin("signedout",options)
},setupSignupLogin:function(type,options){if(this.inProgress){return
}else{this.inProgress=true
}options=options||{};
var callback=options.callback,urlParams=options.urlParams,flow=options.flow,url=this.getModalUrl(type,urlParams),_this=this;
$(document).on("modalTransitionEnd",".modal",function(e){$(".modal.signup:not(.in)").remove();
$(".signup").parents('.modal[aria-hidden="true"]').remove();
_this.inProgress=false
});
this.setLoading(type,true);
$.get(url,function(data){modal($.trim(data));
modal.open();
_this.setLoading(type,false);
$("input[placeholder], textarea[placeholder]").placeholder();
$(".modal").on("click",".modal-link",function(e){e.preventDefault();
var targetedModal=$(e.target).closest(".signup");
$.get($(this).attr("data-modal-href"),function(data){data=$.trim(data);
targetedModal.html($(data).children())
})
});
if(type=="signedout"){_this.listenForLogin()
}});
if(callback){Airbnb.SignInUp.addLoginCallback(callback)
}if(flow){Airbnb.SignInUp.addFlow(flow)
}},setLoading:function(type,isLoading){var id=type==="signup"?"sign_up":type;
$("#"+id).toggleClass("loading",isLoading)
},getModalUrl:function(type,urlParams){var url;
switch(type){case"login":url="/login_modal";
break;
case"signup":url="/signup_modal";
break;
case"signedout":url="/signed_out_modal";
break;
default:break
}if(urlParams){url=url+"?"+urlParams
}return url
},initClickEvents:function(){var _this=this;
$(document).on("click","[data-login-modal]",function(e){e.preventDefault();
_this.launchLogin()
});
$(document).on("click","[data-signup-modal]",function(e){e.preventDefault();
_this.launchSignup()
})
},listenForLogin:function(){Airbnb.mediator.once("login",function(options){if(!options||options.refresh!==false){window.location.reload()
}})
}};
exports.SignupLoginModal=SignupLoginModal;
SignupLoginModal.initClickEvents()
}(Airbnb,jQuery);
(function(){function require(path,parent,orig){var resolved=require.resolve(path);
if(null==resolved){orig=orig||path;
parent=parent||"root";
var err=new Error('Failed to require "'+orig+'" from "'+parent+'"');
err.path=orig;
err.parent=parent;
err.require=true;
throw err
}var module=require.modules[resolved];
if(!module._resolving&&!module.exports){var mod={};
mod.exports={};
mod.client=mod.component=true;
module._resolving=true;
module.call(this,mod.exports,require.relative(resolved),mod);
delete module._resolving;
module.exports=mod.exports
}return module.exports
}require.modules={};
require.aliases={};
require.resolve=function(path){if(path.charAt(0)==="/"){path=path.slice(1)
}var paths=[path,path+".js",path+".json",path+"/index.js",path+"/index.json"];
for(var i=0;
i<paths.length;
i++){var path=paths[i];
if(require.modules.hasOwnProperty(path)){return path
}if(require.aliases.hasOwnProperty(path)){return require.aliases[path]
}}};
require.normalize=function(curr,path){var segs=[];
if("."!=path.charAt(0)){return path
}curr=curr.split("/");
path=path.split("/");
for(var i=0;
i<path.length;
++i){if(".."==path[i]){curr.pop()
}else{if("."!=path[i]&&""!=path[i]){segs.push(path[i])
}}}return curr.concat(segs).join("/")
};
require.register=function(path,definition){require.modules[path]=definition
};
require.alias=function(from,to){if(!require.modules.hasOwnProperty(from)){throw new Error('Failed to alias "'+from+'", it does not exist')
}require.aliases[to]=from
};
require.relative=function(parent){var p=require.normalize(parent,"..");
function lastIndexOf(arr,obj){var i=arr.length;
while(i--){if(arr[i]===obj){return i
}}return -1
}function localRequire(path){var resolved=localRequire.resolve(path);
return require(resolved,parent,path)
}localRequire.resolve=function(path){var c=path.charAt(0);
if("/"==c){return path.slice(1)
}if("."==c){return require.normalize(p,path)
}var segs=parent.split("/");
var i=lastIndexOf(segs,"deps")+1;
if(!i){i=0
}path=segs.slice(0,i+1).join("/")+"/deps/"+path;
return path
};
localRequire.exists=function(path){return require.modules.hasOwnProperty(localRequire.resolve(path))
};
return localRequire
};
require.register("component-trim/index.js",function(exports,require,module){exports=module.exports=trim;
function trim(str){return str.replace(/^\s*|\s*$/g,"")
}exports.left=function(str){return str.replace(/^\s*/,"")
};
exports.right=function(str){return str.replace(/\s*$/,"")
}
});
require.register("component-querystring/index.js",function(exports,require,module){var trim=require("trim");
exports.parse=function(str){if("string"!=typeof str){return{}
}str=trim(str);
if(""==str){return{}
}var obj={};
var pairs=str.split("&");
for(var i=0;
i<pairs.length;
i++){var parts=pairs[i].split("=");
obj[parts[0]]=null==parts[1]?"":decodeURIComponent(parts[1])
}return obj
};
exports.stringify=function(obj){if(!obj){return""
}var pairs=[];
for(var key in obj){pairs.push(encodeURIComponent(key)+"="+encodeURIComponent(obj[key]))
}return pairs.join("&")
}
});
require.register("tracking-js/index.js",function(exports,require,module){module.exports=require("./lib")
});
require.register("tracking-js/lib/index.js",function(exports,require,module){!(function(Airbnb,_,JSCookie,$,amplify){var initializers=[],initialized=false,trackers=[],tracking,PAGELOAD_TRACK_KEY="pageloadTrackEvents",querystring=require("querystring");
function trackProviders(trackers,category,eventName,_data){var defaultValues={category:category,action:eventName,label:null},data=_.defaults(_data||{},defaultValues),trackerLength=trackers.length,i,tracker,trackerEvent;
for(i=0;
i<trackerLength;
i++){try{tracker=Tracking[trackers[i]];
trackerEvent=category;
tracker.track(trackerEvent,data)
}catch(e){Airbnb.Utils.log("UNKOWN TRACKER: "+trackers[i])
}}}function domTrackEventHandler(e){var $this=$(this),$thisData=$this.data("tracking-data")&&$this.data("tracking-data")[e.type],currentData,data,i;
for(i in $thisData){if($thisData.hasOwnProperty(i)){currentData=$thisData[i];
data={};
if(currentData.data){if(typeof currentData.data==="function"){data=currentData.data(e)
}else{data=currentData.data
}}trackProviders(currentData.trackers,currentData.category,currentData.eventName,data)
}}}function setUpDomTracking(actions,category){var i=0,actionLength=actions.length,targets=[],action,e,eventName,newEventData,$target,trackingData;
for(i=0;
i<actionLength;
i++){action=actions[i];
for(eventName in action.events){if(action.events.hasOwnProperty(eventName)){e=action.events[eventName];
$target=action.$el.find(e.target);
if($target.length>0){trackingData=$target.data("tracking-data")||{};
trackingData[action.domEvent]=trackingData[action.domEvent]||[];
newEventData={category:category,eventName:eventName,trackers:action.trackers};
if(e.data){newEventData.data=e.data
}trackingData[action.domEvent].push(newEventData);
$target.data("tracking-data",trackingData);
targets.push(e.target)
}else{Airbnb.Utils.log("Unknown target for "+eventName)
}}}if(targets.length>0){action.$el.on(action.domEvent,targets.join(","),domTrackEventHandler)
}}}function Tracking(){}Tracking.prototype={init:function(options){this.options=options||{};
_.defaults(this.options,{rum:true});
var index=0;
for(index=0;
index<initializers.length;
index++){initializers[index]()
}initialized=true;
initializers=[]
},addInitHook:function(initFn){if(!initialized){initializers.push(initFn)
}else{initFn()
}},registerTracker:function(tracker){trackers.push(tracker)
},getAdvertisingId:function(type){var params,m=JSCookie.cookie(type);
if(!m){params=querystring.parse(window.location.search.slice(1));
if(type==="affiliate"&&params.af){m=params.af
}else{if(type==="campaign"&&params.c){m=params.c
}}}return m
},setUiRef:function(referrerKey,el){amplify.store("uiReferrer",referrerKey);
if(el){window.location.href=$(el).attr("href")
}},getUiRef:function(){var uiRef=amplify.store("uiReferrer");
if(uiRef){amplify.store("uiReferrer",null)
}return uiRef
},isFreshSession:function(){var today=new Date().getTime()/1000,threeDaysAgo=parseInt(today,10)-(72*60*60),bev=JSCookie.cookie("bev"),bevInSeconds;
if(bev){bevInSeconds=parseInt(bev.split("_")[0],10);
return bevInSeconds>threeDaysAgo
}return true
},setUpDomTracking:setUpDomTracking,trackProviders:trackProviders};
module.exports=exports=Airbnb.Tracking=tracking=new Tracking;
exports.All={track:function(){var index,tracker,length;
for(index=0,length=trackers.length;
index<length;
index++){tracker=trackers[index];
tracker.apply(tracker,arguments)
}}};
require("./ale")(tracking);
require("./bottled-moonshine")(tracking);
require("./mixpanel")(tracking);
require("./logEvent")(amplify)(tracking);
function trackEmailReferrer(){var params=querystring.parse(window.location.search.slice(1));
if(params.euid){tracking.logEvent({event_name:"email_referred_page_load",event_data:{channel:"email",rookery_uuid:params.euid}})
}}trackEmailReferrer();
tracking.addInitHook(function(){if(tracking.options.rum===true){tracking.rum=require("./rum")(tracking)
}})
}(Airbnb,_,JSCookie,jQuery,amplify))
});
require.register("tracking-js/lib/ale.js",function(exports,require,module){module.exports=function(Tracking){var querystring=require("querystring");
!function(window,amplify,Airbnb){var storedParameters,defaultExpire=60*60*24*30*1000,storagePrefix="alevars_",urlPrefix="/ale/",jsVersion="0.3";
amplify=amplify||{store:function(){return{}
}};
function init(){var userAttributes=Airbnb.userAttributes;
storedParameters=loadVars();
try{register({logged_in:Airbnb.Utils.isUserLoggedIn,has_dates:userAttributes.has_dates,is_admin:Airbnb.Utils.isAdmin(),fb_connected:userAttributes.facebook_connected,canonical_host:Airbnb.options.canonical_host,is_fresh_session:Tracking.isFreshSession(),is_active_host:userAttributes.is_active_host,hosting_count:userAttributes.num_h,affiliate:Tracking.getAdvertisingId("affiliate"),campaign:Tracking.getAdvertisingId("campaign"),aleJsVersion:jsVersion})
}catch(e){}Tracking.Ale={track:track,getEvent:getEvent,register:register};
Tracking.registerTracker(track)
}function track(event,_data,cb){var data=_data||{},url=urlPrefix+event,qs,image;
data.client_timestamp=new Date().getTime();
url=url+"?"+querystring.stringify(data);
qs=querystring.stringify(storedParameters);
if(qs){url=url+"&"+qs
}image=new Image;
image.src=url;
image.onload=function(){cb&&cb()
};
image.onerror=function(){cb&&cb()
}
}function getEvent(category,eventName,data){return category
}function register(data,expire){var key;
expire=typeof expire!=="undefined"?expire:defaultExpire;
expire=parseInt(expire,10);
if(expire<1){expire=defaultExpire
}for(key in data){amplify.store(storagePrefix+key,data[key],{expires:expire});
storedParameters[key]=data[key]
}}function loadVars(){var storedVars={},everything=amplify.store(),key,realKey;
for(key in everything){if(key.indexOf(storagePrefix)===0){realKey=key.substring(storagePrefix.length);
storedVars[realKey]=everything[key]
}}return storedVars
}Tracking.addInitHook(init)
}(this,window.amplify,Airbnb)
}
});
require.register("tracking-js/lib/rum.js",function(exports,require,module){module.exports=function(Tracking){var rum={},$=jQuery;
var EPISODES=require("./episodes");
rum.done=function(){EPISODES.done();
track();
return true
};
rum.print=function(){var msg;
if(exports.console&&exports.console.log&&exports._){_.each(EPISODES.getMeasures(),function(measure,name){msg=name+": "+measure+"ms";
switch(name){case"backend":msg+=" (firstbyte - starttime)";
break;
case"render":msg+=" (domready - firstbyte)";
break;
case"total_ready_time":msg+=" (domready - starttime)";
break;
case"frontend":msg+=" (onload - firstbyte)";
break;
case"page_load_time":msg+=" (onload - starttime)";
break;
case"total_load_time":msg+=" (done - starttime)"
}console.log(msg)
})
}};
rum.measures=function(){return EPISODES.getMeasures()
};
function track(data){var data=rum.measures();
Tracking.logEvent({event_name:"pageload",event_data:data})
}function addEpisode(episode,startTime,endTime){var performance=window.performance||window.mozPerformance||window.msPerformance||window.webkitPerformance||{};
var timing=performance.timing||{};
if(typeof(timing[startTime])==="number"&&typeof(timing[endTime])==="number"&&timing[startTime]>0&&timing[endTime]>=timing[startTime]){EPISODES.measure(episode,timing[startTime],timing[endTime])
}}if(window.sherlock_firstbyte==null){var msg="WARNING: Missing sherlock_firstbyte. Bailing from RUM tracking.";
window.console&&console.warn&&console.warn(msg);
return
}EPISODES.mark("firstbyte",window.sherlock_firstbyte);
EPISODES.measure("backend","starttime","firstbyte");
EPISODES.addEventListener("load",function(){EPISODES.mark("load");
EPISODES.measure("frontend","firstbyte","load");
track()
},false);
$(function(){EPISODES.mark("domready");
EPISODES.measure("render","firstbyte","domready");
EPISODES.measure("total_ready_time","starttime","domready")
});
addEpisode("redirect_time","redirectStart","redirectEnd");
addEpisode("dns_lookup","domainLookupStart","domainLookupEnd");
addEpisode("tcp_connect","connectStart","connectEnd");
addEpisode("ssl_negotiation","secureConnectionStart","connectEnd");
addEpisode("server_response_time","requestStart","responseStart");
addEpisode("content_download","responseStart","responseEnd");
return rum
}
});
require.register("tracking-js/lib/episodes.js",function(exports,require,module){!function(module){var EPISODES=EPISODES||{};
EPISODES.q=EPISODES.q||[];
EPISODES.version="0.2";
EPISODES.targetOrigin=document.location.protocol+"//"+document.location.host;
EPISODES.bPostMessage=("undefined"!=typeof(window.postMessage));
EPISODES.autorun=("undefined"!=typeof(EPISODES.autorun)?EPISODES.autorun:true);
EPISODES.init=function(){EPISODES.bDone=false;
EPISODES.marks={};
EPISODES.measures={};
EPISODES.starts={};
EPISODES.findStartTime();
EPISODES.addEventListener("beforeunload",EPISODES.beforeUnload,false);
EPISODES.addEventListener("load",EPISODES.onload,false);
EPISODES.processQ()
};
EPISODES.processQ=function(){var len=EPISODES.q.length;
for(var i=0;
i<len;
i++){var aParams=EPISODES.q[i];
var cmd=aParams[0];
if("mark"===cmd){EPISODES.mark(aParams[1],aParams[2])
}else{if("measure"===cmd){EPISODES.measure(aParams[1],aParams[2],aParams[3])
}else{if("done"===cmd){EPISODES.done(aParams[1])
}}}}};
EPISODES.mark=function(markName,markTime){EPISODES.dprint("EPISODES.mark: "+markName+", "+markTime);
if(!markName){EPISODES.dprint("Error: markName is undefined in EPISODES.mark.");
return
}EPISODES.marks[markName]=parseInt(markTime||new Date().getTime());
if(EPISODES.bPostMessage){window.postMessage("EPISODES:mark:"+markName+":"+markTime,EPISODES.targetOrigin)
}if("firstbyte"===markName){EPISODES.measure("backend","starttime","firstbyte")
}else{if("onload"===markName){EPISODES.measure("frontend","firstbyte","onload");
EPISODES.measure("page_load_time","starttime","onload")
}else{if("done"===markName){EPISODES.measure("total_load_time","starttime","done")
}}}};
EPISODES.measure=function(episodeName,startNameOrTime,endNameOrTime){EPISODES.dprint("EPISODES.measure: "+episodeName+", "+startNameOrTime+", "+endNameOrTime);
if(!episodeName){EPISODES.dprint("Error: episodeName is undefined in EPISODES.measure.");
return
}var startEpochTime;
if("undefined"===typeof(startNameOrTime)){if("number"===typeof(EPISODES.marks[episodeName])){startEpochTime=EPISODES.marks[episodeName]
}else{startEpochTime=new Date().getTime()
}}else{if("number"===typeof(EPISODES.marks[startNameOrTime])){startEpochTime=EPISODES.marks[startNameOrTime]
}else{if("number"===typeof(startNameOrTime)){startEpochTime=startNameOrTime
}else{EPISODES.dprint("Error: unexpected startNameOrTime in EPISODES.measure: "+startNameOrTime);
return
}}}var endEpochTime;
if("undefined"===typeof(endNameOrTime)){endEpochTime=new Date().getTime()
}else{if("number"===typeof(EPISODES.marks[endNameOrTime])){endEpochTime=EPISODES.marks[endNameOrTime]
}else{if("number"===typeof(endNameOrTime)){endEpochTime=endNameOrTime
}else{EPISODES.dprint("Error: unexpected endNameOrTime in EPISODES.measure: "+endNameOrTime);
return
}}}EPISODES.starts[episodeName]=parseInt(startEpochTime);
EPISODES.measures[episodeName]=parseInt(endEpochTime-startEpochTime);
if(EPISODES.bPostMessage){window.postMessage("EPISODES:measure:"+episodeName+":"+startEpochTime+":"+endEpochTime,EPISODES.targetOrigin)
}};
EPISODES.done=function(callback){EPISODES.bDone=true;
EPISODES.mark("done");
if(EPISODES.bPostMessage){window.postMessage("EPISODES:done",EPISODES.targetOrigin)
}if("function"===typeof(callback)){callback()
}};
EPISODES.getMarks=function(){return EPISODES.marks
};
EPISODES.getMeasures=function(){return EPISODES.measures
};
EPISODES.getStarts=function(){return EPISODES.starts
};
EPISODES.findStartTime=function(){var startTime=EPISODES.findStartWebTiming()||EPISODES.findStartGToolbar()||EPISODES.findStartCookie();
if(startTime){EPISODES.mark("starttime",startTime)
}};
EPISODES.findStartWebTiming=function(){var startTime=undefined;
var performance=window.performance||window.mozPerformance||window.msPerformance||window.webkitPerformance;
if("undefined"!=typeof(performance)&&"undefined"!=typeof(performance.timing)&&"undefined"!=typeof(performance.timing.navigationStart)){startTime=performance.timing.navigationStart;
EPISODES.dprint("EPISODES.findStartWebTiming: startTime = "+startTime)
}return startTime
};
EPISODES.findStartGToolbar=function(){var startTime=undefined;
if("object"===typeof(window.external)&&"number"===typeof(window.external.pageT)){startTime=(new Date().getTime())-window.external.pageT
}else{if("object"===typeof(window.gtbExternal)&&"function"===typeof(window.gtbExternal.pageT)){startTime=(new Date().getTime())-window.gtbExternal.pageT()
}else{if("object"===typeof(window.chrome)&&"function"===typeof(window.chrome.csi)){startTime=(new Date().getTime())-window.chrome.csi().pageT
}}}if(startTime){EPISODES.dprint("EPISODES.findStartGToolbar: startTime = "+startTime)
}return startTime
};
EPISODES.findStartCookie=function(){var aCookies=document.cookie.split(" ");
for(var i=0;
i<aCookies.length;
i++){if(0===aCookies[i].indexOf("EPISODES=")){var aSubCookies=aCookies[i].substring("EPISODES=".length).split("&");
var startTime,bReferrerMatch;
for(var j=0;
j<aSubCookies.length;
j++){if(0===aSubCookies[j].indexOf("s=")){startTime=aSubCookies[j].substring(2)
}else{if(0===aSubCookies[j].indexOf("r=")){var startPage=aSubCookies[j].substring(2);
bReferrerMatch=(encodeURIComponent(document.referrer)==startPage)
}}}if(bReferrerMatch&&startTime){EPISODES.dprint("EPISODES.findStartCookie: startTime = "+startTime);
return startTime
}}}return undefined
};
EPISODES.beforeUnload=function(e){document.cookie="EPISODES=s="+Number(new Date())+"&r="+encodeURIComponent(document.location)+"; path=/"
};
EPISODES.onload=function(e){EPISODES.mark("onload");
if(EPISODES.autorun){EPISODES.done()
}};
EPISODES.addEventListener=function(sType,callback,bCapture){if("undefined"!=typeof(window.attachEvent)){return window.attachEvent("on"+sType,callback)
}else{if(window.addEventListener){return window.addEventListener(sType,callback,bCapture)
}}};
EPISODES.dprint=function(msg){};
EPISODES.init();
module.exports=EPISODES
}(module)
});
require.register("tracking-js/lib/moonshine.js",function(exports,require,module){!function(){var VERSION="0.4.1";
function track(event,data,callback){var decorated=merge(data||{},registered());
decorated.client_timestamp=timestamp();
decorated.aleJsVersion=VERSION;
decorated.documentReferrer=decorated.documentReferrer||document.referrer;
pixel("/ale/"+event,decorated,callback||function(){})
}var registeredData={};
function register(data){registeredData=merge(registeredData,data)
}function registered(){return merge(registeredData)
}function pixel(url,data,callback){var image=new Image;
callback=callback||function(){};
image.onload=function(){callback()
};
image.onerror=function(){callback("Failed to load")
};
image.src=url+queryString(data)
}function queryString(data){var prop,pairs=[];
for(prop in data){if(data.hasOwnProperty(prop)){pairs.push(queryPair(prop,data[prop]))
}}return"?"+pairs.join("&")
}function queryPair(key,value){var encodedKey=encodeURIComponent(key),encodedValue=encodeURIComponent(""+value);
return encodedKey+"="+encodedValue
}function timestamp(){return(new Date).getTime()
}function merge(){var prop,curr,index,sources=Array.prototype.slice.call(arguments,0,arguments.length),data={};
for(index=0;
curr=sources[index];
index++){for(prop in curr){if(curr.hasOwnProperty(prop)){data[prop]=curr[prop]
}}}return data
}module.exports={track:track,register:register,registered:registered,VERSION:VERSION}
}()
});
require.register("tracking-js/lib/bottled-moonshine.js",function(exports,require,module){module.exports=function(Tracking){!function(Airbnb){var Moonshine=require("./moonshine");
Tracking.Moonshine={track:Moonshine.track,register:Moonshine.register};
Tracking.registerTracker(Moonshine.track);
Tracking.addInitHook(function(){var userAttributes=Airbnb.userAttributes;
Moonshine.register({logged_in:Airbnb.Utils.isUserLoggedIn,has_dates:!!userAttributes.has_dates,is_admin:Airbnb.Utils.isAdmin(),fb_connected:!!userAttributes.facebook_connected,canonical_host:Airbnb.options.canonical_host,is_fresh_session:Tracking.isFreshSession(),is_active_host:!!userAttributes.is_active_host,hosting_count:userAttributes.num_h||0,affiliate:Tracking.getAdvertisingId("affiliate"),campaign:Tracking.getAdvertisingId("campaign")})
})
}(Airbnb)
}
});
require.register("tracking-js/lib/mixpanel.js",function(exports,require,module){module.exports=function(Tracking){!function(global,Airbnb,JSCookie){var log=Airbnb.Utils.log,throwIfDev=(function(){var isDev=Airbnb.Utils.isDev();
return function(e){if(isDev){throw e
}}
}());
function identify(){try{mixpanel.identify.apply(mixpanel,arguments)
}catch(e){throwIfDev(e)
}finally{log("mixpanel.identify(",arguments,");")
}}function nameTag(){try{mixpanel.name_tag.apply(mixpanel,arguments)
}catch(e){throwIfDev(e)
}finally{log("mixpanel.name_tag(",arguments,");")
}}function defaultProperties(){var affiliate=Tracking.getAdvertisingId("affiliate"),campaign=Tracking.getAdvertisingId("campaign"),userAttributes=Airbnb.userAttributes,clientWidth=document.documentElement.clientWidth,clientHeight=document.documentElement.clientHeight,defaults={browser_version:$.browser&&$.browser.version,logged_in:Airbnb.Utils.isUserLoggedIn,has_dates:userAttributes.has_dates,is_admin:Airbnb.Utils.isAdmin(),fb_connected:userAttributes.facebook_connected,locale:Airbnb.options.locale,canonical_host:Airbnb.options.canonical_host,currency:userAttributes.curr,bev:JSCookie.cookie("bev"),is_fresh_session:Tracking.isFreshSession(),is_active_host:userAttributes.is_active_host,hosting_count:userAttributes.num_h,affiliate:affiliate,campaign:campaign,viewport_width:clientWidth,viewport_height:clientHeight,viewport:clientWidth+" x "+clientHeight,has_verified_phone:userAttributes.has_verified_phone,has_profile_pic:userAttributes.has_profile_pic};
return defaults
}function track(eventName,data,cbk){var data=data||{};
try{_.extend(data,defaultProperties());
mixpanel.track(eventName,data,cbk)
}catch(e){throwIfDev(e)
}}function getEvent(category){return category
}function register(){try{mixpanel.register.apply(mixpanel,arguments)
}catch(e){throwIfDev(e)
}finally{log("mixpanel.register(",arguments,");")
}}function unregister(){try{mixpanel.unregister.apply(mixpanel,arguments)
}catch(e){throwIfDev(e)
}finally{log("mixpanel.unregister(",arguments,");")
}}function init(){var mixpanel=global.mixpanel,bev,name,formerSuperProperties;
Tracking.Mixpanel={track:track,getEvent:getEvent,register:register,unregister:unregister};
try{mixpanel.set_config({debug:Airbnb.Utils.isDev(),track_pageview:false})
}catch(e){throwIfDev(e)
}formerSuperProperties=["logged_in","is_admin","fb_connected","locale","canonical_host","currency","bev","is_fresh_session","is_active_host","hosting_count","affiliate","campaign","viewport_width","viewport_height","viewport","your_listings_variation","p2_to_lys","lys_variation","new_host_variation","is_sandy"];
_.each(formerSuperProperties,function(prop){unregister(prop)
});
bev=JSCookie.cookie("bev");
if(bev){identify(bev)
}name=Airbnb.userAttributes.name;
if(name){nameTag(name)
}Tracking.registerTracker(track)
}Tracking.addInitHook(init)
}(window,Airbnb,JSCookie)
}
});
require.register("tracking-js/lib/logEvent.js",function(exports,require,module){module.exports=function(amplify){return function(Tracking){var VERSION="0.2";
var logContext={};
var amplifyQueueKey="tracking_event_queue";
function clearContext(context){logContext={}
}function addContext(context){copyObject(logContext,context)
}function addDefaultContext(){var cookies=getCookies();
addContext({page_uri:document.location.pathname,page_referrer:document.referrer,});
maybeAddCookie(cookies,"affiliate");
maybeAddCookie(cookies,"campaign");
maybeAddCookie(cookies,"bev")
}function logEvent(options){validateOptions(options);
var data=Tracking._formatEventData(options);
Tracking._sendTrackingRequest(data)
}function queueEvent(options){validateOptions(options);
var data=Tracking._formatEventData(options);
try{var queue=amplify.store(amplifyQueueKey)||[];
queue.push(data);
amplify.store(amplifyQueueKey,queue,{expires:60000})
}catch(e){warn("Could not add event to queue: "+e)
}}function flushEventQueue(){try{var queue=amplify.store(amplifyQueueKey)||[];
if(typeof queue==="string"){queue=JSON.parse(queue)
}queue.forEach(function(data){data.event_data=Tracking._addContextToQueuedEvent(data.event_data);
Tracking._sendTrackingRequest(data)
});
amplify.store(amplifyQueueKey,null)
}catch(e){warn("Could not flush event queue: "+e)
}}function validateOptions(options){if(!options.event_name){throw new Error("event_name is a required key for logEvent")
}}function formatEventData(options){return{event_name:options.event_name,mixpanel:options.mixpanel,event_data:merge(logContext,options.event_data),timestamp:(new Date).getTime(),trackingjs_logging_version:VERSION}
}function addContextToQueuedEvent(eventData){return merge(eventData,{trackingjs_queued:true,trackingjs_queued_context:logContext})
}function sendTrackingRequest(data){var req=new XMLHttpRequest();
req.open("POST","/tracking/events");
req.setRequestHeader("Content-type","application/json");
req.onload=function(){if(req.status<200||req.status>204){logEventFailed(data)
}};
req.onerror=function(){logEventFailed(data)
};
req.send(JSON.stringify(data))
}function logEventFailed(data){warn("Failed to log event (event="+data.event_name+")")
}function warn(str){if(typeof console!=="undefined"&&console.warn){console.warn("[tracking] "+str)
}}function merge(one,two){var data={};
copyObject(data,one);
copyObject(data,two);
return data
}function copyObject(dest,src){var prop;
for(prop in src){dest[prop]=src[prop]
}}function getCookies(){var cookies={},all=document.cookie;
if(all===""){return cookies
}var list=all.split("; ");
for(var i=0;
i<list.length;
i++){var cookie=list[i],p=cookie.indexOf("="),name=cookie.substring(0,p),value=cookie.substring(p+1);
try{value=decodeURIComponent(value)
}catch(ex){logEvent({event_name:"cookie_decode_failed",event_data:{cookie:cookie}});
value=""
}cookies[name]=value
}return cookies
}function maybeAddCookie(cookies,key){if(cookies[key]!=null){var ctx={};
ctx[key]=cookies[key];
addContext(ctx)
}}Tracking.clearContext=clearContext;
Tracking.addContext=addContext;
Tracking.addDefaultContext=addDefaultContext;
Tracking.logEvent=logEvent;
Tracking.queueEvent=queueEvent;
Tracking._formatEventData=formatEventData;
Tracking._sendTrackingRequest=sendTrackingRequest;
Tracking._flushEventQueue=flushEventQueue;
Tracking._addContextToQueuedEvent=addContextToQueuedEvent;
Tracking.addInitHook(flushEventQueue)
}
}
});
require.alias("component-querystring/index.js","tracking-js/deps/querystring/index.js");
require.alias("component-querystring/index.js","querystring/index.js");
require.alias("component-trim/index.js","component-querystring/deps/trim/index.js");
require.alias("tracking-js/index.js","tracking-js/index.js");
if(typeof exports=="object"){module.exports=require("tracking-js")
}else{if(typeof define=="function"&&define.amd){define([],function(){return require("tracking-js")
})
}else{this["Tracking"]=require("tracking-js")
}}})();
function ExceptionTrackerFactory(_,$){var EXCEPTION_INTERVAL=20,PAST_EXCEPTIONS_SIZE=30,PAST_EVENTS_SIZE=10;
var MiniLogger=(function(){function MiniLogger(n){this._buf=new Array(n);
this._idx=0
}MiniLogger.prototype.add=function(obj){this._idx%=this._buf.length;
this._buf[(this._idx)++]=obj
};
MiniLogger.prototype.lastN=function(){var initial=[];
if(this._buf[this._idx]){initial=this._buf.slice(this._idx)
}return initial.concat(this._buf.slice(0,this._idx))
};
return MiniLogger
})();
var chars="abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ";
var generateUID=function(){var length=7,arr=[];
for(var i=0;
i<length;
i++){arr.push(chars[Math.floor(Math.random()*chars.length)])
}return arr.join("")
};
var ExceptionTracker={init:function(TraceKit,Tracking,userID,roleType){if(this._initialized){return
}this._tracking=Tracking;
this._userID=userID;
this._roleType=roleType;
_.bindAll(this,"handleBodyClick","handleReport");
this._pastEvents=new MiniLogger(PAST_EVENTS_SIZE);
$("body").on("click",this.handleBodyClick);
this._pastExceptions={};
TraceKit.globalHandling=true;
TraceKit.report.subscribe(this.handleReport);
this._initialized=true
},handleBodyClick:function(e){var el=e.target;
var elemArr=[];
while(el){elemArr.push(el.nodeName);
if(el.className){elemArr.push(".",el.className)
}if(el.id){elemArr.push("#",el.id)
}elemArr.push("\n");
el=el.parentElement
}if(elemArr.length>0){this._pastEvents.add(elemArr.join(""))
}},handleReport:function(errorReport,options){if(!this._shouldReport(errorReport)){return
}options=options||{};
options=_.defaults(options,{projectKey:"MONORAIL_JAVASCRIPT",severity:"exception",userDataSmall:{},userDataLarge:{}});
options.userDataSmall.url=errorReport.url;
if(errorReport.stack&&errorReport.stack[0]&&errorReport.stack[0].context){options.userDataLarge.context=JSON.stringify(errorReport.stack[0].context)
}var pastEvents=this._pastEvents.lastN();
if(pastEvents){options.userDataLarge.pastEvents=pastEvents.join("\n\n")
}var backtrace=_.map(errorReport.stack,function(line){return[line.url,line.func,line.line].join(";")
});
var bev=(window.JSCookie)?window.JSCookie.cookie("bev"):null;
this._logEvent(errorReport,options,bev,backtrace)
},_shouldReport:function(errorReport){var stackTop=(errorReport.stack&&errorReport.stack[0])?[errorReport.stack[0].url,errorReport.stack[0].line].join(":"):null;
var exceptionKey=[errorReport.name,errorReport.message,stackTop].join(":");
var timeNow=parseInt(Date.now()/1000);
if(exceptionKey in this._pastExceptions){if(timeNow-this._pastExceptions[exceptionKey]<EXCEPTION_INTERVAL){return false
}}else{var keys=_.keys(this._pastExceptions);
if(keys.length>=PAST_EXCEPTIONS_SIZE){var randomKey=keys[Math.floor((Math.random()*keys.length))];
delete this._pastExceptions[randomKey]
}}this._pastExceptions[exceptionKey]=timeNow;
return true
},_logEvent:function(errorReport,options,bev,backtrace){this._tracking.logEvent({event_name:"exception",event_data:{occurred_at:Date.now()/1000,backtrace:backtrace,user_id:this._userID,visitor_id:bev,error_name:errorReport.name+": "+errorReport.message,cluster:"current-deploy-"+this._roleType,minotaur_project_key:options.projectKey,severity:options.severity,err_id:generateUID(),user_data_large:options.userDataLarge,user_data_small:options.userDataSmall}})
},};
ExceptionTracker.MiniLogger=MiniLogger;
return ExceptionTracker
}if(this.Airbnb){this.Airbnb.ExceptionTracker=ExceptionTrackerFactory(_,$)
}else{if(typeof module!=="undefined"&&module.exports){module.exports=ExceptionTrackerFactory
}}(function(exports,$){var PhoneNumberInputWidget=exports.PhoneNumberInputWidget=function(options){this.init(options)
};
PhoneNumberInputWidget.prototype={prefix:null,init:function(options){var ref=this;
this.element=$(options.element);
this.elements=$.extend({},{});
this.options=$.extend({},options||{});
this.$("select").change(this.proxy(this.countryChangeHandler));
this.$("input.pniw-number").keypress(this.proxy(this.numberKeypressHandler)).change(this.proxy(this.numberChangeHandler));
this.countryChangeHandler();
if(this.options.country){this.setCountry(this.options.country)
}if(this.options.number){this.setNumber(this.options.number)
}},setCountry:function(country){this.$("select").find('option[value="'+country+'"]').attr("selected","selected").change()
},setNumber:function(number){var prefix=this.getPrefix(),justNumber=(number+"").replace(new RegExp("^"+prefix),"");
this.$("input.pniw-number").val(justNumber);
this.updateHiddenField()
},getNumber:function(){var prefix=this.getPrefix(),number=this.$("input.pniw-number").val();
return $.trim(prefix+number)
},getCountry:function(){return this.$("select").val()
},countryChangeHandler:function(el,ev){var country=this.getCountry();
this.prefix=this.$('option[value="'+country+'"]').data("prefix");
this.$(".pniw-number-prefix").text("+"+this.getPrefix());
this.updateHiddenField()
},getPrefix:function(){return this.prefix
},setError:function(hasError){this.$("input.pniw-number").toggleClass("error",hasError)
},numberKeypressHandler:function(el,ev){var $el=$(el);
if($.trim($el.val().length)){this.setError(false)
}if(ev.which===13){return false
}},numberChangeHandler:function(el,ev){this.updateHiddenField()
},updateHiddenField:function(){this.$('input[data-role="phone_number"]').val(this.getNumber())
},$:function(selector,fresh){if(fresh||typeof this.elements[selector]==="undefined"){this.elements[selector]=this.element.find(selector)
}return this.elements[selector]
},proxy:function(callback){var self=this;
return function(ev){return callback.call(self,this,ev)
}
}};
$.fn.phoneNumberInputWidget=function(options){return this.each(function(i,e){options=$.extend({element:e},options);
var widget=new PhoneNumberInputWidget(options);
$(this).data("phoneNumberInputWidget",widget)
})
};
$.phoneNumberInputWidget=function(){$("div.phone-number-input-widget").phoneNumberInputWidget()
}
})(Airbnb,jQuery);
(function(exports,$){var PhoneNumberVerifyWidget=exports.PhoneNumberVerifyWidget=function(options){this.init(options)
};
PhoneNumberVerifyWidget.prototype={ajaxUrl:"/phone_numbers/phone_number_verify_widget",isColorbox:false,canCancelStepOne:true,finished:false,init:function(options){var ref=this;
this.elements=$.extend({},{});
this.options=$.extend({},options||{});
if(options.ajax){if(!options.element){throw"Need to set options.element"
}var $el=$(options.element).load(this.ajaxUrl,function(){ref.element=$el.find(".phone-number-verify-widget");
ref.initCallback()
})
}else{if(options.element){this.element=$(options.element);
this.initCallback()
}else{this.isColorbox=true;
$.colorbox.loading();
$.get(this.ajaxUrl,function(response){$.colorbox({html:response});
ref.element=$("#colorbox .phone-number-verify-widget");
ref.initCallback()
})
}}},initCallback:function(){var phoneNumberInputWidget=this.$(".phone-number-input-widget");
this.$('.pnaw-verify-container a[rel="sms"], .pnaw-verify-container a[rel="call"]').click(this.proxy(this.stepOneHandler));
this.$('.pnaw-verify-container a[rel="verify"]').click(this.proxy(this.stepTwoHandler));
this.$('.pnaw-verify-container a[rel="cancel"]').click(this.proxy(this.cancelHandler));
this.$("#phone_number_verification").keypress(this.proxy(this.codeKeypressHandler));
this.phoneNumberInputWidget=phoneNumberInputWidget.data("phoneNumberInputWidget")||phoneNumberInputWidget.phoneNumberInputWidget().data("phoneNumberInputWidget");
if(this.options.country){this.setCountry(this.options.country)
}if(this.options.number){this.setNumber(this.options.number)
}if(!this.options.canCancelStepOne){this.$(".pnaw-step1 a.cancel").hide()
}if(this.options.phone_number_id){this.element.data("phone_number_id",this.options.phone_number_id)
}},setCountry:function(country){this.phoneNumberInputWidget.setCountry(country)
},setNumber:function(number){this.phoneNumberInputWidget.setNumber(number)
},getPrefix:function(){return this.phoneNumberInputWidget.getPrefix()
},getNumber:function(){return this.phoneNumberInputWidget.getNumber()
},getCountry:function(){return this.phoneNumberInputWidget.getCountry()
},codeKeypressHandler:function(el,ev){var maxCodeLength=4;
if(ev.which===13){this.$('.pnaw-verify-container a[rel="verify"]').click();
return false
}else{if(el.value.length>=maxCodeLength){el.value=el.value.substring(0,maxCodeLength);
return false
}}},cancelHandler:function(el,ev){this.finish(false);
this.element.trigger("cancel")
},verifyNumber:function(number,country,type){var ref=this,url="/phone_numbers/create",number=$.trim(number),params={phone_number:number,phone_type:type,phone_number_country:country,reservation:this.options.resoCode},$body=$("body");
this.$(".message").html("");
this.setLoading(true);
$body.trigger("phone_modal_event","phone_numbers#create_attempt");
this.stepOneXhr=$.post(url,params,function(response){ref.setLoading(false);
if(response.result==="failure"){$body.trigger("phone_modal_event","phone_numbers#create_legitimate_failure");
ref.phoneNumberInputWidget.setError(true);
ref.setMessage(response.message)
}else{$body.trigger("phone_modal_event","phone_numbers#create_success");
ref.stepTwo(type);
ref.startPolling();
ref.element.data("phone_number_id",response.phone_number_id);
ref.setMessage(response.message)
}}).error(function(){$body.trigger("phone_modal_event","phone_numbers#create_server_error");
ref.setLoading(false);
ref.phoneNumberInputWidget.setError(true)
})
},startPolling:function(){var ref=this;
if(this.pollingTimer){clearInterval(this.pollingTimer)
}this.pollingTimer=setInterval(function(){$.get("/phone_numbers/verification_status",{id:ref.element.data("phone_number_id")},function(response){if(response.status==="verified"){ref.finish()
}})
},10000)
},stepOneHandler:function(el,ev){var prefix=this.getPrefix()+"",number=this.getNumber()+"",type=$(el).attr("rel"),country=this.getCountry();
number=number.replace(/\D/g,"");
if(number.length<6){this.phoneNumberInputWidget.setError(true);
if(number.length>prefix.length){this.showError(I18n.t("phone_number_widget.number_too_short"))
}else{this.showError(I18n.t("phone_number_widget.please_enter_a_number"))
}}else{this.hideError();
this.verifyNumber(number,country,type)
}},stepTwoHandler:function(){var url="/phone_numbers/verify",code=this.$("#phone_number_verification").val().trim(),params={id:this.element.data("phone_number_id")||this.options.id,verification_code:code,reservation:this.options.resoCode},ref=this;
code=code.replace(/\D/g,"");
if(!code){this.showError(I18n.t("phone_number_widget.verify_validation_error"))
}else{if(code.length!=4){this.showError(I18n.t("phone_number_widget.verification_code_four_digits"))
}else{this.hideError();
ref.setLoading(true);
$.post(url,params,function(response){ref.setLoading(false);
if(response.result==="success"){$("body").trigger("phone_modal_event","phone_numbers#verify success");
ref.finish()
}else{ref.$("#phone_number_verification").val("").animate({left:"-5px"},100,function(){$(this).animate({left:"5px"},100,function(){$(this).animate({left:0},100)
})
});
$("body").trigger("phone_modal_event","phone_numbers#verify error");
ref.showError(response.error);
$("#phone-verification-modal").trigger("failure")
}})
}}},stepOne:function(){this.phoneNumberInputWidget.setNumber("");
this.$(".pnaw-step1").show();
this.$(".pnaw-step2").hide();
this.hideError()
},stepTwo:function(type){this.$("#phone_number_verification").val("");
this.$(".pnaw-step1").hide();
this.$(".pnaw-step2").fadeIn(200);
this.hideError();
this.$(".cancel-message").toggle(type==="sms")
},finish:function(completed){this.hideError();
if(this.pollingTimer){clearInterval(this.pollingTimer)
}this.stepOne();
if(completed!==false&&this.finished===false){if(this.options.onComplete){this.options.onComplete.call(this)
}this.element.trigger("complete");
$(document).trigger("phone_number_verify_widget.complete");
if(this.isColorbox){$.colorbox.close()
}this.finished=true
}},setLoading:function(loading){if(loading){this.element.addClass("loading")
}else{this.element.removeClass("loading")
}},showError:function(errorStr){this.$(".pnaw-verification-error").text(errorStr).fadeIn(200)
},hideError:function(){this.$(".pnaw-verification-error").hide()
},setMessage:function(message){this.element.find(".message").html(message)
},$:function(selector,fresh){if(fresh||typeof this.elements[selector]==="undefined"){this.elements[selector]=this.element.find(selector)
}return this.elements[selector]
},proxy:function(callback){var self=this;
return function(ev){return callback.call(self,this,ev)
}
}};
$.fn.phoneNumberVerifyWidget=function(options){return this.each(function(i,e){var widget=new PhoneNumberVerifyWidget($.extend({element:e},options));
return $(this).data("phoneNumberVerifyWidget",widget)
})
};
$.phoneNumberVerifyWidget=function(options){return $("div.phone-number-verify-widget").phoneNumberVerifyWidget(options)
}
})(Airbnb,jQuery);
(function(exports,$){var PhoneNumberWidget=exports.PhoneNumberWidget=function(el,options){this.init(el,options)
};
PhoneNumberWidget.prototype={ajaxUrl:"/phone_numbers/phone_number_widget",init:function(el,options){var ref=this;
this.options=options||{};
this.element=$(el);
this.$add=this.element.find("a.add");
this.$addWidget=this.element.find(".phone-number-verify-widget:first");
this.$verifyWidget=this.element.find(".phone-number-verify-widget:last");
this.$table=this.element.find(".phone-numbers-table");
this.$noPhoneNumbers=this.element.find(".no-phone-numbers");
this.$hideDuringVerify=this.element.find(".phone-numbers-hide-during-verify");
this.element.delegate("a.remove","click",this.proxy(this.removeHandler));
this.element.delegate("a.verify","click",this.proxy(this.verifyHandler));
this.$add.click(this.proxy(this.addHandler));
this.$addWidget.bind("complete",this.proxy(this.completeAddHandler));
this.addWidget=new Airbnb.PhoneNumberVerifyWidget({element:this.$addWidget,resoCode:this.options.resoCode,onComplete:function(){ref.onVerifyComplete()
}});
this.verifyWidget=new Airbnb.PhoneNumberVerifyWidget({element:this.$verifyWidget,resoCode:this.options.resoCode,onComplete:function(){ref.onVerifyComplete()
}});
this.$verifyWidget.bind("cancel",this.proxy(this.verifyCancelHandler));
if(this.options.showAddNumberInitially&&this.$table.children().length===0){this.$addWidget.show();
this.$add.hide();
this.$noPhoneNumbers.hide()
}if(this.options.noCancel){this.element.addClass("noCancel")
}},verifyHandler:function(el,ev){var $a=$(el),$tr=$a.parents("tr"),number=$tr.data("number"),country=$tr.data("country"),type=$a.attr("rel"),id=$tr.data("id"),ref=this;
this.$add.show();
this.$addWidget.hide();
this.$verifyWidget.data("phone_number_id",id);
this.verifyWidget.verifyNumber(number,country,type);
this.verifyWidget.stepTwo();
this.verifyWidget.setLoading(false);
this.$verifyWidget.show();
this.$hideDuringVerify.hide()
},verifyCancelHandler:function(el,ev){this.$hideDuringVerify.show();
this.$verifyWidget.hide();
if(this.verifyWidget.stepOneXhr){this.verifyWidget.stepOneXhr.abort()
}},onVerifyComplete:function(){var ref=this,refreshMe;
if(this.options.onVerifyComplete){refreshMe=this.options.onVerifyComplete.call(this)
}if(refreshMe!==false){ref.element.addClass("loading");
$.get(ref.ajaxUrl,function(response){ref.element.replaceWith(response);
$.phoneNumberWidget(ref.options)
})
}this.$hideDuringVerify.show();
this.$hideDuringVerify.unbind("cancel")
},completeAddHandler:function(el,ev){this.$add.show();
this.$addWidget.slideUp(200)
},removeHandler:function(el,ev){var $el=$(el),href=$el.attr("href"),authenticityToken=$el.data("authenticity-token"),ref=this;
$.ajax({type:"post",data:{authenticity_token:authenticityToken},success:function(request){$el.parents("tr").fadeOut(200,function(){$(this).remove();
if(ref.element.find("table.phone-numbers-table tr").length){ref.element.addClass("has-phone-numbers")
}else{ref.element.removeClass("has-phone-numbers")
}})
},error:function(xhr){Airbnb.Utils.followRedirectIfPresent(xhr)
},url:href});
return false
},addHandler:function(el,ev){this.$add.hide();
this.$addWidget.slideDown(200)
},proxy:function(callback){var self=this;
return function(ev){return callback.call(self,this,ev)
}
}};
$.fn.phoneNumberWidget=function(options){return this.each(function(i,e){new PhoneNumberWidget(e,options)
})
};
$.phoneNumberWidget=function(options){$("div.phone-numbers-container").phoneNumberWidget(options)
};
exports.PhoneNumberWidget=PhoneNumberWidget
})(Airbnb,jQuery);
(function(global,$,Airbnb){var _=global._,VerificationFlow;
VerificationFlow=Airbnb.VerificationFlow=function(options){this.options=$.extend({element:null,showIntro:false,onComplete:function(){},metaData:{}},options);
this.init()
};
VerificationFlow.prototype={states:{basic_profile:1,profile_photo:2,phone_verification:3,real_name:4,full_profile:5,confirmed_email:6},eventPrefix:"verification_flow.",statesFlipped:{},numStates:0,currentState:0,init:function(){var self=this,i,$buttonBar,$intro,$panels;
this.element=$(this.options.element);
this.$continue=$(".button-bar a.continue");
this.steps=[];
this.$(".verification-flow-panel").each(function(){self.steps.push($(this).data("step"))
});
if(this.element.length===0||this.steps.length===0){return
}$.each(this.states,function(key,i){self.statesFlipped[i]=key;
self.numStates++
});
this.sm=new global.SimpleStateMachine(this.states,{context:this});
$.each(this.transitionHandlers,function(key,handler){var state=self.states[key];
self.sm.addTransitionHandler(state,handler)
});
for(i=this.currentState;
i<=this.numStates;
i++){if(this.$panel(this.statesFlipped[this.currentState]).length){break
}this.currentState++
}if(this.currentState===this.numStates+1){this.finish();
return
}this.sm.transitionTo(this.currentState);
this.$continue.click(function(){self.nextState()
});
this.initRealName();
if(this.options.showIntro){$buttonBar=this.element.next(".content-row");
$intro=this.$(".verification-flow-intro").show();
$panels=this.$(".verification-flow-panels").hide();
this.$("a.start").click(function(){$intro.hide();
$panels.show();
self.start();
$buttonBar.show()
});
self.trackEvent("show_intro",{numSteps:self.steps.length,steps:self.steps});
$buttonBar.hide()
}else{self.start()
}if(this.steps.length>1){this.$(".verification-flow-step span:eq(1)").text(this.steps.length)
}else{this.$(".verification-flow-step").hide()
}},start:function(){var self=this;
this.trackEvent("start",{numSteps:self.steps.length,steps:self.steps});
this.updateStep()
},transitionHandlers:{basic_profile:function(){this.$(".verification-flow-panel").hide();
this.$panel("basic_profile").show();
this.$continue.show()
},phone_verification:function(){var self=this;
this.$(".verification-flow-panel").hide();
this.$panel("phone_verification").show();
this.$continue.hide();
$.phoneNumberWidget({showAddNumberInitially:true,onVerifyComplete:function(){self.hasVerifiedPhoneNumber=true;
self.nextState();
return false
},resoCode:this.options.resoCode})
},profile_photo:function(){this.$(".verification-flow-panel").hide();
this.$panel("profile_photo").show();
if(this.options.profilePhotoOptions){ProfilePicWidget.init(this.options.profilePhotoOptions)
}this.$continue.show()
},real_name:function(){this.$(".verification-flow-panel").hide();
this.$panel("real_name").show();
this.$(".button-bar").hide();
this.$continue.show()
},full_profile:function(){this.$(".verification-flow-panel").hide();
this.$panel("full_profile").show();
this.$continue.show()
},confirmed_email:function(){var self=this;
Airbnb.Tracking.Mixpanel.track("verification_flow.confirm_email.start");
this.$(".verification-flow-panel").hide();
var $panel=this.$panel("confirmed_email");
$panel.show();
function sendNewEmail(){$.getJSON("/users/request_new_confirm_email?dead_end=true");
Airbnb.Tracking.Mixpanel.track("verification_flow.confirm_email.request_new_email")
}sendNewEmail();
var pollingTimer=setInterval(function(){$.getJSON("/verification/has_confirmed_email",function(data){if(data.has_confirmed_email){emailConfirmed()
}})
},5000);
function emailConfirmed(){Airbnb.Tracking.Mixpanel.track("verification_flow.confirm_email.email_confirmed");
clearInterval(pollingTimer);
$panel.off(".confirmed_email");
self.nextState()
}this.$continue.hide();
var $notThere=$panel.find(".not-there");
$panel.on("click.confirmed_email",".resend-link",function(e){e.preventDefault();
$(this).hide();
$notThere.show()
});
$panel.on("click.confirmed_email",".sendEmail",function(e){e.preventDefault();
sendNewEmail();
$notThere.hide();
$panel.find(".did-resend").show()
})
}},submitHandlers:{basic_profile:function(callback){if($.trim($("#user_profile_info_about").val())===""){this.showError("You need to enter a profile description!");
Airbnb.mediator.emit("track:additional_desc_continue_click_error",{});
Airbnb.mediator.emit("track:additional_desc_continue_click_error_type",{label:"You need to enter a profile description!"})
}else{var $textarea=this.$panel("basic_profile").find("textarea"),params={};
params[$textarea.attr("name")]=$textarea.val();
params.authenticity_token=$("#authenticity-token").data("authenticity-token");
$.ajax({type:"POST",url:$textarea.attr("data-url"),data:params,error:function(xhr){Airbnb.mediator.emit("track:additional_desc_continue_click_error",{});
Airbnb.Utils.followRedirectIfPresent(xhr);
window.location=""
},dataType:"JSON"});
Airbnb.mediator.emit("track:additional_desc_continue_click_success",{});
callback.call(this)
}},phone_verification:function(callback){if(!this.hasVerifiedPhoneNumber){this.showError("You need to verify your phone number before continuing.")
}else{callback.call(this)
}},profile_photo:function(callback){var self=this;
self.setLoading(true);
$.getJSON("/users/has_profile_pic",function(response){self.setLoading(false);
if(response.has_profile_pic){Airbnb.mediator.emit("track:additional_photo_continue_click_success",{});
callback.call(self)
}else{Airbnb.mediator.emit("track:additional_photo_continue_click_error",{});
Airbnb.mediator.emit("track:additional_photo_continue_click_error_type",{label:"You need to add a profile photo before continuing."});
self.showError("You need to add a profile photo before continuing.")
}})
},real_name:function(callback){if(!this.hasCompletedRealName){this.showError("You need to confirm your real name before continuing.")
}else{callback.call(this)
}},full_profile:function(callback){var $gender=$('select[name="user[sex]"]');
var gender=$gender.val();
var location=$.trim($("#user_profile_info_current_city").val());
if(gender===""){this.showError("You need to tell us your gender before continuing.")
}else{if(location===""){this.showError("You need to tell us your location before continuing.")
}else{var params={"user[sex]":gender,"user_profile_info[current_city]":location};
$("#user-birthdate-container select").each(function(i,el){var $el=$(el);
params[$el.attr("name")]=$el.val()
});
var url=$(".verification-flow-panel.full_profile").data("url");
$.post(url,params);
callback.call(this)
}}},confirmed_email:function(callback){callback.call(this)
}},showError:function(error){alert(error)
},setLoading:function(loading){if(loading){this.element.addClass("loading");
this.$continue.attr("disabled","disabled")
}else{this.element.removeClass("loading");
this.$continue.removeAttr("disabled")
}},nextState:function(){var self=this,key=this.statesFlipped[this.currentState],submitHandler=this.submitHandlers[key],nextState;
for(var i=this.currentState;
i<=this.numStates;
i++){nextState=i+1;
if(this.$panel(this.statesFlipped[nextState]).length){break
}}if(this.$panel(key).length){submitHandler.call(this,nextStateCallback)
}else{nextStateCallback()
}function nextStateCallback(){self.trackEvent("step_completed."+key);
if(nextState===self.numStates+1){self.finish()
}else{self.currentState=nextState;
self.sm.transitionTo(self.currentState);
self.updateStep()
}}},updateStep:function(){var $visiblePanel=this.$(".verification-flow-panel:visible"),step=$visiblePanel.index()===-1?1:$visiblePanel.index()+1,key=this.statesFlipped[this.currentState];
this.$(".verification-flow-step span:first").text(step);
if(step===this.$(".verification-flow-panel").length){this.$continue.text(VerificationFlow.translations.finish)
}this.trackEvent("step_start."+key)
},$:function(selector){return this.element.find(selector)
},$panel:function(name){return this.$(".verification-flow-panel."+name)
},finish:function(){this.element.addClass("complete");
if(this.options.showIntro){this.$(".verification-flow-panels").hide();
this.$(".verification-flow-complete").show()
}this.options.onComplete.call(this);
this.trackEvent("completed")
},initRealName:function(){var self=this,$panel=this.$panel("real_name"),$submit;
if(!$panel.length){return
}$panel.addClass("loading");
this.realNameFlow=new Airbnb.RealNameFlow({form:false,container:$panel,onLoad:function(){$panel.removeClass("loading");
$submit=$("#real_name_flow .form_submit .submit").removeClass("green").addClass("blue");
if(self.steps.length>1){$submit.text(VerificationFlow.translations.finish)
}if(self.statesFlipped[self.currentState]==="real_name"){self.$continue.hide()
}},onSuccess:function(){self.hasCompletedRealName=true;
self.nextState()
}})
},trackEvent:function(ev,properties){var eventName=this.eventPrefix+ev,metaData=$.extend({},this.options.metaData,properties);
Airbnb.Tracking.Mixpanel.track(eventName,metaData);
this.element.trigger(eventName)
},bind:function(ev,callback){var eventName=this.eventPrefix+ev;
this.element.bind(eventName,callback)
}};
VerificationFlow.translations={finish:"Finish"};
VerificationFlow.addTranslations=function(translations){$.extend(VerificationFlow.translations,translations)
};
$.fn.verificationFlow=function(options){options=$.extend({},options||{},{element:this});
var flow=new Airbnb.VerificationFlow(options);
$(this).data("verificationFlow",flow);
return this
}
})(this,jQuery,Airbnb);
(function($){function beforeShowGenerator(options){options=options||{};
options.dateOffset=options.dateOffset||"+0";
return function(input,inst){var $input=$(input);
var val=$input.val();
$input.trigger("beforeShow.datepicker",{el:input});
if(!val){if(typeof inst!=="undefined"){$input.datepicker("option","minDate",options.dateOffset)
}}}
}function checkBeyondRange(el,offsetMsec){var $el=$(el);
try{var enteredDate=$.datepicker.parseDate($el.val());
var maxDate=new Date();
maxDate.setFullYear(maxDate.getFullYear()+3);
if(offsetMsec){maxDate+=offsetMsec
}if(enteredDate>maxDate){$el.val($.datepicker.formatDate(maxDate))
}}catch(e){}return $el.val()
}function attachDatepicker(element,options){var defOpts;
var defaultCalendarOptions={minDate:0,maxDate:"+3Y",nextText:"",prevText:"",numberOfMonths:1,showButtonPanel:true,closeText:I18n.t("clear_dates","Clear Dates")};
var _ref=$(element);
options=options||{};
defOpts={checkinDatePicker:$(options.checkin),checkoutDatePicker:$(options.checkout),onSuccessCallback:options.onSuccess,onReset:options.onReset,onCheckinClose:options.onCheckinClose,onCheckoutClose:options.onCheckoutClose};
if(!options.defaultsCheckin){options.defaultsCheckin=defaultCalendarOptions
}if(!options.defaultsCheckout){options.defaultsCheckout=defaultCalendarOptions
}if(!options.checkin){defOpts.checkinDatePicker=_ref.find("input.checkin")
}if(!options.checkout){defOpts.checkoutDatePicker=_ref.find("input.checkout")
}$.each(["onSuccessCallback","onReset","onCheckinClose","onCheckoutClose"],function(i,val){if(!defOpts[val]){defOpts[val]=function(){}
}});
_ref.data("airbnb-datepickeroptions",defOpts);
var checkinCalendarOptions=$.extend($.extend(true,{},options.defaultsCheckin),{beforeShow:beforeShowGenerator(),onClose:function(dateText,inst){var opts=_ref.data("airbnb-datepickeroptions");
if(dateText){dateText=checkBeyondRange(this);
var nextDate=$.datepicker.parseDate(dateText);
nextDate=new Date(nextDate.setDate(nextDate.getDate()+1));
var checkoutEl=opts.checkoutDatePicker;
try{var checkoutDate=$.datepicker.parseDate(checkoutEl.val());
checkoutEl.datepicker("option","minDate",nextDate);
if(nextDate>checkoutDate){checkoutEl.val($.datepicker.formatDate(nextDate));
checkoutEl.change();
checkoutEl.focus()
}else{opts.onSuccessCallback(nextDate,checkoutEl.val())
}}catch(e){checkoutEl.datepicker("option","minDate",nextDate);
checkoutEl.val($.datepicker.formatDate(nextDate));
checkoutEl.focus()
}}opts.onCheckinClose()
},onReset:function(){var opts=_ref.data("airbnb-datepickeroptions");
opts.checkoutDatePicker.datepicker("reset",true);
opts.onReset()
}});
var checkoutCalendarOptions=$.extend($.extend(true,{},options.defaultsCheckout),{beforeShow:beforeShowGenerator({dateOffset:"+1"}),onClose:function(dateText,inst){var opts=_ref.data("airbnb-datepickeroptions");
if(dateText){dateText=checkBeyondRange(this,1000*60*60*24);
var prevDate=$.datepicker.parseDate(dateText);
prevDate=new Date(prevDate.setDate(prevDate.getDate()-1));
var checkinEl=opts.checkinDatePicker;
try{var checkinDate=$.datepicker.parseDate(checkinEl.val());
if(prevDate<checkinDate){checkinEl.val($.datepicker.formatDate(prevDate));
checkinEl.focus()
}else{opts.onSuccessCallback(checkinEl.val(),dateText)
}}catch(e){checkinEl.val($.datepicker.formatDate(prevDate));
checkinEl.focus()
}}opts.onCheckoutClose()
},onReset:function(){var opts=_ref.data("airbnb-datepickeroptions");
opts.checkinDatePicker.datepicker("reset",true)
}});
defOpts.checkinDatePicker.datepicker(checkinCalendarOptions);
defOpts.checkoutDatePicker.datepicker(checkoutCalendarOptions);
checkinCalendarOptions.beforeShow(defOpts.checkinDatePicker);
checkoutCalendarOptions.beforeShow(defOpts.checkoutDatePicker)
}$.fn.airbnbInputDateSpan=function(options){return this.each(function(){if(typeof options==="string"){}else{attachDatepicker(this,options)
}})
}
})(jQuery);
(function(){jQuery(document).ready(function(){if(typeof Backbone!=="undefined"&&Backbone!==null){return Airbnb.Mediator=_.extend({},Backbone.Events)
}})
}).call(this);
var modal=require("o2-modal");
var Facebook={mixpanelModalTracking:function(action,label){Airbnb.Tracking.Mixpanel.track("FB_sharing_modal",{action:action,label:label,fbLoggedIn:JSCookie.cookie("fbs"),fbPublishPermission:Airbnb.userAttributes.og_publish,forceTrack:true})
},setupFacebookModal:(function(){var helper=function(actionType,extraParams){if(Airbnb.userAttributes.og_publish){jQuery(document).bind("fbLoginStatus",Airbnb.Utils.fbInitHasPublishAction)
}Airbnb.OpenGraph.init(function(stuff){params={access_token:FB.getAccessToken(),action_type:actionType};
jQuery.extend(params,extraParams);
jQuery.post("/open_graph_actions",params,function(response){if(response&&response.error_type){if(response.error_type==="needs publish permission"){$(document).trigger("needFBPermissions")
}}else{Facebook.mixpanelModalTracking("publish",actionType)
}})
},"yo")
};
return function(actionType,extraParams){jQuery(document).on("fbInit",function(){helper(actionType,extraParams)
});
if(typeof FB!=="undefined"){helper(actionType,extraParams)
}}
})(),showFacebookModal:(function(){var helper=function(){modal("#open-graph-publish");
modal.open(function(){var $container=jQuery("#open-graph-publish-image-container");
$container.find("img").remove();
$container.append('<img src="'+$container.attr("data-url")+'" width="'+$container.attr("data-width")+'" height="'+$container.attr("data-height")+'" />')
});
Facebook.mixpanelModalTracking("impression",jQuery("#open-graph-publish").attr("data-action-type"))
};
return function(){jQuery(document).on("fbInit",function(){helper()
});
if(typeof FB!=="undefined"){helper()
}}
})()};
(function($,Airbnb){Airbnb.OpenGraph=(function(){var my={};
my.init=function(callback,callback_params){$("#open-graph-button-yes, .open-graph-wishlist").live("click",function(){modal.close();
if(Airbnb.userAttributes.og_publish!==true){Airbnb.userAttributes.og_publish=true;
$.post("/open_graph_actions/open_graph_setting",{allow:"true"})
}Airbnb.OpenGraph.doWithPublishPermission(function(){callback(callback_params)
})
});
$("#open-graph-button-no, .open-graph-wishlist-no").click(function(){modal.close();
Airbnb.userAttributes.og_publish=false;
$.post("/open_graph_actions/open_graph_setting",{allow:"false"});
return false
})
};
my.sendActionToFacebook=function(data,action,callback){$.post("/open_graph_actions",$.merge({},{access_token:FB.getAccessToken(),action_type:action},data),callback||function(){})
};
my.deleteActionFromFacebook=function(data,action,callback){$.ajax({type:"POST",data:$.merge({},{access_token:FB.getAccessToken(),action_type:action},data),url:"/open_graph_actions/"+data.hosting_id,dataType:"json",success:callback||function(){}})
};
my.mixPanelTrack=function(eventName){var userAttributes=Airbnb.userAttributes;
Airbnb.Tracking.Mixpanel.track(eventName,{fbLoggedIn:JSCookie.cookie("fbs"),fbPublishPermission:userAttributes.og_publish,wishlistedBeforeBool:userAttributes.has_wishlisted,forceTrack:true,lightweightWishlist:userAttributes.lightweight_wishlist})
};
my.sendFavoriteToFacebook=function(hosting_id){my.sendActionToFacebook({hosting_id:hosting_id},"favorite",function(data){$('<span id="" style="font-size: 10px; color: gray; position: absolute;margin: -17px 0 0 27px; width:200px">Added to your Facebook Timeline!</span>').hide().appendTo("#star_"+hosting_id).fadeIn(100).delay(3000).fadeOut(1000)
})
};
my.sendWishlistToFacebook=function(hostingId){var wishlistParams={access_token:FB.getAccessToken(),fb_uid:FB.getUserID(),action_type:"wishlist",note:window.wishlistNote,hosting_id:hostingId||window.hostingId,wishlist_id:window.wishlistId};
Airbnb.OpenGraph.mixPanelTrack("wishlist.openGraph.shareWLOnFB");
$.post("/open_graph_actions",wishlistParams,function(response){if(response&&response.error_type){if(response.error_type=="needs publish permission"){$(document).trigger("needFBPermissions")
}}else{Airbnb.OpenGraph.mixPanelTrack("wishlist.openGraph.shareWLOnFBSuccess")
}},"json")
};
my.deleteFavoriteFromFacebook=function(hosting_id){$('<span id="" style="font-size: 10px; color: gray; position: absolute;margin: -17px 0 0 27px; width:200px">Deleted from your Facebook Timeline.</span>').hide().appendTo("#star_"+hosting_id).fadeIn(100).delay(3000).fadeOut(1000);
$.ajax({type:"POST",data:{access_token:FB.getAccessToken(),action_type:"favorite",_method:"delete"},url:"/open_graph_actions/"+hosting_id,dataType:"json",success:function(data){}})
};
my.doWithPublishPermission=function(callback,callbackParams,hasOfflinePublishPermission){var getPublishPermissionAndCallCallback=function(){var options={};
options.scope="publish_actions";
if(JSCookie.cookie("fbs")){Airbnb.OpenGraph.mixPanelTrack("og.fbLoggedIn.startingPermFlow")
}FB.login(function(){FB.api({method:"fql.query",query:"SELECT publish_actions FROM permissions WHERE uid = me()"},function(response){Airbnb.Utils.fbHasPublishAction=(response!==undefined&&response[0]&&response[0].publish_actions==="1");
if(Airbnb.Utils.fbHasPublishAction){callback(callbackParams);
Airbnb.userAttributes.og_publish=true;
Airbnb.OpenGraph.mixPanelTrack("og.finishedPermFlow");
$.post("/open_graph_actions/open_graph_setting",{allow:"true"})
}else{Airbnb.userAttributes.og_publish=false;
$.post("/open_graph_actions/open_graph_setting",{allow:"false"})
}})
},options)
};
if(hasOfflinePublishPermission&&(Airbnb.Utils.fbHasPublishAction||Airbnb.userAttributes.og_publish)){$(document).bind("needFBPermissions",function(){getPublishPermissionAndCallCallback();
$(document).unbind("needFBPermissions",false)
});
callback(callbackParams)
}else{getPublishPermissionAndCallCallback()
}};
return my
})()
})(jQuery,window.Airbnb||{});
!function(exports,$){exports.SearchUtils={get_location_from_pathname:function(windowLocation){var pathElements=windowLocation.pathname.split("/");
if(pathElements.length>=3){return this.location_from_url_parameter(decodeURIComponent(pathElements[2].replace(/\+/g," ")))
}else{return null
}},location_to_url_parameter:function(t){return(t||"").replace("/"," ").replace(")","").replace("(","").replace("]","").replace("[","").replace(/\s+/g," ").replace(/-/g,"~").replace(/, ?/g,"--").replace(/ /g,"-").replace(/\./g,"%252E")
},location_from_url_parameter:function(t){return(t||"").replace(/-/g," ").replace(/~/g,"-").replace(/ {2}/g,", ").replace(/%2E/g,".")
},handleFormSubmit:function(form){var $form,data,params,location,qs,action,collectionRegex;
$form=$(form);
data=$form.serializeArray();
collectionRegex=/\[\]$/;
params=_.reduce(_.filter(data,function(pair){return !!pair.value
}),function(memo,obj){if(obj.name.match(collectionRegex)){memo[obj.name]=memo[obj.name]||[];
memo[obj.name].push(obj.value)
}else{memo[obj.name]=obj.value
}return memo
},{});
location=params.location;
delete params.location;
if(params.guests==="1"){delete params.guests
}qs=$.param(params);
action="/s";
if(location){action+="/"+this.location_to_url_parameter(location)
}if(qs){action+="?"+qs
}window.location.href=action
}}
}(Airbnb,jQuery);
(function(){var AIR,_ref,__bind=function(fn,me){return function(){return fn.apply(me,arguments)
}
},__hasProp={}.hasOwnProperty,__extends=function(child,parent){for(var key in parent){if(__hasProp.call(parent,key)){child[key]=parent[key]
}}function ctor(){this.constructor=child
}ctor.prototype=parent.prototype;
child.prototype=new ctor();
child.__super__=parent.prototype;
return child
};
this.AIR||(this.AIR={});
AIR=this.AIR;
AIR.Views||(AIR.Views={});
AIR.Views.BaseView=(function(_super){__extends(BaseView,_super);
function BaseView(){this.render=__bind(this.render,this);
this.initialize=__bind(this.initialize,this);
_ref=BaseView.__super__.constructor.apply(this,arguments);
return _ref
}BaseView.prototype.template=null;
BaseView.prototype._hasRendered=false;
BaseView.prototype.initialize=function(options){this._bindViewEvents();
this.bindings();
return this._postInitialize()
};
BaseView.prototype._bindViewEvents=function(){var _this=this;
if(this.viewEvents==null){return
}return _.each(this.viewEvents,function(fn,eventName){if(_.isString(fn)){fn=_this[fn]
}return _this.on(eventName,fn,_this)
})
};
BaseView.prototype._postInitialize=function(){this.postInitialize();
return this.trigger("initialize")
};
BaseView.prototype.postInitialize=function(){};
BaseView.prototype._preRender=function(){this.preRender();
return this.trigger("render:pre")
};
BaseView.prototype.preRender=function(){};
BaseView.prototype.getRenderData=function(){if(this.model){return this.model.toJSON()
}else{return{}
}};
BaseView.prototype.getTemplate=function(){if(this.template&&JST[this.template]){return JST[this.template]
}else{return null
}};
BaseView.prototype.getHtml=function(){var template;
template=this.getTemplate();
if(template){return template(this.getRenderData(),{partials:JST})
}else{return""
}};
BaseView.prototype.render=function(options){if(options==null){options={}
}this._preRender();
if(options.html!==false){this.$el.html(this.getHtml())
}this.trigger("render");
this._bindUIElements();
this._postRender();
this._hasRendered=true;
return this
};
BaseView.prototype._postRender=function(){this.postRender();
return this.trigger("render:post")
};
BaseView.prototype._bindUIElements=function(){var name,selector,_ref1,_results;
if(!this.ui){return
}if(!this.uiBindings){this.uiBindings=_.result(this,"ui")
}this.ui={};
_ref1=this.uiBindings;
_results=[];
for(name in _ref1){selector=_ref1[name];
_results.push(this.ui[name]=this.$(selector))
}return _results
};
BaseView.prototype.postRender=function(){};
BaseView.prototype.bindings=function(){};
BaseView.prototype.cleanup=function(){this.trigger("cleanup");
this.dispose();
return this.remove()
};
BaseView.prototype.dispose=function(){return;
this.undelegateEvents();
if(this.model){this.model.off(null,null,this)
}if(this.collection){this.collection.off(null,null,this)
}return this
};
BaseView.prototype.$get=function(key,fresh){if(fresh==null){fresh=false
}this._$getEls||(this._$getEls={});
if(fresh||!this._$getEls[key]){this._$getEls[key]=this.$("[data-"+key+"]")
}return this._$getEls[key]
};
return BaseView
})(Backbone.View)
}).call(this);
(function(){var AIR,_base,_ref,__bind=function(fn,me){return function(){return fn.apply(me,arguments)
}
},__hasProp={}.hasOwnProperty,__extends=function(child,parent){for(var key in parent){if(__hasProp.call(parent,key)){child[key]=parent[key]
}}function ctor(){this.constructor=child
}ctor.prototype=parent.prototype;
child.prototype=new ctor();
child.__super__=parent.prototype;
return child
};
this.AIR||(this.AIR={});
AIR=this.AIR;
AIR.Views||(AIR.Views={});
(_base=AIR.Views).Shared||(_base.Shared={});
AIR.Views.Shared.PrivacyDropdownView=(function(_super){__extends(PrivacyDropdownView,_super);
function PrivacyDropdownView(){this.toggleDropdown=__bind(this.toggleDropdown,this);
this.dropdownCallback=__bind(this.dropdownCallback,this);
this.hideDropdown=__bind(this.hideDropdown,this);
this.showDropdown=__bind(this.showDropdown,this);
this.setPrivacy=__bind(this.setPrivacy,this);
this.render=__bind(this.render,this);
_ref=PrivacyDropdownView.__super__.constructor.apply(this,arguments);
return _ref
}PrivacyDropdownView.prototype.template="shared/privacy_dropdown_view";
PrivacyDropdownView.prototype.className="priv-container";
PrivacyDropdownView.prototype.events={"click .priv-button":"toggleDropdown","click ul.dropdown-menu > li > a":"setPrivacy"};
PrivacyDropdownView.prototype.resolveTemplate=function(){return JST[this.template]||JST[this.template.split("/")[1]]||JST["assets/templates/"+this.template]
};
PrivacyDropdownView.prototype.initialize=function(){return this["private"]=!!this.options["private"]
};
PrivacyDropdownView.prototype.getRenderData=function(){return{"private":this["private"],label:this.options.label||I18n.t("priv.description"),inputName:this.options.inputName||"private"}
};
PrivacyDropdownView.prototype.render=function(){var _this=this;
this.$el.html(this.resolveTemplate()(this.getRenderData()));
setTimeout((function(){var e,_ref1;
try{return(_ref1=require("o2"))!=null?_ref1.Tooltip.bind(_this.$el):void 0
}catch(_error){e=_error
}}),0);
return this
};
PrivacyDropdownView.prototype.setPrivacy=function(e){var onToggle;
e.stopPropagation();
e.preventDefault();
this.hideDropdown();
this["private"]=$(e.currentTarget).data("value")===1;
this.$("input").val(this["private"]?"1":"0").trigger("privacy-changed",this["private"]);
onToggle=this.options.onToggle;
if(onToggle){return onToggle(this["private"])
}};
PrivacyDropdownView.prototype.showDropdown=function(){this.$el.addClass("opened");
return $(document).on("click",this.dropdownCallback)
};
PrivacyDropdownView.prototype.hideDropdown=function(){this.$el.removeClass("opened");
return $(document).off("click",this.dropdownCallback)
};
PrivacyDropdownView.prototype.dropdownCallback=function(){this.$el.removeClass("opened");
return this.hideDropdown()
};
PrivacyDropdownView.prototype.toggleDropdown=function(e){e.stopPropagation();
if(this.$el.hasClass("opened")){return this.hideDropdown()
}else{return this.showDropdown()
}};
return PrivacyDropdownView
})(Backbone.View)
}).call(this);
(function(){this.JST||(this.JST={});
this.JST["shared/privacy_dropdown_view"]=(function(){this.JST||(this.JST={});
this.JST["shared/privacy_dropdown_view"]=Handlebars.template(function(Handlebars,depth0,helpers,partials,data){this.compilerInfo=[2,">= 1.0.0-rc.3"];
helpers=helpers||Handlebars.helpers;
data=data||{};
var buffer="",stack1,options,functionType="function",escapeExpression=this.escapeExpression,self=this,helperMissing=helpers.helperMissing;
function program1(depth0,data){return"1"
}function program3(depth0,data){return"0"
}buffer+="<label>";
if(stack1=helpers.label){stack1=stack1.call(depth0,{hash:{},data:data})
}else{stack1=depth0.label;
stack1=typeof stack1===functionType?stack1.apply(depth0):stack1
}buffer+=escapeExpression(stack1)+'</label>\n<input type="hidden" class="wishlist-privacy" name="';
if(stack1=helpers.inputName){stack1=stack1.call(depth0,{hash:{},data:data})
}else{stack1=depth0.inputName;
stack1=typeof stack1===functionType?stack1.apply(depth0):stack1
}buffer+=escapeExpression(stack1)+'" value="';
stack1=helpers["if"].call(depth0,depth0["private"],{hash:{},inverse:self.program(3,program3,data),fn:self.program(1,program1,data),data:data});
if(stack1||stack1===0){buffer+=stack1
}buffer+='">\n<div class="btn gray priv-button">\n  <span class="show-priv-everyone"><i class="icon icon-user"></i> ';
options={hash:{},data:data};
buffer+=escapeExpression(((stack1=helpers.t),stack1?stack1.call(depth0,"priv.everyone",options):helperMissing.call(depth0,"t","priv.everyone",options)))+' <b class="caret"></b></span>\n  <span class="show-priv-onlyme"><i class="icon icon-lock"></i> ';
options={hash:{},data:data};
buffer+=escapeExpression(((stack1=helpers.t),stack1?stack1.call(depth0,"priv.only_me",options):helperMissing.call(depth0,"t","priv.only_me",options)))+' <b class="caret"></b></span>\n  <ul class="dropdown-menu">\n    <li class="priv-onlyme"><a href="#" data-value="1"><i class="icon icon-lock"></i> ';
options={hash:{},data:data};
buffer+=escapeExpression(((stack1=helpers.t),stack1?stack1.call(depth0,"priv.only_me",options):helperMissing.call(depth0,"t","priv.only_me",options)))+'</a></li>\n    <li class="priv-everyone"><a href="#" data-value="0"><i class="icon icon-user"></i> ';
options={hash:{},data:data};
buffer+=escapeExpression(((stack1=helpers.t),stack1?stack1.call(depth0,"priv.everyone",options):helperMissing.call(depth0,"t","priv.everyone",options)))+'</a></li>\n    <li class="priv-onlyme"><a href="#" data-value="1"><i class="icon icon-lock"></i> ';
options={hash:{},data:data};
buffer+=escapeExpression(((stack1=helpers.t),stack1?stack1.call(depth0,"priv.only_me",options):helperMissing.call(depth0,"t","priv.only_me",options)))+'</a></li>\n  </ul>\n</div>\n<i class="icon large gray icon-question icon-info-sign" id="privacy-tooltip-trigger" data-tooltip-el="#privacy-tooltip"></i>\n<div class="tooltip tooltip-bottom-middle fade" id="privacy-tooltip" role="tooltip" data-trigger="#privacy-tooltip-trigger">\n  <div class="panel-body">\n    <h5>';
options={hash:{},data:data};
buffer+=escapeExpression(((stack1=helpers.t),stack1?stack1.call(depth0,"priv.everyone",options):helperMissing.call(depth0,"t","priv.everyone",options)))+"</h5>\n    <p>";
options={hash:{},data:data};
buffer+=escapeExpression(((stack1=helpers.t),stack1?stack1.call(depth0,"priv.everyone_description",options):helperMissing.call(depth0,"t","priv.everyone_description",options)))+'</p>\n  </div>\n  <div class="panel-body">\n    <h5>';
options={hash:{},data:data};
buffer+=escapeExpression(((stack1=helpers.t),stack1?stack1.call(depth0,"priv.only_me",options):helperMissing.call(depth0,"t","priv.only_me",options)))+"</h5>\n    <p>";
options={hash:{},data:data};
buffer+=escapeExpression(((stack1=helpers.t),stack1?stack1.call(depth0,"priv.only_me_description",options):helperMissing.call(depth0,"t","priv.only_me_description",options)))+"</p>\n  </div>\n</div>\n";
return buffer
});
return this.JST["shared/privacy_dropdown_view"]
}).call(this)
}).call(this);
(function(){this.JST||(this.JST={});
this.JST["shared/wishlist_modal"]=(function(){this.JST||(this.JST={});
this.JST["shared/wishlist_modal"]=Handlebars.template(function(Handlebars,depth0,helpers,partials,data){this.compilerInfo=[2,">= 1.0.0-rc.3"];
helpers=helpers||Handlebars.helpers;
data=data||{};
var buffer="",stack1,stack2,options,helperMissing=helpers.helperMissing,escapeExpression=this.escapeExpression,functionType="function";
buffer+='<div class="new-modal modal wishlist-modal clearfix">\n\n  <h3 class="modal-header panel-header panel-header-gray">\n    <i class="icon icon-heart"></i>\n    <span class="no_fb">';
options={hash:{},data:data};
buffer+=escapeExpression(((stack1=helpers.t),stack1?stack1.call(depth0,"save_to_wish_list",options):helperMissing.call(depth0,"t","save_to_wish_list",options)))+'</span>\n    <span class="fb">';
options={hash:{},data:data};
buffer+=escapeExpression(((stack1=helpers.t),stack1?stack1.call(depth0,"save_to_wish_list_and_fb",options):helperMissing.call(depth0,"t","save_to_wish_list_and_fb",options)))+"</span>\n    <a href=\"#\" data-modal-close=\"true\" data-behavior=\"modal-close\" class=\"panel-close close\">&times;</a>\n  </h3>\n\n  <div class=\"panel-padding panel-body clearfix\">\n    <div class='listingPhoto left'>\n      <img width='275' height='183' class=\"media-photo\">\n    </div>\n\n    <div class='wishlist left'>\n      <h4 class=\"hosting_description\"></h4>\n\n      <p class=\"hosting_address\"></p>\n\n      <div class='selectContainer'>\n        <div class='selectWidget hide'>\n\n          <ul class='selectList'></ul>\n\n          <div class='newWLContainer'>\n            <div class='doneContainer'>\n              <a class='create btn gray' href=\"javascript:void(0);\">";
options={hash:{},data:data};
buffer+=escapeExpression(((stack1=helpers.t),stack1?stack1.call(depth0,"wl_modal.create_new",options):helperMissing.call(depth0,"t","wl_modal.create_new",options)))+"</a>\n              <button class='btn done btn-primary blue'>";
options={hash:{},data:data};
buffer+=escapeExpression(((stack1=helpers.t),stack1?stack1.call(depth0,"wl_modal.done",options):helperMissing.call(depth0,"t","wl_modal.done",options)))+"</button>\n            </div>\n            <form action='/wishlists' method='post'>\n              ";
if(stack2=helpers.csrf_token_input){stack2=stack2.call(depth0,{hash:{},data:data})
}else{stack2=depth0.csrf_token_input;
stack2=typeof stack2===functionType?stack2.apply(depth0):stack2
}buffer+=escapeExpression(stack2)+"\n              <input size='26' type='text' placeholder='";
options={hash:{},data:data};
buffer+=escapeExpression(((stack1=helpers.t),stack1?stack1.call(depth0,"wl_modal.make_a_new",options):helperMissing.call(depth0,"t","wl_modal.make_a_new",options)))+"'/>\n              <i class=\"icon icon-spinner\" id=\"createLoading\"></i>\n              <button class='btn gray createWishlist blue' type='submit'>";
options={hash:{},data:data};
buffer+=escapeExpression(((stack1=helpers.t),stack1?stack1.call(depth0,"wl_modal.create",options):helperMissing.call(depth0,"t","wl_modal.create",options)))+'</button>\n            </form>\n          </div>\n        </div>\n\n        <span id="selected"><span></span><i></i></span>\n      </div>\n\n      <div class="clearfix">\n        <div class="noteContainer left">\n          <textarea name="note" class="wishlist-note" placeholder=\'';
options={hash:{},data:data};
buffer+=escapeExpression(((stack1=helpers.t),stack1?stack1.call(depth0,"wl_modal.add_note",options):helperMissing.call(depth0,"t","wl_modal.add_note",options)))+'\'></textarea>\n        </div>\n\n        <label class="share_fb_checkbox left">\n          <span class="block-checkbox-label">';
options={hash:{},data:data};
buffer+=escapeExpression(((stack1=helpers.t),stack1?stack1.call(depth0,"wl_modal.add_to_timeline",options):helperMissing.call(depth0,"t","wl_modal.add_to_timeline",options)))+':</span>\n          <i class="fb_icon" rel="tooltip" title=\'';
options={hash:{},data:data};
buffer+=escapeExpression(((stack1=helpers.t),stack1?stack1.call(depth0,"wl_modal.change_sharing",options):helperMissing.call(depth0,"t","wl_modal.change_sharing",options)))+'\'></i>\n          <input checked="checked" id="fb_share" name="fb_share" type="checkbox" value="true">\n        </label>\n      </div>\n\n      <div class="new-wishlist-privacy-controls">\n      </div>\n    </div>\n  </div>\n\n  <div class="panel-footer">\n    <button type=\'submit\' class=\'btn-primary blue save btn\'>';
options={hash:{},data:data};
buffer+=escapeExpression(((stack1=helpers.t),stack1?stack1.call(depth0,"wl_modal.save",options):helperMissing.call(depth0,"t","wl_modal.save",options)))+"</button>\n  </div>\n</div>\n";
return buffer
});
return this.JST["shared/wishlist_modal"]
}).call(this)
}).call(this);
(function(){this.JST||(this.JST={});
this.JST["shared/wishlist_dropdown"]=(function(){this.JST||(this.JST={});
this.JST["shared/wishlist_dropdown"]=Handlebars.template(function(Handlebars,depth0,helpers,partials,data){this.compilerInfo=[2,">= 1.0.0-rc.3"];
helpers=helpers||Handlebars.helpers;
data=data||{};
var buffer="",stack1,stack2,options,helperMissing=helpers.helperMissing,escapeExpression=this.escapeExpression,functionType="function";
buffer+='<div class="wishlist-dropdown-inner">\n\n  <div class="selectContainer">\n    <div class="selectWidget hide">\n\n      <ul class="selectList dropdown-menu dropdown-bordered">\n        <li class="clearfix share_fb_checkbox">\n          <label>\n            <i class="fb_icon" rel="tooltip" title=\'';
options={hash:{},data:data};
buffer+=escapeExpression(((stack1=helpers.t),stack1?stack1.call(depth0,"wl_modal.change_sharing",options):helperMissing.call(depth0,"t","wl_modal.change_sharing",options)))+'\'></i>\n            <span class="add_to_timeline">';
options={hash:{},data:data};
buffer+=escapeExpression(((stack1=helpers.t),stack1?stack1.call(depth0,"wl_modal.share_wishlists_on_timeline",options):helperMissing.call(depth0,"t","wl_modal.share_wishlists_on_timeline",options)))+'</span>\n            <input checked="checked" id="fb_share" name="fb_share" type="checkbox" value="true">\n          </label>\n        </li>\n      </ul>\n\n      <div class="newWLContainer dropdown">\n        <form action="/wishlists" method="post" style="margin:0;">\n          ';
if(stack2=helpers.csrf_token_input){stack2=stack2.call(depth0,{hash:{},data:data})
}else{stack2=depth0.csrf_token_input;
stack2=typeof stack2===functionType?stack2.apply(depth0):stack2
}buffer+=escapeExpression(stack2)+'\n          <input size="26" type="text" placeholder=\'';
options={hash:{},data:data};
buffer+=escapeExpression(((stack1=helpers.t),stack1?stack1.call(depth0,"wl_modal.make_a_new",options):helperMissing.call(depth0,"t","wl_modal.make_a_new",options)))+'\' />\n          <i class="icon icon-spinner" id="createLoading"></i>\n          <button class="btn createWishlist" type="submit">create</button>\n        </form>\n\n      </div>\n\n      <div class="privacy-settings">\n        <button class="btn wishlistSaveSettings">done</button>\n      </div>\n    </div>\n\n  </div>\n\n</div>\n';
return buffer
});
return this.JST["shared/wishlist_dropdown"]
}).call(this)
}).call(this);
(function(){this.JST||(this.JST={});
this.JST["shared/wishlist_select_list"]=(function(){this.JST||(this.JST={});
this.JST["shared/wishlist_select_list"]=Handlebars.template(function(Handlebars,depth0,helpers,partials,data){this.compilerInfo=[2,">= 1.0.0-rc.3"];
helpers=helpers||Handlebars.helpers;
data=data||{};
var buffer="",stack1,functionType="function",escapeExpression=this.escapeExpression,self=this;
function program1(depth0,data){return"checked"
}function program3(depth0,data){return'<i class="icon icon-lock"></i>'
}buffer+='<li data-wishlist-id="';
if(stack1=helpers.id){stack1=stack1.call(depth0,{hash:{},data:data})
}else{stack1=depth0.id;
stack1=typeof stack1===functionType?stack1.apply(depth0):stack1
}buffer+=escapeExpression(stack1)+'" class="clearfix ';
if(stack1=helpers.classNames){stack1=stack1.call(depth0,{hash:{},data:data})
}else{stack1=depth0.classNames;
stack1=typeof stack1===functionType?stack1.apply(depth0):stack1
}buffer+=escapeExpression(stack1)+'">\n  <label>\n    <input type="checkbox" ';
stack1=helpers["if"].call(depth0,depth0.checked,{hash:{},inverse:self.noop,fn:self.program(1,program1,data),data:data});
if(stack1||stack1===0){buffer+=stack1
}buffer+=' value="';
if(stack1=helpers.id){stack1=stack1.call(depth0,{hash:{},data:data})
}else{stack1=depth0.id;
stack1=typeof stack1===functionType?stack1.apply(depth0):stack1
}buffer+=escapeExpression(stack1)+'">\n    <span>';
if(stack1=helpers.name){stack1=stack1.call(depth0,{hash:{},data:data})
}else{stack1=depth0.name;
stack1=typeof stack1===functionType?stack1.apply(depth0):stack1
}buffer+=escapeExpression(stack1)+"</span>";
stack1=helpers["if"].call(depth0,depth0.isPrivate,{hash:{},inverse:self.noop,fn:self.program(3,program3,data),data:data});
if(stack1||stack1===0){buffer+=stack1
}buffer+="\n  </label>\n</li>\n";
return buffer
});
return this.JST["shared/wishlist_select_list"]
}).call(this)
}).call(this);
(function(){this.JST||(this.JST={});
this.JST["shared/wishlist_select_list_lightweight"]=(function(){this.JST||(this.JST={});
this.JST["shared/wishlist_select_list_lightweight"]=Handlebars.template(function(Handlebars,depth0,helpers,partials,data){this.compilerInfo=[2,">= 1.0.0-rc.3"];
helpers=helpers||Handlebars.helpers;
data=data||{};
var buffer="",stack1,functionType="function",escapeExpression=this.escapeExpression,self=this;
function program1(depth0,data){return"checked"
}function program3(depth0,data){return'<i class="icon icon-lock"></i>'
}buffer+='<li data-wishlist-id="';
if(stack1=helpers.id){stack1=stack1.call(depth0,{hash:{},data:data})
}else{stack1=depth0.id;
stack1=typeof stack1===functionType?stack1.apply(depth0):stack1
}buffer+=escapeExpression(stack1)+'" class="clearfix ';
if(stack1=helpers.classNames){stack1=stack1.call(depth0,{hash:{},data:data})
}else{stack1=depth0.classNames;
stack1=typeof stack1===functionType?stack1.apply(depth0):stack1
}buffer+=escapeExpression(stack1)+'">\n  <label>\n    <i ';
stack1=helpers["if"].call(depth0,depth0.checked,{hash:{},inverse:self.noop,fn:self.program(1,program1,data),data:data});
if(stack1||stack1===0){buffer+=stack1
}buffer+=' class="icon icon-ok"></i>\n    <input type="hidden" value="';
if(stack1=helpers.id){stack1=stack1.call(depth0,{hash:{},data:data})
}else{stack1=depth0.id;
stack1=typeof stack1===functionType?stack1.apply(depth0):stack1
}buffer+=escapeExpression(stack1)+'">\n    <span>';
if(stack1=helpers.name){stack1=stack1.call(depth0,{hash:{},data:data})
}else{stack1=depth0.name;
stack1=typeof stack1===functionType?stack1.apply(depth0):stack1
}buffer+=escapeExpression(stack1)+"</span>";
stack1=helpers["if"].call(depth0,depth0.isPrivate,{hash:{},inverse:self.noop,fn:self.program(3,program3,data),data:data});
if(stack1||stack1===0){buffer+=stack1
}buffer+="\n  </label>\n</li>\n";
return buffer
});
return this.JST["shared/wishlist_select_list_lightweight"]
}).call(this)
}).call(this);
!function(exports){var WishListSelectList=Backbone.View.extend({events:{"submit form":"formSubmit","change :checkbox":"checkboxChange","focus :text":"focusText","click a.create":"showCreate","click .done":"clickDone","click .wishlistDropdownItem":"wishlistSelect","click .wishlistSaveSettings":"wishlistSaveSettings"},initialize:function(){this.wishListButton=this.options.wishListButton;
this.hostingId=this.wishListButton.hostingId;
this.bindings()
},render:function(){this.$selected=$("#selected");
this.$name=this.$("input[type='text']");
this.$newWLContainer=$(".newWLContainer");
this.initSelection();
this.renderList();
this.updateText()
},renderList:function(){this.$list=this.$list||this.$(".selectList");
this.$list.prepend(this.template());
if(window.localStorage===undefined){this.$list.append(this.renderRefreshLink())
}},itemTemplate:function(wishlist){var _private,classNames,checked,templateName;
_private=wishlist.get("private");
checked=wishlist.get("selected");
classNames=[];
if(_private){classNames.push("private")
}if(checked){classNames.push("checked")
}if(this.wishListButton.useLightweightWishlist){classNames.push("wishlistDropdownItem");
templateName="shared/wishlist_select_list_lightweight"
}else{templateName="shared/wishlist_select_list"
}var data={id:wishlist.get("id"),name:wishlist.get("name"),classNames:classNames.join(" "),checked:checked,isPrivate:_private,};
return JST[templateName](data)
},template:function(){var self=this,html="";
Airbnb.Wishlists.each(function(wishlist){html+=self.itemTemplate(wishlist)
});
return html
},renderRefreshLink:function(){var $el,template,self=this;
template="<li id='refresh-container' class='clearfix'><a id='refresh-select-list' class='btn gray'>"+window.I18n.t("refresh_list")+"</a></li>";
$el=$(template);
$el.on("click",function(){$(this).find("a").html("<span class='spinner'></span>");
Airbnb.Wishlists.fetch().then(function(){self.renderList();
self.$list.scrollTop(0)
})
});
return $el
},initSelection:function(){var toBeSelected;
this.firstSelected=undefined;
Airbnb.Wishlists.clearSelection();
toBeSelected=Airbnb.Wishlists.forListing(this.hostingId);
if(toBeSelected.length===0&&!this.wishListButton.useLightweightWishlist){toBeSelected=[Airbnb.Wishlists.first()];
this.firstSelected=true
}_.each(toBeSelected,function(wishlist){if(typeof wishlist!=="undefined"){wishlist.set({selected:true})
}});
Airbnb.Wishlists.moveSelectedToFront()
},hide:function(hide){var $save=$(".wishlist").find(".save");
this.$el.toggleClass("hide",hide);
if(hide){this.hideCreate();
this.trigger("listSelected");
if($save.length){$save.removeClass("disabled")
}}else{if($save.length){$save.addClass("disabled")
}}},updateText:function(){var text,selected,allPrivate;
selected=Airbnb.Wishlists.selected();
if(selected.length===1){text=selected[0].get("name")
}else{text=selected.length+" Wish Lists"
}allPrivate=selected.length&&_.all(selected,function(w){return w.get("private")
});
this.$selected.children("span").text(text);
this.$selected.toggleClass("private",allPrivate)
},showSettings:function(){this.$el.find(".priv-container").remove();
var view=new AIR.Views.Shared.PrivacyDropdownView({label:I18n.t("who_can_see_new_wishlist")});
$(".wishlist-dropdown-inner .privacy-settings").prepend(view.render().el);
$(".selectList").hide();
$(".newWLContainer").hide();
$(".privacy-settings").show();
var _this=this;
this.$el.on("privacy-changed",".priv-container input",function(event,isPrivate){var newWishlists=Airbnb.Wishlists.filter(function(w){return w.get("selected")&&w.get("new")
});
_.each(newWishlists,function(w){w.set("private",isPrivate)
});
var ogSetting=Airbnb.userAttributes.og_publish;
_this.$el.toggleClass("show_share_fb_checkbox",!isPrivate&&!ogSetting);
_this.$el.toggleClass("has_fb_publish_action",!isPrivate&&ogSetting)
})
},formSubmit:function(e){e.preventDefault();
var name,$input,self;
self=this;
name=this.$name.val();
if(name==""){this.$name.addClass("error")
}else{self.setLoading(true);
Airbnb.Wishlists.create(name,function(wishlist,errorXhr){self.setLoading(false);
if(wishlist){wishlist.set({selected:true});
self.$name.val("");
self.hideCreate();
self.wishListButton.track("create");
if(self.wishListButton.useLightweightWishlist){self.showSettings()
}else{self.hide(true);
self.wishListButton.modal.$el.addClass("create");
self.wishListButton.modal.renderPrivacyDropdown()
}}else{var errorMessage;
try{var response=JSON.parse(errorXhr.responseText);
errorMessage=response.error_message
}catch(e){errorMessage="There was an error creating your Wish List"
}alert(errorMessage)
}})
}},wishlistSaveSettings:function(){this.hide(true);
this.wishListButton.dropdown.instantUpdate();
this.wishListButton.dropdown.hide()
},checkboxChange:function(e){e.stopPropagation();
var $this=$(e.target),checked,wishlistId,wishlist;
checked=$this.prop("checked");
$this.parent().parent().toggleClass("checked",checked);
wishlistId=+$this.val();
wishlist=Airbnb.Wishlists.get(wishlistId);
if(wishlist){wishlist.set("selected",checked)
}},wishlistSelect:function(e){var $this=$(e.target).closest(".wishlistDropdownItem"),wishlistId,wishlist;
wishlistId=parseInt($this.find("input").val());
wishlist=Airbnb.Wishlists.get(wishlistId);
wishlist.set("selected",true)
},focusText:function(e){this.$name.removeClass("error")
},showCreate:function(){this.$newWLContainer.addClass("create");
this.$newWLContainer.find("input[type='text']").focus()
},hideCreate:function(){this.$newWLContainer.removeClass("create")
},clickDone:function(e){this.hide(true)
},bindings:function(){var self=this;
Airbnb.Wishlists.on("change:selected",function(wishlist,selected){self.updateText();
self.$('[data-wishlist-id="'+wishlist.id+'"]').toggleClass("checked",selected).find(":checkbox").prop("checked",selected)
});
Airbnb.Wishlists.on("add",function(wishlist){self.renderList();
self.updateText()
})
},setLoading:function(isLoading){this.$spinner=this.$spinner||this.$("#createLoading");
this.$createButton=this.$createButton||this.$(".createWishlist");
this.$spinner.toggle(isLoading);
this.$createButton.toggle(!isLoading)
}});
exports.WishListSelectList=WishListSelectList
}(Airbnb);
!function(exports){var WishListModal=function(wishListButton){this.wishListButton=wishListButton;
this.hostingId=this.wishListButton.hostingId
};
var modal=require("o2-modal");
WishListModal.prototype={init:function(){var callback,options;
this.$el=$(".wishlist-modal");
this.genericSetup();
this.sharingState=null;
this.fbPrecheck=null;
this.mixPanelTrack("wishlistModal.show");
this.mixPanelTrack("wishlistModalOrDropdown.show");
this.list=new exports.WishListSelectList({wishListButton:this.wishListButton,el:this.$el.find(".selectWidget")});
this.list.render();
this.initFbPublish();
this.setFBCheckbox();
this.delegateEvents();
var _this=this;
this.$el.on("modalClose",function(){_this.cleanup()
});
if(this.$el.hasClass("show_share_fb_checkbox")){this.mixPanelTrack("wishlistModal.showShareFBCheckbox");
this.sharingState="showFBCheckbox"
}else{if(this.$el.hasClass("has_fb_publish_action")){this.sharingState="hideFBCheckbox";
this.mixPanelTrack("wishlistModal.hideFBCheckboxToAutoshare")
}}},mixPanelTrack:function(eventName){var _this=this,userAttributes=Airbnb.userAttributes;
setTimeout(function(){Airbnb.Tracking.Mixpanel.track(eventName,{fbLoggedIn:JSCookie.cookie("fbs"),fbConnected:userAttributes.facebook_connected,fbPublishPermission:userAttributes.og_publish,wishlistingFrom:_this.wishListButton.getSource(),wishlistedBeforeBool:userAttributes.has_wishlisted,showFBCheckbox:_this.sharingState,precheckFBCheckbox:_this.fbPrecheck})
},0)
},initFbPublish:function(){var wishlist;
wishlist=Airbnb.Wishlists.detect(function(w){return w.get("selected")&&!w.get("private")
});
if(Airbnb.userAttributes.og_publish&&wishlist){this.$el.addClass("has_fb_publish_action")
}else{if(wishlist){this.$el.addClass("show_share_fb_checkbox")
}else{this.$el.removeClass("show_share_fb_checkbox");
this.$el.removeClass("has_fb_publish_action")
}}},genericSetup:function(){var data=this.wishListButton.$el.data();
$(".hosting_description").append(data.name);
$(".hosting_address").append(data.address);
$(".listingPhoto").find("img").attr("src",data.img)
},setFBCheckbox:function(){var checked=false;
var fbLoggedIn=JSCookie.cookie("fbs");
var fbConnected=Airbnb.userAttributes.facebook_connected;
if(!Airbnb.userAttributes.show_wishlist_fb_modal&&!Airbnb.userAttributes.has_wishlisted&&(fbLoggedIn||fbConnected)){checked=true
}var $fb_checked=$("input[type=checkbox]#fb_share");
$fb_checked.prop("checked",checked);
if(checked&&this.$el.hasClass("show_share_fb_checkbox")){this.mixPanelTrack("wishlistModal.precheckFBCheckbox");
this.fbPrecheck="precheckFBCheckbox"
}else{if(this.$el.hasClass("show_share_fb_checkbox")){this.mixPanelTrack("wishlistModal.dontPrecheckFBCheckbox");
this.fbPrecheck="dontPrecheckFBCheckbox"
}}},getHtml:function(){function resolveTemplate(path){var parts=path.split("/"),length=parts.length,template,testParts=[];
for(var i=0;
i<length;
i++){testParts.unshift(parts.pop());
template=window.JST[testParts.join("/")];
if(template!==undefined){return template
}}}var fullPath="shared/wishlist_modal";
return resolveTemplate(fullPath)()
},show:function(){var _this=this;
exports.Wishlists.resetFromLocalStorage();
modal(this.getHtml());
modal.open(function(){_this.init()
});
if(typeof WishlistsApp!=="undefined"){_this.$el.addClass("listing_view")
}},cleanup:function(){this.list.$el.undelegate();
this.$el.remove()
},renderPrivacyDropdown:function(){this.$el.find(".priv-container").remove();
var view=new AIR.Views.Shared.PrivacyDropdownView({label:I18n.t("who_can_see_new_wishlist")});
this.$el.find(".new-wishlist-privacy-controls").html(view.render().el);
var _this=this;
this.$el.on("privacy-changed",".priv-container input",function(event,isPrivate){var newWishlists=Airbnb.Wishlists.filter(function(w){return w.get("selected")&&w.get("new")
});
_.each(newWishlists,function(w){w.set("private",isPrivate)
});
var ogSetting=Airbnb.userAttributes.og_publish;
_this.$el.toggleClass("show_share_fb_checkbox",!isPrivate&&!ogSetting);
_this.$el.toggleClass("has_fb_publish_action",!isPrivate&&ogSetting)
})
},update:function(){this.mixPanelTrack("wishlistModal.savingWishlist");
var _this=this,params,$privEl,selected,previouslySelected,toRemove,toAdd,firstPublic,note,selectedIds,_private;
previouslySelected=Airbnb.Wishlists.forListing(this.hostingId);
selected=Airbnb.Wishlists.selected();
toRemove=_.difference(previouslySelected,selected);
toAdd=_.difference(selected,previouslySelected);
firstPublic=_.first(_.filter(selected,function(w){return !w.get("private")
}));
if(firstPublic){this.shareViaFacebook(firstPublic);
this.mixPanelTrack("wishlistModal.savingToPublicWishlist")
}else{this.mixPanelTrack("wishlistModal.savingToPrivateWishlist")
}note=this.$el.find("textarea").val();
$privEl=this.$el.find('input[name="private"]');
if($privEl.length){_private=!!(+$privEl.val())
}_.each(toAdd,function(wishlist){params={note:note,source:_this.wishListButton.getSource()};
if(_private!=null){params["private"]=_private
}wishlist.addListing(_this.hostingId,params);
_this.wishListButton.track("save")
});
_.each(toRemove,function(wishlist){selectedIds=_.map(selected,function(wl){return wl.id
});
wishlist.removeListing(_this.hostingId,selectedIds);
_this.wishListButton.track("unsave")
});
this.wishListButton.initSavedState()
},shareViaFacebook:function(wishlist){window.wishlistId=wishlist.id;
window.wishlistNote=this.$el.find("textarea").val();
var _this=this,userAttributes=Airbnb.userAttributes;
if(!userAttributes.show_wishlist_fb_modal&&!userAttributes.og_publish){var fb_checked=$("input[type=checkbox]#fb_share").is(":checked");
if(fb_checked){Airbnb.OpenGraph.doWithPublishPermission(function(){Airbnb.OpenGraph.sendWishlistToFacebook(_this.hostingId)
});
this.mixPanelTrack("wishlistModal.savedWithFBChecked");
this.wishListButton.track("publish_to_facebook")
}else{if(userAttributes.og_publish){userAttributes.og_publish=false;
$.post("/open_graph_actions/open_graph_setting",{allow:"false"});
this.mixPanelTrack("wishlistModal.savedWithFBUnCheckedAndSetPreference")
}else{this.mixPanelTrack("wishlistModal.savedWithFBUnChecked")
}}}else{if(userAttributes.og_publish){Airbnb.OpenGraph.doWithPublishPermission(function(){Airbnb.OpenGraph.sendWishlistToFacebook(_this.hostingId)
},{},true);
this.mixPanelTrack("wishlistModal.savedWithAutoShare")
}}},delegateEvents:function(){var _this,locationName,modalElement;
_this=this;
modalElement=_this.$el;
var boundHide=_.bind(_this.list.hide,_this.list);
var delayedHide=function(){if(_this.list.mouseleave===true&&_this.list.mouseenter===false){boundHide.call(_this,true)
}};
var lazyHide=_.debounce(delayedHide,400);
modalElement.off("click").on("click",function(e){_this.list.hide(true);
_this.list.$el.off("mouseleave")
});
this.list.off("listSelected");
this.list.on("listSelected",function(){_this.initFbPublish()
});
modalElement.undelegate(".selectContainer","click").delegate(".selectContainer","click",function(e){if(!$(e.target).is("button.done")){e.stopPropagation();
_this.list.hide(false);
_this.list.$el.on("mouseenter",function(){_this.list.mouseenter=true
});
_this.list.$el.on("mouseleave",function(){_this.list.mouseleave=true;
_this.list.mouseenter=false;
lazyHide()
})
}});
modalElement.undelegate("#selected","click").delegate("#selected","click",function(e){if(_this.list.firstSelected&&!_this.$el.hasClass("create")){Airbnb.Wishlists.clearSelection()
}});
modalElement.undelegate(".save","click").delegate(".save","click",function(e){e.preventDefault();
e.stopPropagation();
if($(this).hasClass("disabled")){return false
}_this.update();
Airbnb.userAttributes.has_wishlisted=true;
var show_fb_share_modal=Airbnb.userAttributes.show_wishlist_fb_modal;
if(show_fb_share_modal&&!Airbnb.userAttributes.og_publish){}else{modal.close()
}})
}};
exports.WishListModal=WishListModal
}(Airbnb);
!function(exports){var WishListDropdown=function(wishListButton){this.wishListButton=wishListButton;
this.hostingId=this.wishListButton.hostingId
};
WishListDropdown.prototype={init:function(){var callback,options;
this.$el=$(".wishlist-dropdown-inner");
this.genericSetup();
this.sharingState=null;
this.fbPrecheck=null;
this.list=new exports.WishListSelectList({wishListButton:this.wishListButton,el:this.$el.find(".selectWidget")});
this.list.render();
this.wishListButton.mixPanelTrack("wishlistModalOrDropdown.show");
this.initFbPublish();
this.setFBCheckbox();
this.delegateEvents()
},initFbPublish:function(){if(Airbnb.userAttributes.og_publish){this.$el.addClass("has_fb_publish_action");
this.$el.removeClass("show_share_fb_checkbox")
}else{this.$el.addClass("show_share_fb_checkbox")
}},genericSetup:function(){var data=this.wishListButton.$el.data();
$(".hosting_description").append(data.name);
$(".hosting_address").append(data.address)
},setFBCheckbox:function(){var checked=false,fbLoggedIn=JSCookie.cookie("fbs"),fbConnected=Airbnb.userAttributes.facebook_connected;
if(!Airbnb.userAttributes.show_wishlist_fb_modal&&!Airbnb.userAttributes.has_wishlisted&&(fbLoggedIn||fbConnected)){checked=true
}var $fb_checked=$("input[type=checkbox]#fb_share");
$fb_checked.prop("checked",checked);
if(checked&&this.$el.hasClass("show_share_fb_checkbox")){this.wishListButton.mixPanelTrack("wishlistModal.precheckFBCheckbox");
this.fbPrecheck="precheckFBCheckbox"
}else{if(this.$el.hasClass("show_share_fb_checkbox")){this.wishListButton.mixPanelTrack("wishlistModal.dontPrecheckFBCheckbox");
this.fbPrecheck="dontPrecheckFBCheckbox"
}}},getHtml:function(){function resolveTemplate(path){var parts=path.split("/"),length=parts.length,template,testParts=[];
for(var i=0;
i<length;
i++){testParts.unshift(parts.pop());
template=window.JST[testParts.join("/")];
if(template!==undefined){return template
}}}var fullPath="assets/templates/shared/wishlist_dropdown";
return resolveTemplate(fullPath)()
},show:function(){var _this=this;
exports.Wishlists.resetFromLocalStorage();
var html=this.getHtml(),$wishlistDropdown=$("#wishlist-dropdown");
$wishlistDropdown.show();
$wishlistDropdown.html(html);
_this.init()
},hide:function(){$("#wishlist-dropdown").hide()
},clean:function(){this.list.$el.undelegate()
},instantUpdate:function(){this.wishListButton.mixPanelTrack("wishlistModal.savingWishlist");
var self=this,params,$privEl,selected,previouslySelected,toAdd,firstPublic,note,_private;
previouslySelected=Airbnb.Wishlists.forListing(this.hostingId);
selected=Airbnb.Wishlists.selected();
toAdd=_.without(selected,previouslySelected);
firstPublic=_.first(_.filter(toAdd,function(w){return !w.get("private")
}));
if(firstPublic){this.shareViaFacebook(firstPublic);
this.wishListButton.mixPanelTrack("wishlistModal.savingToPublicWishlist")
}else{this.wishListButton.mixPanelTrack("wishlistModal.savingToPrivateWishlist")
}note=this.$el.find("textarea").val();
$privEl=this.$el.find('input[name="private"]');
if($privEl.length){_private=!!(+$privEl.val())
}_.each(toAdd,function(wishlist){params={note:note,source:self.wishListButton.getSource()};
if(_private!=null){params["private"]=_private
}wishlist.addListing(self.hostingId,params);
self.wishListButton.track("save")
});
this.wishListButton.initSavedState()
},shareViaFacebook:function(wishlist){var _this=this,userAttributes=Airbnb.userAttributes;
window.wishlistId=wishlist.id;
window.wishlistNote=this.$el.find("textarea").val();
if(!userAttributes.show_wishlist_fb_modal&&!userAttributes.og_publish){var fb_checked=$("input[type=checkbox]#fb_share").is(":checked");
if(fb_checked){Airbnb.OpenGraph.doWithPublishPermission(function(){Airbnb.OpenGraph.sendWishlistToFacebook(_this.hostingId);
userAttributes.og_publish=true;
_this.initFbPublish()
},{},true);
this.wishListButton.mixPanelTrack("wishlistModal.savedWithFBChecked");
this.wishListButton.track("publish_to_facebook")
}else{if(userAttributes.og_publish){userAttributes.og_publish=false;
$.post("/open_graph_actions/open_graph_setting",{allow:"false"});
this.wishListButton.mixPanelTrack("wishlistModal.savedWithFBUnCheckedAndSetPreference")
}else{this.wishListButton.mixPanelTrack("wishlistModal.savedWithFBUnChecked")
}}}else{if(userAttributes.og_publish){Airbnb.OpenGraph.doWithPublishPermission(function(){Airbnb.OpenGraph.sendWishlistToFacebook(_this.hostingId)
});
this.wishListButton.mixPanelTrack("wishlistModal.savedWithAutoShare")
}}},delegateEvents:function(){var self,$el,modalOverlay,locationName;
self=this;
$el=$("#wishlist-dropdown");
var boundHide=_.bind(self.list.hide,self.list);
var delayedHide=function(){if(self.list.mouseleave===true&&self.list.mouseenter===false){boundHide.call(self,true)
}};
var lazyHide=_.debounce(delayedHide,400);
$el.off("click").on("click",function(e){self.list.hide(true);
self.list.$el.off("mouseleave")
});
this.list.off("listSelected");
this.list.on("listSelected",function(){self.initFbPublish()
});
$el.undelegate(".selectContainer","click").delegate(".selectContainer","click",function(e){if(!$(e.target).is("button.done")){e.stopPropagation();
self.list.hide(false);
self.list.$el.on("mouseenter",function(){self.list.mouseenter=true
});
self.list.$el.on("mouseleave",function(){self.list.mouseleave=true;
self.list.mouseenter=false;
lazyHide()
})
}});
$el.undelegate("#selected","click").delegate("#selected","click",function(e){if(self.list.firstSelected&&!self.$el.hasClass("create")){Airbnb.Wishlists.clearSelection()
}});
$el.delegate(".selectList li.wishlistDropdownItem","click").delegate(".selectList li.wishlistDropdownItem","click",function(e){e.stopPropagation();
e.preventDefault();
self.instantUpdate();
self.hide()
})
}};
provide("wishlist_dropdown",WishListDropdown)
}(Airbnb);
(function(exports,$,window,document){var hasTracked=false,hasInitializedData=false,lastOptions={},LOCAL_STORAGE_KEY="modal_wishlists",MAX_LOCAL_STORAGE_SIZE=100*1024;
var Wishlist=Backbone.Model.extend({initialize:function(){this.on("addListing removeListing",function(){this.collection.updateInLocalStorage()
});
this.on("removeListing",function(id){var app=window.WishlistsApp,currentWishlist=app&&app.get("currentWishlist");
if(currentWishlist&&app.isOwner(currentWishlist)){var listings=currentWishlist.get("listings");
var listing=listings.get(id);
listings.remove(listing)
}})
},hasListing:function(listingId){return !!~this.listingIndex(listingId)
},listingIndex:function(listingId){return _.indexOf(this.get("listing_ids")||[],listingId)
},addListing:function(listingId,params){var listingIds=this.get("listing_ids");
listingIds.push(listingId);
this.set("listing_ids",listingIds);
this.collection.listingIds[listingId]=true;
this.trigger("addListing",listingId);
$(document).trigger("addListing.wishlists",{id:listingId});
params={collection:params||{}};
params.collection_ids={};
params.collection_ids[this.id]=true;
Airbnb.Api.post("/v1/listings/"+listingId+"/update",{data:params,error:ajaxErrorHandler("addListing")})
},removeListing:function(listingId,selectedIds){var index,listingIds,params;
listingIds=this.get("listing_ids");
index=this.listingIndex(listingId);
if(~index){listingIds.splice(index,1);
this.set("listing_ids",listingIds);
this.collection.cacheListingIds();
this.trigger("removeListing",listingId);
$(document).trigger("removeListing.wishlists",{id:listingId,selectedIds:selectedIds});
params={collection_ids:{}};
params.collection_ids[this.id]=false;
Airbnb.Api.post("/v1/listings/"+listingId+"/update",{data:params,error:ajaxErrorHandler("removeListing")})
}}});
var WishlistsCollection=Backbone.Collection.extend({model:Wishlist,initialize:function(){this.listingIds={};
this.on("reset",this.cacheListingIds,this);
this.on("add",this.afterAdd,this);
this.on("add reset remove",this.updateInLocalStorage,this)
},parse:function(wishlists){if(!_.isArray(wishlists)){wishlists=wishlists.wishlists
}return _.map(wishlists,function(wishlist){return wishlist.wishlist||wishlist
})
},afterAdd:function(wishlist){var listingIds=wishlist.get("listing_ids");
for(var i in listingIds){if(_.isNumber(listingIds[i])){this.listingIds[listingIds[i]]=true
}}},moveSelectedToFront:function(){var index,_this=this;
this.selected(true).each(function(wishlist){index=_this.indexOf(wishlist);
if(index>1){_this.models.splice(index,1);
_this.models.unshift(wishlist)
}})
},clearSelection:function(){this.selected(true).each(function(wishlist){wishlist.set({selected:false})
})
},add:function(){var models=arguments[0];
if(!_.isArray(models)){models=[models]
}arguments[0]=this.parse(models);
Backbone.Collection.prototype.add.apply(this,arguments)
},addByIdAndName:function(wishlistId,name){var wishlist={id:wishlistId,name:name,"private":false,listing_ids:[],"new":true};
this.add(wishlist,{at:0});
return this.first()
},cacheListingIds:function(){var listingIds,i;
this.listingIds={};
listingIds=_.flatten(this.pluck("listing_ids"));
for(i in listingIds){if(_.isNumber(listingIds[i])){this.listingIds[listingIds[i]]=true
}}},hasListing:function(id){return !!this.listingIds[id]
},selected:function(chain){var scope=chain?this.chain():this;
return scope.select(function(w){return w.get("selected")
})
},forListing:function(listingId){return this.select(function(wishlist){return wishlist.hasListing(listingId)
})
},create:function(name,callback){var self=this;
Airbnb.Api.post("/v1/collections/create",{data:{name:name},success:function(data){var id=data.collection.collection.id;
var wishlist=self.addByIdAndName(id,name);
callback&&callback(wishlist)
},error:ajaxErrorHandler("create",function(jqXHR){callback&&callback(null,jqXHR)
})})
},resetFromLocalStorage:function(){var json,data,userId,userData;
json=window.localStorage&&window.localStorage.getItem(LOCAL_STORAGE_KEY);
userId=this.userId();
if(json&&userId){data=JSON.parse(json);
userData=data[userId];
if(userData){this.reset(userData,{silent:true});
this.cacheListingIds()
}}},updateInLocalStorage:function(){var userId,data,json;
if(window.localStorage){userId=this.userId();
data={};
data[userId]=this.toJSON();
json=JSON.stringify(data);
if(json.length<=MAX_LOCAL_STORAGE_SIZE){window.localStorage.setItem(LOCAL_STORAGE_KEY,json)
}}},userId:function(){return exports.userAttributes.id
},fetch:function(options){options=options||{};
options.url="/wishlists/personalize";
return Backbone.Collection.prototype.fetch.call(this,options)
},initializeData:function(callback){var _this=this;
function done(){callback();
$(document).trigger("initialize.wishlists",{wishlists:_this})
}if(this.userId()!=null){this.resetFromLocalStorage();
this.fetch().then(done)
}else{done()
}},destroy:function(id){var model=this.get(+id);
this.remove(model)
}});
exports.Wishlists=new WishlistsCollection();
var WishListButton=function(el,options){this.$el=$(el);
this.options=getDefaultOptions(options);
this.hostingId=this.$el.data("hosting_id");
this.initSavedState();
this.modal=new exports.WishListModal(this);
var WishlistDropdown=require("wishlist_dropdown");
this.dropdown=new WishlistDropdown(this);
this.trackImpression();
this.useLightweightWishlist=(Airbnb.userAttributes.lightweight_wishlist&&this.getSource()==="page3")
};
WishListButton.prototype={mixPanelTrack:function(eventName){var _this=this,userAttributes=Airbnb.userAttributes;
setTimeout(function(){Airbnb.Tracking.Mixpanel.track(eventName,{fbLoggedIn:JSCookie.cookie("fbs"),fbConnected:userAttributes.facebook_connected,fbPublishPermission:userAttributes.og_publish,wishlistingFrom:_this.getSource(),wishlistedBeforeBool:userAttributes.has_wishlisted,showFBCheckbox:_this.sharingState,precheckFBCheckbox:_this.fbPrecheck,lightweightWishlist:_this.useLightweightWishlist})
},0)
},clickHandler:function(e){e.preventDefault();
if(Airbnb.Utils.isUserLoggedIn){if(this.useLightweightWishlist){this.dropdown.show();
this.mixPanelTrack("lightweight_wl_button_click")
}else{this.modal.show()
}this.track("modal_or_dropdown_show")
}else{this.showSignupModal()
}},hoverHandler:function(e){if(this.useLightweightWishlist){var _this=this;
e.preventDefault();
if(Airbnb.Utils.isUserLoggedIn){this.dropdown.show();
this.track("modal_or_dropdown_show");
$("body").on("click",function(){_this.dropdown.hide()
})
}}},showSignupModal:function(){var _this=this;
this.mixPanelTrack("wl.showSignupModal");
Airbnb.SignupLoginModal.launchSignup({callback:function(){_this.mixPanelTrack("wl.signedUpWithSignupModal");
Airbnb.Wishlists.fetch().then(function(){if(_this.useLightweightWishlist){_this.dropdown.show()
}else{_this.modal.show()
}})
},flow:"wishlist"})
},isSaved:function(){return exports.Wishlists.hasListing(this.hostingId)
},getSource:function(){return this.options.placement
},initSavedState:function(){var isSaved=this.isSaved();
this.$el.toggleClass("saved",isSaved).toggleClass("not_saved",!isSaved)
},track:function(){var loggedIn=Airbnb.Utils.isUserLoggedIn?1:0;
var args=["_trackEvent","WishList"].concat([arguments[0],this.options.placement,loggedIn]);
if(typeof _gaq!=="undefined"){_gaq.push(args)
}},trackImpression:function(){if(hasTracked===false){this.track("button_impression");
hasTracked=true
}}};
function delegateEvents(options){var hoverEvent="hover.wlb",clickEvent="click.wlb",selector=".wish_list_button";
$(document).off(hoverEvent,selector).on(hoverEvent,selector,function(e){var button=new WishListButton($(this),options);
if(!$(".wishlist-dropdown-inner").is(":visible")){button.hoverHandler(e)
}});
$(document).off(clickEvent,selector).on(clickEvent,selector,function(e){var button=new WishListButton($(this),options);
if(!$(".wishlist-dropdown-inner").is(":visible")){button.clickHandler(e)
}})
}function initSavedState(options){$(".wish_list_button").each(function(){new WishListButton($(this),lastOptions)
})
}function getDefaultOptions(options){return _.defaults(options||{},{events:true})
}WishListButton.init=function(options){options=getDefaultOptions(options);
hasTracked=false;
lastOptions=options;
if(options.events){delegateEvents(options)
}if(!hasInitializedData){exports.Wishlists.initializeData(initSavedState);
hasInitializedData=true
}};
WishListButton.update=function(){initSavedState()
};
function trackError(action,properties){var props=_.extend({},properties,{url:document.URL,userId:Airbnb.userAttributes.id,action:action});
Airbnb.Tracking.Mixpanel.track("wishlist.error",props)
}function ajaxErrorHandler(action,callback){return function(xhr){trackError(action,{statusCode:xhr.status});
callback&&callback(xhr)
}
}exports.Wishlists.bind("reset",WishListButton.update);
exports.WishListButton=WishListButton
})(Airbnb,jQuery,window,document);
(function(){this.JST||(this.JST={});
this.JST["shared/neighborhoods/neighborhoods_popover"]=(function(){this.JST||(this.JST={});
this.JST["shared/neighborhoods/neighborhoods_popover"]=Handlebars.template(function(Handlebars,depth0,helpers,partials,data){this.compilerInfo=[2,">= 1.0.0-rc.3"];
helpers=helpers||Handlebars.helpers;
data=data||{};
var buffer="",stack1,options,functionType="function",escapeExpression=this.escapeExpression,self=this,blockHelperMissing=helpers.blockHelperMissing;
function program1(depth0,data){var buffer="",stack1;
buffer+='\n        <li class="label label-lightblue">';
if(stack1=helpers.name){stack1=stack1.call(depth0,{hash:{},data:data})
}else{stack1=depth0.name;
stack1=typeof stack1===functionType?stack1.apply(depth0):stack1
}buffer+=escapeExpression(stack1)+"</li>\n      ";
return buffer
}buffer+='<div class="neighborhoods-popover tooltip tooltip-panel-light in">\n  <a class="neighborhoods-image-anchor" href="';
if(stack1=helpers.url){stack1=stack1.call(depth0,{hash:{},data:data})
}else{stack1=depth0.url;
stack1=typeof stack1===functionType?stack1.apply(depth0):stack1
}buffer+=escapeExpression(stack1)+'">\n    <div class="beveled-media-box">\n      <img width="313" height="200" data-image-url="';
if(stack1=helpers.image){stack1=stack1.call(depth0,{hash:{},data:data})
}else{stack1=depth0.image;
stack1=typeof stack1===functionType?stack1.apply(depth0):stack1
}buffer+=escapeExpression(stack1)+'" alt="';
if(stack1=helpers.name){stack1=stack1.call(depth0,{hash:{},data:data})
}else{stack1=depth0.name;
stack1=typeof stack1===functionType?stack1.apply(depth0):stack1
}buffer+=escapeExpression(stack1)+'" nopin="nopin">\n      <div class="caption caption-fade panel-padding">\n        <h2>';
if(stack1=helpers.name){stack1=stack1.call(depth0,{hash:{},data:data})
}else{stack1=depth0.name;
stack1=typeof stack1===functionType?stack1.apply(depth0):stack1
}buffer+=escapeExpression(stack1)+'</h2>\n      </div>\n    </div>\n  </a>\n  <div class="panel-padding">\n    <h4>';
if(stack1=helpers.topline){stack1=stack1.call(depth0,{hash:{},data:data})
}else{stack1=depth0.topline;
stack1=typeof stack1===functionType?stack1.apply(depth0):stack1
}buffer+=escapeExpression(stack1)+'</h4>\n    <ul class="unstyled label-list">\n      ';
options={hash:{},inverse:self.noop,fn:self.program(1,program1,data),data:data};
if(stack1=helpers.tags){stack1=stack1.call(depth0,options)
}else{stack1=depth0.tags;
stack1=typeof stack1===functionType?stack1.apply(depth0):stack1
}if(!helpers.tags){stack1=blockHelperMissing.call(depth0,stack1,options)
}if(stack1||stack1===0){buffer+=stack1
}buffer+="\n    </ul>\n  </div>\n</div>\n";
return buffer
});
return this.JST["shared/neighborhoods/neighborhoods_popover"]
}).call(this)
}).call(this);
!function(){var O2Tooltip=require("o2-tooltip"),url="/locations/api/neighborhood_tiles.json?";
function initializeTooltip($tooltip,$el){var offset=$el.offset();
return new O2Tooltip($tooltip,{position:"top",x:offset.left+($el.width()/2),y:offset.top+5})
}var NeighborhoodsPopoverModel=Backbone.Model.extend({parse:function(resp){return this.id?resp[this.id]:resp
},url:function(){var baseURL=url;
return[baseURL,"ids[]=",this.id].join("")
}});
var NeighborhoodsPopoverCollection=Backbone.Collection.extend({model:NeighborhoodsPopoverModel,parse:function(resp){var flattenedResp=[],keys=_.keys(resp),i,key,length;
for(i=0,length=keys.length;
i<length;
i++){key=keys[i];
flattenedResp.push(resp[key])
}return flattenedResp
},url:function(){var baseURL=url,ids=[],i,idString,length;
for(i=0,length=this.models.length;
i<length;
i++){ids.push("ids[]="+this.models[i].get("id"))
}idString=ids.join("&");
return baseURL+idString
}});
var NeighborhoodsPopover=Backbone.View.extend({templateName:"shared/neighborhoods/neighborhoods_popover",events:{mouseover:"fadeIn",mouseout:"fadeOut"},initialize:function(){var context=this.getRenderData(),_this=this;
if(this.$el.length>0){this.$tooltip=$(window.JST[this.templateName](context));
this.tooltip=initializeTooltip(this.$tooltip,this.$el)
}_this.render()
},fadeIn:function(){var _this=this;
this.persist=true;
this.tooltip.fadeIn(function(){$(document).bind("mouseover.neighborhood_tooltip",function(e){if(!$(e.target).closest("[data-neighborhood-id]").length&&!$(e.target).closest(".tooltip").length){_this.persist=false;
_this.fadeOut()
}})
})
},fadeOut:function(){if(this.persist){return
}this.tooltip.fadeOut(function(){$(document).unbind("mouseover.neighborhood_tooltip")
})
},getRenderData:function(){return this.model.attributes
},render:function(){var $img;
if(this.$tooltip){$img=this.$tooltip.find("img[data-image-url]");
$img.attr("src",$img.data("image-url"))
}}});
provide("neighborhoods/neighborhoods_popover_model",NeighborhoodsPopoverModel);
provide("neighborhoods/neighborhoods_popover_collection",NeighborhoodsPopoverCollection);
provide("neighborhoods/neighborhoods_popover",NeighborhoodsPopover)
}();
!function(Airbnb,$){function getElTracer(el){var id="",className="";
while(el&&(!id||!className)){if(!id&&el.id){id=el.id
}if(!className&&el.className){className=el.className
}el=el.parentNode
}className=className.replace(/\s+/g,".");
return window.location.pathname+"#"+id+"."+className
}function clickHandler(e){var link=e.currentTarget;
if(!e.isDefaultPrevented()&&this.config.pattern.test(link.href)){window.amplify.store(this.config.key,getElTracer(link))
}}function LinkTracker(config){this.config=config;
this.config.key="LinkTracker"+this.config.pattern.toString();
$(document).on("click","a",$.proxy(clickHandler,this))
}LinkTracker.prototype.popUiReferrer=function(){var uiReferrer=window.amplify.store(this.config.key);
window.amplify.store(this.config.key,null);
return uiReferrer
};
provide("link_tracker",LinkTracker)
}(Airbnb,jQuery);
!function(){var LinkTracker=require("link_tracker"),lysLinkTracker;
lysLinkTracker=new LinkTracker({pattern:/\/rooms\/new/i});
provide("lys_link_tracker",lysLinkTracker)
}();
(function(){var AIR,_base,_ref,__hasProp={}.hasOwnProperty,__extends=function(child,parent){for(var key in parent){if(__hasProp.call(parent,key)){child[key]=parent[key]
}}function ctor(){this.constructor=child
}ctor.prototype=parent.prototype;
child.prototype=new ctor();
child.__super__=parent.prototype;
return child
};
this.AIR||(this.AIR={});
AIR=this.AIR;
AIR.Views||(AIR.Views={});
(_base=AIR.Views).Shared||(_base.Shared={});
AIR.Views.Shared.AvailabilityDropdown=(function(_super){__extends(AvailabilityDropdown,_super);
function AvailabilityDropdown(){_ref=AvailabilityDropdown.__super__.constructor.apply(this,arguments);
return _ref
}AvailabilityDropdown.prototype.template="manage_listing/availability_dropdown";
AvailabilityDropdown.prototype.events={"change select":"changeAvailability"};
AvailabilityDropdown.prototype.changeAvailability=function(e){var selection;
selection=$(e.currentTarget).val();
if(selection==="listed"){return this.list()
}else{return this.unlist()
}};
AvailabilityDropdown.prototype.postRender=function(){if(this.options.has_availability===true){this.$("select").val("listed");
return this.$(".dot").addClass("dot-success dot-green")
}else{this.$("select").val("unlisted");
return this.$(".dot").addClass("dot-danger dot-red")
}};
AvailabilityDropdown.prototype.getRenderData=function(){var base;
base={listing:{has_ever_been_available:this.options.has_ever_been_available}};
base.upwards=this.options.upwards;
return base
};
AvailabilityDropdown.prototype.list=function(){return this.setRoomAvailability(true)
};
AvailabilityDropdown.prototype.unlist=function(){return this.setRoomAvailability(false)
};
AvailabilityDropdown.prototype.setRoomAvailability=function(isAvailable){var params;
if(this.options.has_availability!==isAvailable){this.setAvailability(isAvailable,true);
if(this.options.on_rooms_page){params={id:this.options.hosting_id,is_available:isAvailable};
$.post("/rooms/change_availability",params,function(data){return true
},"JSON");
if(isAvailable&&this.options.suspended){Airbnb.Tracking.logEvent({event_name:"host_standards_friendly_suspension",event_data:{page:"rooms",action:"reactivate"}});
Flash.clearErrors()
}}return this.toggleDotColor()
}};
AvailabilityDropdown.prototype.toggleDotColor=function(){var $dot;
$dot=this.$(".dot");
if($dot.hasClass("dot-success")){return $dot.removeClass("dot-success dot-green").addClass("dot-danger dot-red")
}else{return $dot.removeClass("dot-danger dot-red").addClass("dot-success dot-green")
}};
AvailabilityDropdown.prototype.setAvailability=function(isAvailable,updateWithRequest){var apiPath,options,_this=this;
options={};
if(updateWithRequest){apiPath="/v1/listings/"+this.options.hosting_id+"/update";
options.data={listing:{has_availability:isAvailable}};
return Airbnb.Api.request("post",apiPath,options).done(function(data){return _this.options.has_availability=data.listing.has_availability
})
}else{this.options.has_availability=isAvailable;
return this.options.has_ever_been_available=isAvailable
}};
return AvailabilityDropdown
})(AIR.Views.BaseView)
}).call(this);
(function(){this.JST||(this.JST={});
this.JST["manage_listing/availability_dropdown"]=(function(){this.JST||(this.JST={});
this.JST["manage_listing/availability_dropdown"]=Handlebars.template(function(Handlebars,depth0,helpers,partials,data){this.compilerInfo=[2,">= 1.0.0-rc.3"];
helpers=helpers||Handlebars.helpers;
data=data||{};
var buffer="",stack1,stack2,helperMissing=helpers.helperMissing,escapeExpression=this.escapeExpression,self=this;
function program1(depth0,data){var buffer="",stack1,options;
buffer+='\n<i class="dot"></i>\n<div class=\'select select-large\'>\n  <select>\n    <option value="listed">';
options={hash:{},data:data};
buffer+=escapeExpression(((stack1=helpers.t),stack1?stack1.call(depth0,"Shared.Listed",options):helperMissing.call(depth0,"t","Shared.Listed",options)))+'</option>\n    <option value="unlisted">';
options={hash:{},data:data};
buffer+=escapeExpression(((stack1=helpers.t),stack1?stack1.call(depth0,"Shared.Unlisted",options):helperMissing.call(depth0,"t","Shared.Unlisted",options)))+"</option>\n  </select>\n</div>\n";
return buffer
}stack2=helpers["if"].call(depth0,((stack1=depth0.listing),stack1==null||stack1===false?stack1:stack1.has_ever_been_available),{hash:{},inverse:self.noop,fn:self.program(1,program1,data),data:data});
if(stack2||stack2===0){buffer+=stack2
}buffer+="\n";
return buffer
});
return this.JST["manage_listing/availability_dropdown"]
}).call(this)
}).call(this);
(function(){this.JST||(this.JST={});
this.JST["manage_listing/delete_listing_modal"]=(function(){this.JST||(this.JST={});
this.JST["manage_listing/delete_listing_modal"]=Handlebars.template(function(Handlebars,depth0,helpers,partials,data){this.compilerInfo=[2,">= 1.0.0-rc.3"];
helpers=helpers||Handlebars.helpers;
data=data||{};
var buffer="",stack1,options,helperMissing=helpers.helperMissing,escapeExpression=this.escapeExpression,functionType="function";
buffer+='<div class="modal" role="dialog" id="delete-listing-modal">\n  <div class="modal-table">\n    <div class="modal-cell">\n      <div class="modal-content">\n\n        \n        <div class="panel-header">\n          <a href="#" class="panel-close" data-behavior="modal-close"></a>\n          ';
options={hash:{},data:data};
buffer+=escapeExpression(((stack1=helpers.t),stack1?stack1.call(depth0,"edit_room.Delete Listing",options):helperMissing.call(depth0,"t","edit_room.Delete Listing",options)))+'\n        </div>\n\n        \n        <div class="panel-body">\n          <p>\n            <span>';
options={hash:{},data:data};
buffer+=escapeExpression(((stack1=helpers.t),stack1?stack1.call(depth0,"IMPORTANT!",options):helperMissing.call(depth0,"t","IMPORTANT!",options)))+"</span> ";
options={hash:{},data:data};
buffer+=escapeExpression(((stack1=helpers.t),stack1?stack1.call(depth0,"delete_listing.deleting is permanent",options):helperMissing.call(depth0,"t","delete_listing.deleting is permanent",options)))+"\n          </p>\n          <p>";
options={hash:{},data:data};
buffer+=escapeExpression(((stack1=helpers.t),stack1?stack1.call(depth0,"delete_listing.if you delete this listing",options):helperMissing.call(depth0,"t","delete_listing.if you delete this listing",options)))+"</p>\n          <ul>\n            <li>";
options={hash:{},data:data};
buffer+=escapeExpression(((stack1=helpers.t),stack1?stack1.call(depth0,"delete_listing.if_you_delete1",options):helperMissing.call(depth0,"t","delete_listing.if_you_delete1",options)))+"</li>\n            <li>";
options={hash:{},data:data};
buffer+=escapeExpression(((stack1=helpers.t),stack1?stack1.call(depth0,"delete_listing.if_you_delete2",options):helperMissing.call(depth0,"t","delete_listing.if_you_delete2",options)))+"</li>\n            <li>";
options={hash:{},data:data};
buffer+=escapeExpression(((stack1=helpers.t),stack1?stack1.call(depth0,"delete_listing.if_you_delete3",options):helperMissing.call(depth0,"t","delete_listing.if_you_delete3",options)))+"</li>\n            <li>";
options={hash:{},data:data};
buffer+=escapeExpression(((stack1=helpers.t),stack1?stack1.call(depth0,"delete_listing.if_you_delete4",options):helperMissing.call(depth0,"t","delete_listing.if_you_delete4",options)))+'</li>\n          </ul>\n\n          <form accept-charset="UTF-8" action="/hosting/delete" id="delete_listing" method=\n          "post">\n\n            \n            <div style="margin:0;padding:0;display:inline">\n              <input name="utf8" type="hidden" value="&#10003;" />\n              <input name="_method" type="hidden" value="delete" />\n              <input name="hosting_id" type="hidden" value="'+escapeExpression(((stack1=((stack1=depth0.listing),stack1==null||stack1===false?stack1:stack1.id)),typeof stack1===functionType?stack1.apply(depth0):stack1))+'" />\n            </div>\n\n            \n            <label for="reason">';
options={hash:{},data:data};
buffer+=escapeExpression(((stack1=helpers.t),stack1?stack1.call(depth0,"edit_room.Why Delete",options):helperMissing.call(depth0,"t","edit_room.Why Delete",options)))+'\n              <span class="lighter">(';
options={hash:{},data:data};
buffer+=escapeExpression(((stack1=helpers.t),stack1?stack1.call(depth0,"optional",options):helperMissing.call(depth0,"t","optional",options)))+')</span>:\n            </label>\n            <textarea id="reason" name="reason" class="row-space-2"></textarea>\n\n            \n            <label class="row-space-2" style="color:red;" >\n              <input type="checkbox" name="i_understand" id="i_understand">\n              ';
options={hash:{},data:data};
buffer+=escapeExpression(((stack1=helpers.t),stack1?stack1.call(depth0,"edit_room.delete.I understand",options):helperMissing.call(depth0,"t","edit_room.delete.I understand",options)))+'\n            </label>\n\n            \n            <input class="btn btn-special js-delete-listing-submit" disabled="disabled" name="commit" type="submit" value="';
options={hash:{},data:data};
buffer+=escapeExpression(((stack1=helpers.t),stack1?stack1.call(depth0,"edit_room.Delete Listing",options):helperMissing.call(depth0,"t","edit_room.Delete Listing",options)))+'" />\n\n          </form>\n        </div>\n      </div>\n    </div>\n  </div>\n</div>\n';
return buffer
});
return this.JST["manage_listing/delete_listing_modal"]
}).call(this)
}).call(this);
!function(){window.Pretzel={}
}();
!function(Pretzel,Airbnb){var PRETZEL_EXPERIMENT="pretzel";
function allowed(){return Airbnb.userAttributes.can_see_pretzel
}function displayed(){return Airbnb.userAttributes.display_assets_for_pretzel
}function pretzelUrl(url){var param=queryParam(PRETZEL_EXPERIMENT);
return addQueryParam(url,param)
}function rawUrl(pretzelUrl){if(!Pretzel.Utils.isPretzelUrl(pretzelUrl)){return
}var param=queryParam(PRETZEL_EXPERIMENT);
return removeQueryParam(pretzelUrl,param)
}function isPretzelUrl(url){return hasExperimentParam(url,PRETZEL_EXPERIMENT)
}function hasExperimentParam(url,experiment){var param=queryParam(experiment);
if(url.match(new RegExp("\\?"+param))){return true
}if(url.match(new RegExp("&"+param))){return true
}return false
}function queryParam(experiment){return"assets_for_"+experiment+"=1"
}function hasQueryParam(url){return url.indexOf("?")>=0
}function addQueryParam(url,param){if(url.match(/\?$/)){return url+param
}if(url.match(/\?/)){return url+"&"+param
}return url+"?"+param
}function removeQueryParam(url,param){var replaced=url.replace(param,"");
if(replaced.match(/&&/)){replaced=replaced.replace(/&&/,"&")
}if(replaced.match(/&$/)){replaced=replaced.slice(0,replaced.length-1)
}if(replaced.match(/\?$/)){replaced=replaced.replace("?","")
}return replaced
}Pretzel.Utils={allowed:allowed,displayed:displayed,pretzelUrl:pretzelUrl,rawUrl:rawUrl,isPretzelUrl:isPretzelUrl}
}(Pretzel,Airbnb);
!function(Pretzel){var PretzelUtils=Pretzel.Utils;
var SHOW_ID="#show-pretzel",HIDE_ID="#hide-pretzel";
function init(){if(PretzelUtils.allowed()){attachHandlers();
if(PretzelUtils.displayed()){reveal(HIDE_ID)
}else{reveal(SHOW_ID)
}}}function attachHandlers(){$(SHOW_ID).on("click",function(e){e.preventDefault();
window.location=PretzelUtils.pretzelUrl(window.location.href)
});
$(HIDE_ID).on("click",function(e){e.preventDefault();
window.location=PretzelUtils.rawUrl(window.location.href)
})
}function reveal(id){$("#asset-experiment-links, "+id).removeClass("hide")
}init()
}(Pretzel);
!function(Pretzel){var PretzelUtils=Pretzel.Utils;
function rewriteUrls(){if(PretzelUtils.allowed()&&PretzelUtils.displayed()){rewrite()
}}function rewrite(){rewriteLinks();
patchForms()
}function rewriteLinks(){$("a").each(function(){var $this=$(this),href=$this.attr("href");
if(!href){return
}if(isJsUrl(href)){return
}if(PretzelUtils.isPretzelUrl(href)){return
}$this.attr("href",PretzelUtils.pretzelUrl(href))
})
}function patchForms(){$("form").each(function(){var $this=$(this);
if($this.find(".hidden-pretzel-field").length!==0){return
}$this.append(["<input","class=hidden-pretzel-field","type=hidden","name=assets_for_pretzel","value=1>"].join(" "))
})
}function isJsUrl(url){return url==="#"||url==="javascript:void(0)"||url.match(/^#/)
}rewriteUrls();
$(rewriteUrls);
$(window).on("load",rewriteUrls);
Pretzel.rewriteUrls=rewriteUrls
}(Pretzel);
(function(){this.JST||(this.JST={});
this.JST["reauth/password_modal"]=(function(){this.JST||(this.JST={});
this.JST["reauth/password_modal"]=Handlebars.template(function(Handlebars,depth0,helpers,partials,data){this.compilerInfo=[2,">= 1.0.0-rc.3"];
helpers=helpers||Handlebars.helpers;
data=data||{};
var buffer="",stack1,options,helperMissing=helpers.helperMissing,escapeExpression=this.escapeExpression;
buffer+='<div class="modal reauth-password-modal">\n  <div class="modal-header panel-header">\n    <h3>\n      ';
options={hash:{},data:data};
buffer+=escapeExpression(((stack1=helpers.t),stack1?stack1.call(depth0,"users.Confirm_Password_to_Continue",options):helperMissing.call(depth0,"t","users.Confirm_Password_to_Continue",options)))+'\n    </h3>\n  </div>\n  <form class="form-horizontal">\n    <div class="modal-body panel-body">\n      <p class="panel-header alert alert-header alert-warning hide">\n      </p>\n      <div class="text-center reauth_with_facebook hide">\n        <h1>\n          <a class="btn btn-small btn-facebook facebook_reauthenticate fb-blue" href="#">\n            <span class="icon-container">\n              <i class="icon icon-facebook"></i>\n            </span>\n            <span class="text-container">\n              ';
options={hash:{},data:data};
buffer+=escapeExpression(((stack1=helpers.t),stack1?stack1.call(depth0,"users.Confirm_Facebook_Password",options):helperMissing.call(depth0,"t","users.Confirm_Facebook_Password",options)))+'\n            </span>\n          </a>\n        </h1>\n      </div>\n      <div class="control-group reauth_with_password_component">\n        <input type="password" name="password" class="decorative-input" placeholder="';
options={hash:{},data:data};
buffer+=escapeExpression(((stack1=helpers.t),stack1?stack1.call(depth0,"Password",options):helperMissing.call(depth0,"t","Password",options)))+'">\n        <div style="padding-top:10px;">\n        ';
options={hash:{},data:data};
buffer+=escapeExpression(((stack1=helpers.t),stack1?stack1.call(depth0,"users.Please_enter_your_Airbnb_password_to_continue.",options):helperMissing.call(depth0,"t","users.Please_enter_your_Airbnb_password_to_continue.",options)))+'\n        <a href="/users/forgot_password">';
options={hash:{},data:data};
buffer+=escapeExpression(((stack1=helpers.t),stack1?stack1.call(depth0,"user.signup.forgot_password",options):helperMissing.call(depth0,"t","user.signup.forgot_password",options)))+'</a>\n        </div>\n      </div>\n    </div>\n    <div class="modal-footer panel-footer">\n      <button class="btn btn-submit btn-primary reauth_with_password_component">\n        ';
options={hash:{},data:data};
buffer+=escapeExpression(((stack1=helpers.t),stack1?stack1.call(depth0,"users.Confirm_Password",options):helperMissing.call(depth0,"t","users.Confirm_Password",options)))+'\n      </button>\n      <button class="btn gray cancel">';
options={hash:{},data:data};
buffer+=escapeExpression(((stack1=helpers.t),stack1?stack1.call(depth0,"users.Cancel",options):helperMissing.call(depth0,"t","users.Cancel",options)))+"</button>\n    </div>\n  </form>\n</div>\n";
return buffer
});
return this.JST["reauth/password_modal"]
}).call(this)
}).call(this);
!function(global){function factory($,_){function Reauth(ajaxOptions){this.ajaxOptions=ajaxOptions;
this.deferred=new $.Deferred
}Reauth.prototype.submit=function(additionalOptions){var myOptions=_.extend({},this.ajaxOptions,additionalOptions,{success:this.resolve.bind(this),error:function(xhr,textStatus,errorThrown){if(xhr.status===419){this.launchPasswordModal(xhr)
}else{this.reject(xhr,textStatus,errorThrown)
}}.bind(this)});
$.ajax(myOptions);
return this.deferred
};
Reauth.prototype.resolve=function(data,textStatus,xhr){this.deferred.resolve(data,textStatus,xhr);
if(this.ajaxOptions.success){this.ajaxOptions.success(data,textStatus,xhr)
}};
Reauth.prototype.reject=function(xhr,textStatus,errorThrown){this.deferred.reject(xhr,textStatus,errorThrown);
if(this.ajaxOptions.error){this.ajaxOptions.error(xhr,textStatus,errorThrown)
}};
Reauth.prototype.submitPasswordModal=function(password){var headers=_.extend({},this.ajaxOptions.headers,{"X-Airbnb-Password":password});
this.submit({headers:headers})
};
Reauth.prototype.launchPasswordModal=function(xhr){var html=JST["reauth/password_modal"]({}).trim();
var modal=require("o2-modal");
modal(html);
modal.open();
var $el=modal.current();
if(xhr.responseJSON.message){$el.find(".alert.alert-header").text(xhr.responseJSON.message).show()
}if(xhr.responseJSON.logged_in_via_facebook){$el.find(".reauth_with_password_component").hide();
$el.find(".reauth_with_facebook").show()
}$el.on("submit","form",function(e){e.preventDefault();
var password=$el.find('[name="password"]').val();
modal.close();
$(".reauth-password-modal").remove();
setTimeout(function(){this.submitPasswordModal(password)
}.bind(this),300)
}.bind(this));
$el.on("click",".cancel",function(e){e.preventDefault();
modal.close()
});
$el.on("click",".facebook_reauthenticate",function(e){e.preventDefault();
modal.close();
FB.login(function(response){if(response.authResponse){var headers=_.extend({},this.ajaxOptions.headers,{"X-Airbnb-Facebook-Reauth-Access-Token":response.authResponse.accessToken,"X-Airbnb-Facebook-User-ID":response.authResponse.userID});
this.submit({headers:headers})
}else{modal.close()
}}.bind(this),{auth_type:"reauthenticate"})
}.bind(this))
};
Reauth.submit=function(ajaxOptions){return new Reauth(ajaxOptions).submit()
};
return Reauth
}if(global.Airbnb){global.Airbnb.Reauth=factory(global.$,global._)
}else{module.exports=factory
}}(this);
(function(){this.JST||(this.JST={});
this.JST["deep_link/ask_modal"]=(function(){this.JST||(this.JST={});
this.JST["deep_link/ask_modal"]=Handlebars.template(function(Handlebars,depth0,helpers,partials,data){this.compilerInfo=[2,">= 1.0.0-rc.3"];
helpers=helpers||Handlebars.helpers;
data=data||{};
var buffer="",stack1,options,self=this,helperMissing=helpers.helperMissing,escapeExpression=this.escapeExpression;
function program1(depth0,data){return"o2pointzero"
}buffer+='<div class="modal panel dl-ask-modal ';
stack1=helpers["if"].call(depth0,depth0.isO2pointzero,{hash:{},inverse:self.noop,fn:self.program(1,program1,data),data:data});
if(stack1||stack1===0){buffer+=stack1
}buffer+='" role="dialog">\n  <div class="panel-body modal-body">\n    <h3>';
options={hash:{},data:data};
buffer+=escapeExpression(((stack1=helpers.t),stack1?stack1.call(depth0,"dl.heading",options):helperMissing.call(depth0,"t","dl.heading",options)))+'</h3>\n    <button class="dl-open-in-app btn btn-primary large btn-large btn-block">\n      ';
options={hash:{},data:data};
buffer+=escapeExpression(((stack1=helpers.t),stack1?stack1.call(depth0,"dl.open_in_app",options):helperMissing.call(depth0,"t","dl.open_in_app",options)))+'\n    </button>\n    <button class="dl-no-thanks btn gray large btn-large btn-block"\n      data-behavior="modal-close"\n      data-modal-close="true">\n      ';
options={hash:{},data:data};
buffer+=escapeExpression(((stack1=helpers.t),stack1?stack1.call(depth0,"dl.no_thanks",options):helperMissing.call(depth0,"t","dl.no_thanks",options)))+"\n    </button>\n  </div>\n</div>\n";
return buffer
});
return this.JST["deep_link/ask_modal"]
}).call(this)
}).call(this);
!function(global){function factory(window,$,JSCookie,JST,o2Modal,Tracking){var TIMEOUT=100,COOKIE_NAME="dlpref",MODAL_BODY_CLASS="deep-link-modal-open";
function DeepLink(options){this.deepLinkUrl=options.deep_link_url;
this.force=options.force;
this.hasShownAskModal=false
}DeepLink.prototype.start=function initialize(){if(this.force){this.launchApp()
}else{var rememberedPreference=this.getRememberedPreference();
if(rememberedPreference==null){this.showAskModal()
}else{if(rememberedPreference===true){this.launchApp()
}else{if(rememberedPreference===false){}}}}};
DeepLink.prototype.launchApp=function launchApp(){window.location.href=this.deepLinkUrl;
setTimeout(this.onMissingApp.bind(this),TIMEOUT)
};
DeepLink.prototype.getRememberedPreference=function getRememberedPreference(){var cookie=JSCookie.cookie(COOKIE_NAME),value=null;
if(cookie==="1"){value=true
}else{if(cookie==="0"){value=false
}}return value
};
DeepLink.prototype.showAskModal=function showAskModal(){$("body").addClass(MODAL_BODY_CLASS);
this.setMobileViewport();
var html=JST["deep_link/ask_modal"]({isO2pointzero:Airbnb.o2Version==="o2.0"});
o2Modal(html);
o2Modal.open();
o2Modal.current().on("click",".dl-open-in-app",this.onClickOpen.bind(this)).on("modalClose",this.onModalClose.bind(this));
this.hasShownAskModal=true;
this.track("showAskModal")
};
DeepLink.prototype.onClickOpen=function onClickOpen(e){this.launchApp();
this.savePreference(true)
};
DeepLink.prototype.onModalClose=function onModalClose(){$("body").removeClass(MODAL_BODY_CLASS);
this.restoreViewport();
this.savePreference(false);
this.track("noThanks")
};
DeepLink.prototype.savePreference=function savePreference(preference){JSCookie.cookie(COOKIE_NAME,preference?"1":"0",{expires:14})
};
DeepLink.prototype.setMobileViewport=function setMobileViewport(){this.oldViewport=this._viewport();
this._viewport("width=device-width,initial-scale=1,maximum-scale=1,user-scalable=no")
};
DeepLink.prototype.restoreViewport=function restoreViewport(){this._viewport(this.oldViewport)
};
DeepLink.prototype._viewport=function _viewport(content){var $meta=$('meta[name="viewport"]');
if(content){$meta.attr("content",content)
}else{return $meta.attr("content")
}};
DeepLink.prototype.onMissingApp=function onMissingApp(){this.track("onMissingApp");
if(this.force&&this.hasShownAskModal===false){this.showAskModal()
}else{setTimeout(function(){this.redirectToAppStore()
}.bind(this),300)
}};
DeepLink.prototype.redirectToAppStore=function redirectToAppStore(){window.location.href="http://r.airbnb.com/l.c.hsjc"
};
DeepLink.prototype.track=function track(action){Tracking.logEvent({event_name:"deep_link",event_data:{deep_link_action:action,deep_link_url:this.deepLinkUrl,force:this.force,has_shown_ask_modal:this.hasShownAskModal}})
};
return DeepLink
}if(global.Airbnb){global.Airbnb.DeepLink=factory(global,global.$,global.JSCookie,global.JST,require("o2-modal"),Airbnb.Tracking)
}else{module.exports=factory
}}(this);