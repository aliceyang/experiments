!function(window,document){var Airbnb=window.Airbnb||{};
function readCookie(name){var match=new RegExp("("+name+")=([^;]*)").exec(document.cookie);
if(!match){return""
}return decodeURIComponent(match[2]).replace(/\+/g," ")
}Airbnb.initUserAttributes=function(){var userAttributes,id,FLAGS=window.userAttributeCookies.flags,ROLES=window.userAttributeCookies.roles;
try{Airbnb.userAttributes=userAttributes=JSON.parse(readCookie("_user_attributes"))||{}
}catch(e){Airbnb.userAttributes=userAttributes={}
}function copyAttributes(flagset,cookie){var cookieVal;
cookie=readCookie(cookie);
cookieVal=cookie===""?0:parseInt(cookie,10);
for(var flagName in flagset){if(flagset.hasOwnProperty(flagName)){userAttributes[flagName]=(flagset[flagName]&cookie)!==0
}}}copyAttributes(FLAGS,window.userAttributeCookies.flags_name);
copyAttributes(ROLES,window.userAttributeCookies.roles_name);
csrfMetaTags()
};
function csrfMetaTags(){var csrfTokenMetaTag=document.getElementById("csrf-token-meta-tag"),csrfToken=readCookie("_csrf_token");
if(csrfTokenMetaTag!=null){csrfTokenMetaTag.setAttribute("content",csrfToken)
}else{var newCsrfTokenMeta=document.createElement("meta");
newCsrfTokenMeta.name="csrf-token";
newCsrfTokenMeta.id="csrf-token-meta-tag";
newCsrfTokenMeta.content=csrfToken;
document.getElementsByTagName("head")[0].appendChild(newCsrfTokenMeta);
var csrfParamMetaTag=document.getElementById("csrf-param-meta-tag");
if(csrfParamMetaTag==null){var newCsrfParamMeta=document.createElement("meta");
newCsrfParamMeta.name="csrf-param";
newCsrfParamMeta.id="csrf-param-meta-tag";
newCsrfParamMeta.content="authenticity_token";
document.getElementsByTagName("head")[0].appendChild(newCsrfParamMeta)
}}}Airbnb.initUserAttributes();
window.Airbnb=Airbnb
}(window,document);
/*!
 * JS Cookie Plugin
 * https://github.com/carhartl/jquery-cookie
 *
 * Copyright 2011, Klaus Hartl
 * Dual licensed under the MIT or GPL Version 2 licenses.
 * http://www.opensource.org/licenses/mit-license.php
 * http://www.opensource.org/licenses/GPL-2.0
 */
!function(window,document){window.JSCookie={cookie:function(key,value,options){if(arguments.length>1&&(!/Object/.test(Object.prototype.toString.call(value))||value===null||value===undefined)){options=JSON.parse(JSON.stringify(options||{}));
if(value===null||value===undefined){options.expires=-1
}if(typeof options.expires==="number"){var days=options.expires,t=options.expires=new Date();
t.setDate(t.getDate()+days)
}value=String(value);
return(document.cookie=[encodeURIComponent(key),"=",options.raw?value:encodeURIComponent(value),options.expires?"; expires="+options.expires.toUTCString():"",options.path?"; path="+options.path:"",options.domain?"; domain="+options.domain:"",options.secure?"; secure":""].join(""))
}options=value||{};
var decode=options.raw?function(s){return s
}:decodeURIComponent;
var encode=options.raw?function(s){return s
}:encodeURIComponent;
var cookies=document.cookie?document.cookie.split("; "):[];
for(var i=0,l=cookies.length;
i<l;
i++){var parts=cookies[i].split("="),name=decode(parts[0]);
if(key&&key===name){return decode(parts[1]||"")
}}return null
}}
}(window,document);
!function(exports,document){var J=function(el){if(typeof el==="string"){return new J.fn.init(document.querySelectorAll(el))
}return new J.fn.init(el)
};
J.fn=J.prototype={constructor:J,init:function(el){if(!el){this._el=[]
}else{this._el=el instanceof NodeList?el:[el]
}return this
},each:function(handler){var curr;
for(var i=0,length=this._el.length;
i<length;
i++){if(this._el[i] instanceof NodeList){this.each(this._el[i],handler)
}else{handler(i,this._el[i])
}}return this
},attr:function(name,value){return this.each(function(i,el){el.setAttribute(name,value)
})
},show:function(){return this.each(function(i,el){el.setAttribute("style","display: block")
})
},hide:function(){return this.each(function(i,el){el.setAttribute("style","display: none")
})
},addClass:function(newClass){return this.each(function(i,el){var classes=el.className.split(/\s+/);
classes.push(newClass);
el.className=classes.join(" ")
})
},text:function(text){return this.each(function(i,el){el.innerText=text
})
}};
J.fn.init.prototype=J.fn;
exports.J=J
}(window,document);
!function(exports){var HeaderPreload=function(){var self=this;
this.el=document.getElementById("header");
this.userAttributes=Airbnb.userAttributes;
this.personalize()
};
HeaderPreload.prototype.personalize=function(){if(Airbnb.userAttributes.name){J(this.el).addClass("logged_in")
}if(Airbnb.userAttributes){var ua=Airbnb.userAttributes;
if(ua.name){this.name(Airbnb.userAttributes.name)
}if(ua.curr){this.curr(Airbnb.userAttributes.curr)
}if(ua.num_h){this.hosting_count(Airbnb.userAttributes.num_h)
}if(ua.num_msg){this.unread_message_count(Airbnb.userAttributes.num_msg)
}}};
HeaderPreload.prototype.name=function(name){J(this.el.querySelectorAll(".value_name")).text(name)
};
HeaderPreload.prototype.curr=function(curr){J(this.el.querySelectorAll(".value_currency")).text(curr);
J(document.getElementById("currency_header_icon")).addClass(curr)
};
HeaderPreload.prototype.hosting_count=function(count){count=parseInt(count,10);
var el=this.el.querySelector(".header-dropdown .listings");
var $el=J(el);
if(count===0){$el.hide()
}else{if(el&&count===1){J(el.querySelectorAll(".singular")).show();
J(el.querySelectorAll(".plural")).hide()
}}};
HeaderPreload.prototype.unread_message_count=function(count){if(count>0){J(this.el.querySelector(".unread_count, .alert-count")).show().addClass("in").text(count)
}};
exports.HeaderPreload=HeaderPreload
}(window);