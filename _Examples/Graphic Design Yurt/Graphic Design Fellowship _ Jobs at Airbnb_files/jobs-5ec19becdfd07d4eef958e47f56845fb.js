$(document).ready(function(){function parallaxHero(el){var $window=$(window),hasSlideShow=$(".bigSlides").length>0,config={threshold:0,offset_intertia:0.15,top_offset:(0)};
$window.on("scroll",function(){if($.inview(el,{threshold:config.threshold})){if(hasSlideShow){scrollBackground($(".bigSlides li:visible"),$window)
}else{scrollBackground(el,$window)
}}})
}function scrollBackground($el,$window){var x="50%";
var y=$window.scrollTop();
var bpos=x+" "+-(y/2)+"px";
$el.css({backgroundPosition:bpos})
}function showBigImage(el){if(el.hasClass("media-photo")){var _x=921,_y=561
}if($("img",el).attr("data-image")!==undefined){var caption="";
if($("img",el).attr("alt")!==""){caption=$("img",el).attr("alt")
}Airbnb.Utils.initVideoLightbox(el,caption,'<img src="'+$("img",el).attr("data-image")+'" style="display:block;"/>',_x,_y)
}}function slideshow(){var $caption=$('<span class="label label-info"/>'),pos=450;
$(".bigSlides li").each(function(){var image=$("img",this).attr("src");
$(this).css("background","url("+image+") 50% 0 fixed no-repeat");
$caption.html($("img",this).attr("alt")).css({position:"absolute",right:20,top:pos});
if($("img",this).attr("alt")){$caption.clone().appendTo($(this))
}$("img",this).remove()
});
$(".bigSlides li:first-child").show();
setInterval(function(){var $current=$(".bigSlides li:visible"),$next;
if($current.length===0||$current.is(":last-child")){$next=$(".bigSlides li:first-child")
}else{$next=$current.next()
}if($current.is(":last-child")){$next.show();
$current.fadeOut(2000)
}else{$next.fadeIn(2000,function(){$current.hide()
})
}},5000)
}function createJobsNav(){var $navButtons=$(JST["jobs/jobs_nav_items"]({welcome:t("jobs_nav_welcome"),departments:t("jobs_nav_departments"),locations:t("jobs_nav_locations"),life:t("jobs_nav_life"),engineering:t("jobs_nav_engineers")}));
var path=window.location.pathname;
$navButtons.find("a").each(function(index,ele){if($(ele).attr("href")===path){$(ele).parent().addClass("active")
}if($(ele).attr("data-parent")&&path!="/jobs/departments/engineering"){if(~path.indexOf($(ele).attr("href"))){$(ele).parent().addClass("active")
}}});
$(".logged-out, .logged-in, #list-your-space, #header_inner .search, .item_explore").remove();
$(".pull-right").html($navButtons)
}function initIndexPage(){$("#wishlistVideo").click(function(){Airbnb.Utils.initVideoLightbox("#wishlistVideo"," ",'<div style="width:900px; height: 514px;"><iframe id="videoPlayer" width="560" height="315" src="//player.vimeo.com/video/50647652?autoplay=1" frameborder="0"></iframe></div>',940,550)
});
if($(window).width()<500){return
}var $stickyFooter=$("#sticky-footer"),windowHeight=$(window).height(),stickyHeight=$stickyFooter.outerHeight(),windowScrollTop=$(window).scrollTop(),$lowerArea=$("#lowerArea"),config={threshold:-190,offset_intertia:0.35,top_offset:(stickyHeight)};
$(".slide-1").css("height",windowHeight);
function topSticky(){windowScrollTop=$(window).scrollTop();
if(windowScrollTop<($lowerArea.offset().top-windowHeight)){$stickyFooter.css({position:"fixed",bottom:"0",top:"auto"})
}else{$stickyFooter.css({position:"absolute",marginTop:-stickyHeight,bottom:"auto"});
$(window).on("scroll",bottomSticky);
$(window).off("scroll",topSticky)
}}function bottomSticky(){windowScrollTop=$(window).scrollTop();
if(windowScrollTop>=($lowerArea.offset().top-stickyHeight)){$stickyFooter.css({position:"fixed",top:config.top_offset+"px"})
}else{$stickyFooter.css({position:"absolute",marginTop:-stickyHeight,top:"auto",bottom:"auto"});
$(window).on("scroll",topSticky);
$(window).off("scroll",bottomSticky)
}}function loadSticky(){$(window).on("scroll",topSticky)
}setTimeout(loadSticky,1000);
$(".story").each(function(){var $self=$(this),$h1=$("h1",this),h1Height=$h1.outerHeight();
if($self.hasClass("slide-1")){$h1.css("marginTop",(windowHeight/2)-(h1Height/2));
$("#wishlistVideo").css("marginTop",(windowHeight/2)-h1Height-100)
}else{$h1.css("marginTop",(windowHeight/2)-h1Height)
}$(window).bind("scroll",function(){if($.inview($self,{threshold:config.threshold})){scrollStoryBackground($self)
}})
});
function scrollStoryBackground(el){var bgp=el.backgroundPosition().split(" ");
var bpos=bgp[0]+(windowHeight/2.5-($.distancefromfold(el,{threshold:config.threshold}))/2)+"px";
var $h1=$("h1",el);
el.css({"background-position":bpos});
var h1distance=$.distancefromfold($h1,{threshold:config.threshold});
var h1percent;
if(h1distance<(windowHeight/2)){h1percent=(h1distance/(windowHeight/2)).toFixed(2)
}else{h1percent=((windowHeight-h1distance)/(windowHeight/2)).toFixed(2)
}$h1.css("opacity",h1percent)
}jQuery.fn.backgroundPosition=function(){var p=$(this).css("background-position");
if(typeof(p)==="undefined"){return $(this).css("background-position-x")+" "+$(this).css("background-position-y")
}else{return p
}};
function scrollPage(el){var $triggerParent=el.closest(".story");
if($triggerParent.hasClass("last")===false){$.smoothScroll({scrollTarget:$triggerParent.next(".story"),easing:"easeInOutQuad",speed:1000});
return false
}else{if($triggerParent.hasClass("last")){$.smoothScroll({offset:-($("#sticky-footer").outerHeight()),scrollTarget:$("#lowerArea"),easing:"easeInOutQuad",speed:1000});
return false
}}}$(".trigger-area, .container h1").click(function(){scrollPage($(this))
})
}function init(){createJobsNav();
$("table").tablesorter();
if($(".bigSlides").length>0){slideshow()
}$(".media-photo, .insta-img").click(function(){showBigImage($(this))
});
if($("#home-slides").length>0){initIndexPage()
}else{parallaxHero($(".scrollable"))
}var cultureHeight=$("#cultureBucket").height(),cultureContentHeight=$("#cultureBucket .cultureContent").height();
$("#cultureBucket .cultureContent").css({position:"relative",marginTop:cultureHeight/2-cultureContentHeight/2})
}init()
});
(function($){$.distancefromfold=function($element,settings){if(settings.container===undefined||settings.container===window){var fold=$(window).height()+$(window).scrollTop()
}else{var fold=$(settings.container).offset().top+$(settings.container).height()
}return(fold+settings.threshold)-$element.offset().top
};
$.belowthefold=function($element,settings){if(settings.container===undefined||settings.container===window){var fold=$(window).height()+$(window).scrollTop()
}else{var fold=$(settings.container).offset().top+$(settings.container).height()
}return fold<=$element.offset().top-settings.threshold
};
$.abovethetop=function($element,settings){if(settings.container===undefined||settings.container===window){var fold=$(window).scrollTop()
}else{var fold=$(settings.container).offset().top
}return fold>=$element.offset().top+settings.threshold+$element.height()
};
$.inview=function($element,settings){return($.abovethetop($element,settings)!=true&&$.belowthefold($element,settings)!=true)
};
$.extend($.expr[":"],{"below-the-fold":"$.belowthefold(a, {threshold : 0, container: window})","above-the-fold":"!$.belowthefold(a, {threshold : 0, container: window})","right-of-fold":"$.rightoffold(a, {threshold : 0, container: window})","left-of-fold":"!$.rightoffold(a, {threshold : 0, container: window})"})
})(jQuery);
!function($){$(function(){$.support.transition=(function(){var thisBody=document.body||document.documentElement,thisStyle=thisBody.style,support=thisStyle.transition!==undefined||thisStyle.WebkitTransition!==undefined||thisStyle.MozTransition!==undefined||thisStyle.MsTransition!==undefined||thisStyle.OTransition!==undefined;
return support&&{end:(function(){var transitionEnd="TransitionEnd";
if($.browser.webkit){transitionEnd="webkitTransitionEnd"
}else{if($.browser.mozilla){transitionEnd="transitionend"
}else{if($.browser.opera){transitionEnd="oTransitionEnd"
}}}return transitionEnd
}())}
})()
})
}(window.jQuery);
/*! Smooth Scroll - v1.4.6 - 2012-08-23
* Copyright (c) 2012 Karl Swedberg; Licensed MIT, GPL */
(function($){var version="1.4.6",defaults={exclude:[],excludeWithin:[],offset:0,direction:"top",scrollElement:null,scrollTarget:null,beforeScroll:function(){},afterScroll:function(){},easing:"swing",speed:400,autoCoefficent:2},getScrollable=function(opts){var scrollable=[],scrolled=false,dir=opts.dir&&opts.dir=="left"?"scrollLeft":"scrollTop";
this.each(function(){if(this==document||this==window){return
}var el=$(this);
if(el[dir]()>0){scrollable.push(this)
}else{el[dir](1);
scrolled=el[dir]()>0;
if(scrolled){scrollable.push(this)
}el[dir](0)
}});
if(!scrollable.length){this.each(function(index){if(this.nodeName==="BODY"){scrollable=[this]
}})
}if(opts.el==="first"&&scrollable.length>1){scrollable=[scrollable[0]]
}return scrollable
},isTouch="ontouchend" in document;
$.fn.extend({scrollable:function(dir){var scrl=getScrollable.call(this,{dir:dir});
return this.pushStack(scrl)
},firstScrollable:function(dir){var scrl=getScrollable.call(this,{el:"first",dir:dir});
return this.pushStack(scrl)
},smoothScroll:function(options){options=options||{};
var opts=$.extend({},$.fn.smoothScroll.defaults,options),locationPath=$.smoothScroll.filterPath(location.pathname);
this.unbind("click.smoothscroll").bind("click.smoothscroll",function(event){var link=this,$link=$(this),exclude=opts.exclude,excludeWithin=opts.excludeWithin,elCounter=0,ewlCounter=0,include=true,clickOpts={},hostMatch=((location.hostname===link.hostname)||!link.hostname),pathMatch=opts.scrollTarget||($.smoothScroll.filterPath(link.pathname)||locationPath)===locationPath,thisHash=escapeSelector(link.hash);
if(!opts.scrollTarget&&(!hostMatch||!pathMatch||!thisHash)){include=false
}else{while(include&&elCounter<exclude.length){if($link.is(escapeSelector(exclude[elCounter++]))){include=false
}}while(include&&ewlCounter<excludeWithin.length){if($link.closest(excludeWithin[ewlCounter++]).length){include=false
}}}if(include){event.preventDefault();
$.extend(clickOpts,opts,{scrollTarget:opts.scrollTarget||thisHash,link:link});
$.smoothScroll(clickOpts)
}});
return this
}});
$.smoothScroll=function(options,px){var opts,$scroller,scrollTargetOffset,speed,scrollerOffset=0,offPos="offset",scrollDir="scrollTop",aniProps={},aniOpts={},scrollprops=[];
if(typeof options==="number"){opts=$.fn.smoothScroll.defaults;
scrollTargetOffset=options
}else{opts=$.extend({},$.fn.smoothScroll.defaults,options||{});
if(opts.scrollElement){offPos="position";
if(opts.scrollElement.css("position")=="static"){opts.scrollElement.css("position","relative")
}}scrollTargetOffset=px||($(opts.scrollTarget)[offPos]()&&$(opts.scrollTarget)[offPos]()[opts.direction])||0
}opts=$.extend({link:null},opts);
scrollDir=opts.direction=="left"?"scrollLeft":scrollDir;
if(opts.scrollElement){$scroller=opts.scrollElement;
scrollerOffset=$scroller[scrollDir]()
}else{$scroller=$("html, body").firstScrollable()
}aniProps[scrollDir]=scrollTargetOffset+scrollerOffset+opts.offset;
opts.beforeScroll.call($scroller,opts);
speed=opts.speed;
if(speed==="auto"){speed=aniProps[scrollDir]||$scroller.scrollTop();
speed=speed/opts.autoCoefficent
}aniOpts={duration:speed,easing:opts.easing,complete:function(){opts.afterScroll.call(opts.link,opts)
}};
if(opts.step){aniOpts.step=opts.step
}if($scroller.length){$scroller.stop().animate(aniProps,aniOpts)
}else{opts.afterScroll.call(opts.link,opts)
}};
$.smoothScroll.version=version;
$.smoothScroll.filterPath=function(string){return string.replace(/^\//,"").replace(/(index|default).[a-zA-Z]{3,4}$/,"").replace(/\/$/,"")
};
$.fn.smoothScroll.defaults=defaults;
function escapeSelector(str){return str.replace(/(:|\.)/g,"\\$1")
}})(jQuery);
(function(c){function p(){var d,a={height:h.innerHeight,width:h.innerWidth};
if(!a.height&&((d=i.compatMode)||!c.support.boxModel)){d=d==="CSS1Compat"?k:i.body,a={height:d.clientHeight,width:d.clientWidth}
}return a
}var m={},e,a,i=document,h=window,k=i.documentElement,j=c.expando;
c.event.special.inview={add:function(a){m[a.guid+"-"+this[j]]={data:a,$element:c(this)}
},remove:function(a){try{delete m[a.guid+"-"+this[j]]
}catch(c){}}};
c(h).bind("scroll resize",function(){e=a=null
});
setInterval(function(){var d=c(),j,l=0;
c.each(m,function(a,b){var c=b.data.selector,e=b.$element;
d=d.add(c?e.find(c):e)
});
if(j=d.length){e=e||p();
for(a=a||{top:h.pageYOffset||k.scrollTop||i.body.scrollTop,left:h.pageXOffset||k.scrollLeft||i.body.scrollLeft};
l<j;
l++){if(c.contains(k,d[l])){var g=c(d[l]),f={height:g.height(),width:g.width()},b=g.offset(),n=g.data("inview"),o;
if(!a||!e){break
}b.top+f.height>a.top&&b.top<a.top+e.height&&b.left+f.width>a.left&&b.left<a.left+e.width?(o=a.left>b.left?"right":a.left+e.width<b.left+f.width?"left":"both",f=a.top>b.top?"bottom":a.top+e.height<b.top+f.height?"top":"both",b=o+"-"+f,(!n||n!==b)&&g.data("inview",b).trigger("inview",[!0,o,f])):n&&g.data("inview",!1).trigger("inview",[!1])
}}}},250)
})(jQuery);
(function($){$.extend({metadata:{defaults:{type:"class",name:"metadata",cre:/({.*})/,single:"metadata"},setType:function(type,name){this.defaults.type=type;
this.defaults.name=name
},get:function(elem,opts){var settings=$.extend({},this.defaults,opts);
if(!settings.single.length){settings.single="metadata"
}var data=$.data(elem,settings.single);
if(data){return data
}data="{}";
if(settings.type=="class"){var m=settings.cre.exec(elem.className);
if(m){data=m[1]
}}else{if(settings.type=="elem"){if(!elem.getElementsByTagName){return undefined
}var e=elem.getElementsByTagName(settings.name);
if(e.length){data=$.trim(e[0].innerHTML)
}}else{if(elem.getAttribute!=undefined){var attr=elem.getAttribute(settings.name);
if(attr){data=attr
}}}}if(data.indexOf("{")<0){data="{"+data+"}"
}data=eval("("+data+")");
$.data(elem,settings.single,data);
return data
}}});
$.fn.metadata=function(opts){return $.metadata.get(this[0],opts)
}
})(jQuery);
(function($){$.extend({tablesorter:new function(){var parsers=[],widgets=[];
this.defaults={cssHeader:"header",cssAsc:"headerSortUp",cssDesc:"headerSortDown",cssChildRow:"expand-child",sortInitialOrder:"asc",sortMultiSortKey:"shiftKey",sortForce:null,sortAppend:null,sortLocaleCompare:true,textExtraction:"simple",parsers:{},widgets:[],widgetZebra:{css:["even","odd"]},headers:{},widthFixed:false,cancelSelection:true,sortList:[],headerList:[],dateFormat:"us",decimal:"/.|,/g",onRenderHeader:null,selectorHeaders:"thead th",debug:false};
function benchmark(s,d){log(s+","+(new Date().getTime()-d.getTime())+"ms")
}this.benchmark=benchmark;
function log(s){if(typeof console!="undefined"&&typeof console.debug!="undefined"){console.log(s)
}else{alert(s)
}}function buildParserCache(table,$headers){if(table.config.debug){var parsersDebug=""
}if(table.tBodies.length==0){return
}var rows=table.tBodies[0].rows;
if(rows[0]){var list=[],cells=rows[0].cells,l=cells.length;
for(var i=0;
i<l;
i++){var p=false;
if($.metadata&&($($headers[i]).metadata()&&$($headers[i]).metadata().sorter)){p=getParserById($($headers[i]).metadata().sorter)
}else{if((table.config.headers[i]&&table.config.headers[i].sorter)){p=getParserById(table.config.headers[i].sorter)
}}if(!p){p=detectParserForColumn(table,rows,-1,i)
}if(table.config.debug){parsersDebug+="column:"+i+" parser:"+p.id+"\n"
}list.push(p)
}}if(table.config.debug){log(parsersDebug)
}return list
}function detectParserForColumn(table,rows,rowIndex,cellIndex){var l=parsers.length,node=false,nodeValue=false,keepLooking=true;
while(nodeValue==""&&keepLooking){rowIndex++;
if(rows[rowIndex]){node=getNodeFromRowAndCellIndex(rows,rowIndex,cellIndex);
nodeValue=trimAndGetNodeText(table.config,node);
if(table.config.debug){log("Checking if value was empty on row:"+rowIndex)
}}else{keepLooking=false
}}for(var i=1;
i<l;
i++){if(parsers[i].is(nodeValue,table,node)){return parsers[i]
}}return parsers[0]
}function getNodeFromRowAndCellIndex(rows,rowIndex,cellIndex){return rows[rowIndex].cells[cellIndex]
}function trimAndGetNodeText(config,node){return $.trim(getElementText(config,node))
}function getParserById(name){var l=parsers.length;
for(var i=0;
i<l;
i++){if(parsers[i].id.toLowerCase()==name.toLowerCase()){return parsers[i]
}}return false
}function buildCache(table){if(table.config.debug){var cacheTime=new Date()
}var totalRows=(table.tBodies[0]&&table.tBodies[0].rows.length)||0,totalCells=(table.tBodies[0].rows[0]&&table.tBodies[0].rows[0].cells.length)||0,parsers=table.config.parsers,cache={row:[],normalized:[]};
for(var i=0;
i<totalRows;
++i){var c=$(table.tBodies[0].rows[i]),cols=[];
if(c.hasClass(table.config.cssChildRow)){cache.row[cache.row.length-1]=cache.row[cache.row.length-1].add(c);
continue
}cache.row.push(c);
for(var j=0;
j<totalCells;
++j){cols.push(parsers[j].format(getElementText(table.config,c[0].cells[j]),table,c[0].cells[j]))
}cols.push(cache.normalized.length);
cache.normalized.push(cols);
cols=null
}if(table.config.debug){benchmark("Building cache for "+totalRows+" rows:",cacheTime)
}return cache
}function getElementText(config,node){var text="";
if(!node){return""
}if(!config.supportsTextContent){config.supportsTextContent=node.textContent||false
}if(config.textExtraction=="simple"){if(config.supportsTextContent){text=node.textContent
}else{if(node.childNodes[0]&&node.childNodes[0].hasChildNodes()){text=node.childNodes[0].innerHTML
}else{text=node.innerHTML
}}}else{if(typeof(config.textExtraction)=="function"){text=config.textExtraction(node)
}else{text=$(node).text()
}}return text
}function appendToTable(table,cache){if(table.config.debug){var appendTime=new Date()
}var c=cache,r=c.row,n=c.normalized,totalRows=n.length,checkCell=(n[0].length-1),tableBody=$(table.tBodies[0]),rows=[];
for(var i=0;
i<totalRows;
i++){var pos=n[i][checkCell];
rows.push(r[pos]);
if(!table.config.appender){var l=r[pos].length;
for(var j=0;
j<l;
j++){tableBody[0].appendChild(r[pos][j])
}}}if(table.config.appender){table.config.appender(table,rows)
}rows=null;
if(table.config.debug){benchmark("Rebuilt table:",appendTime)
}applyWidget(table);
setTimeout(function(){$(table).trigger("sortEnd")
},0)
}function buildHeaders(table){if(table.config.debug){var time=new Date()
}var meta=($.metadata)?true:false;
var header_index=computeTableHeaderCellIndexes(table);
$tableHeaders=$(table.config.selectorHeaders,table).each(function(index){this.column=header_index[this.parentNode.rowIndex+"-"+this.cellIndex];
this.order=formatSortingOrder(table.config.sortInitialOrder);
this.count=this.order;
if(checkHeaderMetadata(this)||checkHeaderOptions(table,index)){this.sortDisabled=true
}if(checkHeaderOptionsSortingLocked(table,index)){this.order=this.lockedOrder=checkHeaderOptionsSortingLocked(table,index)
}if(!this.sortDisabled){var $th=$(this).addClass(table.config.cssHeader);
if(table.config.onRenderHeader){table.config.onRenderHeader.apply($th)
}}table.config.headerList[index]=this
});
if(table.config.debug){benchmark("Built headers:",time);
log($tableHeaders)
}return $tableHeaders
}function computeTableHeaderCellIndexes(t){var matrix=[];
var lookup={};
var thead=t.getElementsByTagName("THEAD")[0];
var trs=thead.getElementsByTagName("TR");
for(var i=0;
i<trs.length;
i++){var cells=trs[i].cells;
for(var j=0;
j<cells.length;
j++){var c=cells[j];
var rowIndex=c.parentNode.rowIndex;
var cellId=rowIndex+"-"+c.cellIndex;
var rowSpan=c.rowSpan||1;
var colSpan=c.colSpan||1;
var firstAvailCol;
if(typeof(matrix[rowIndex])=="undefined"){matrix[rowIndex]=[]
}for(var k=0;
k<matrix[rowIndex].length+1;
k++){if(typeof(matrix[rowIndex][k])=="undefined"){firstAvailCol=k;
break
}}lookup[cellId]=firstAvailCol;
for(var k=rowIndex;
k<rowIndex+rowSpan;
k++){if(typeof(matrix[k])=="undefined"){matrix[k]=[]
}var matrixrow=matrix[k];
for(var l=firstAvailCol;
l<firstAvailCol+colSpan;
l++){matrixrow[l]="x"
}}}}return lookup
}function checkCellColSpan(table,rows,row){var arr=[],r=table.tHead.rows,c=r[row].cells;
for(var i=0;
i<c.length;
i++){var cell=c[i];
if(cell.colSpan>1){arr=arr.concat(checkCellColSpan(table,headerArr,row++))
}else{if(table.tHead.length==1||(cell.rowSpan>1||!r[row+1])){arr.push(cell)
}}}return arr
}function checkHeaderMetadata(cell){if(($.metadata)&&($(cell).metadata().sorter===false)){return true
}return false
}function checkHeaderOptions(table,i){if((table.config.headers[i])&&(table.config.headers[i].sorter===false)){return true
}return false
}function checkHeaderOptionsSortingLocked(table,i){if((table.config.headers[i])&&(table.config.headers[i].lockedOrder)){return table.config.headers[i].lockedOrder
}return false
}function applyWidget(table){var c=table.config.widgets;
var l=c.length;
for(var i=0;
i<l;
i++){getWidgetById(c[i]).format(table)
}}function getWidgetById(name){var l=widgets.length;
for(var i=0;
i<l;
i++){if(widgets[i].id.toLowerCase()==name.toLowerCase()){return widgets[i]
}}}function formatSortingOrder(v){if(typeof(v)!="Number"){return(v.toLowerCase()=="desc")?1:0
}else{return(v==1)?1:0
}}function isValueInArray(v,a){var l=a.length;
for(var i=0;
i<l;
i++){if(a[i][0]==v){return true
}}return false
}function setHeadersCss(table,$headers,list,css){$headers.removeClass(css[0]).removeClass(css[1]);
var h=[];
$headers.each(function(offset){if(!this.sortDisabled){h[this.column]=$(this)
}});
var l=list.length;
for(var i=0;
i<l;
i++){h[list[i][0]].addClass(css[list[i][1]])
}}function fixColumnWidth(table,$headers){var c=table.config;
if(c.widthFixed){var colgroup=$("<colgroup>");
$("tr:first td",table.tBodies[0]).each(function(){colgroup.append($("<col>").css("width",$(this).width()))
});
$(table).prepend(colgroup)
}}function updateHeaderSortCount(table,sortList){var c=table.config,l=sortList.length;
for(var i=0;
i<l;
i++){var s=sortList[i],o=c.headerList[s[0]];
o.count=s[1];
o.count++
}}function multisort(table,sortList,cache){if(table.config.debug){var sortTime=new Date()
}var dynamicExp="var sortWrapper = function(a,b) {",l=sortList.length;
for(var i=0;
i<l;
i++){var c=sortList[i][0];
var order=sortList[i][1];
var s=(table.config.parsers[c].type=="text")?((order==0)?makeSortFunction("text","asc",c):makeSortFunction("text","desc",c)):((order==0)?makeSortFunction("numeric","asc",c):makeSortFunction("numeric","desc",c));
var e="e"+i;
dynamicExp+="var "+e+" = "+s;
dynamicExp+="if("+e+") { return "+e+"; } ";
dynamicExp+="else { "
}var orgOrderCol=cache.normalized[0].length-1;
dynamicExp+="return a["+orgOrderCol+"]-b["+orgOrderCol+"];";
for(var i=0;
i<l;
i++){dynamicExp+="}; "
}dynamicExp+="return 0; ";
dynamicExp+="}; ";
if(table.config.debug){benchmark("Evaling expression:"+dynamicExp,new Date())
}eval(dynamicExp);
cache.normalized.sort(sortWrapper);
if(table.config.debug){benchmark("Sorting on "+sortList.toString()+" and dir "+order+" time:",sortTime)
}return cache
}function makeSortFunction(type,direction,index){var a="a["+index+"]",b="b["+index+"]";
if(type=="text"&&direction=="asc"){return"("+a+" == "+b+" ? 0 : ("+a+" === null ? Number.POSITIVE_INFINITY : ("+b+" === null ? Number.NEGATIVE_INFINITY : ("+a+" < "+b+") ? -1 : 1 )));"
}else{if(type=="text"&&direction=="desc"){return"("+a+" == "+b+" ? 0 : ("+a+" === null ? Number.POSITIVE_INFINITY : ("+b+" === null ? Number.NEGATIVE_INFINITY : ("+b+" < "+a+") ? -1 : 1 )));"
}else{if(type=="numeric"&&direction=="asc"){return"("+a+" === null && "+b+" === null) ? 0 :("+a+" === null ? Number.POSITIVE_INFINITY : ("+b+" === null ? Number.NEGATIVE_INFINITY : "+a+" - "+b+"));"
}else{if(type=="numeric"&&direction=="desc"){return"("+a+" === null && "+b+" === null) ? 0 :("+a+" === null ? Number.POSITIVE_INFINITY : ("+b+" === null ? Number.NEGATIVE_INFINITY : "+b+" - "+a+"));"
}}}}}function makeSortText(i){return"((a["+i+"] < b["+i+"]) ? -1 : ((a["+i+"] > b["+i+"]) ? 1 : 0));"
}function makeSortTextDesc(i){return"((b["+i+"] < a["+i+"]) ? -1 : ((b["+i+"] > a["+i+"]) ? 1 : 0));"
}function makeSortNumeric(i){return"a["+i+"]-b["+i+"];"
}function makeSortNumericDesc(i){return"b["+i+"]-a["+i+"];"
}function sortText(a,b){if(table.config.sortLocaleCompare){return a.localeCompare(b)
}return((a<b)?-1:((a>b)?1:0))
}function sortTextDesc(a,b){if(table.config.sortLocaleCompare){return b.localeCompare(a)
}return((b<a)?-1:((b>a)?1:0))
}function sortNumeric(a,b){return a-b
}function sortNumericDesc(a,b){return b-a
}function getCachedSortType(parsers,i){return parsers[i].type
}this.construct=function(settings){return this.each(function(){if(!this.tHead||!this.tBodies){return
}var $this,$document,$headers,cache,config,shiftDown=0,sortOrder;
this.config={};
config=$.extend(this.config,$.tablesorter.defaults,settings);
$this=$(this);
$.data(this,"tablesorter",config);
$headers=buildHeaders(this);
this.config.parsers=buildParserCache(this,$headers);
cache=buildCache(this);
var sortCSS=[config.cssDesc,config.cssAsc];
fixColumnWidth(this);
$headers.click(function(e){var totalRows=($this[0].tBodies[0]&&$this[0].tBodies[0].rows.length)||0;
if(!this.sortDisabled&&totalRows>0){$this.trigger("sortStart");
var $cell=$(this);
var i=this.column;
this.order=this.count++%2;
if(this.lockedOrder){this.order=this.lockedOrder
}if(!e[config.sortMultiSortKey]){config.sortList=[];
if(config.sortForce!=null){var a=config.sortForce;
for(var j=0;
j<a.length;
j++){if(a[j][0]!=i){config.sortList.push(a[j])
}}}config.sortList.push([i,this.order])
}else{if(isValueInArray(i,config.sortList)){for(var j=0;
j<config.sortList.length;
j++){var s=config.sortList[j],o=config.headerList[s[0]];
if(s[0]==i){o.count=s[1];
o.count++;
s[1]=o.count%2
}}}else{config.sortList.push([i,this.order])
}}setTimeout(function(){setHeadersCss($this[0],$headers,config.sortList,sortCSS);
appendToTable($this[0],multisort($this[0],config.sortList,cache))
},1);
return false
}}).mousedown(function(){if(config.cancelSelection){this.onselectstart=function(){return false
};
return false
}});
$this.bind("update",function(){var me=this;
setTimeout(function(){me.config.parsers=buildParserCache(me,$headers);
cache=buildCache(me)
},1)
}).bind("updateCell",function(e,cell){var config=this.config;
var pos=[(cell.parentNode.rowIndex-1),cell.cellIndex];
cache.normalized[pos[0]][pos[1]]=config.parsers[pos[1]].format(getElementText(config,cell),cell)
}).bind("sorton",function(e,list){$(this).trigger("sortStart");
config.sortList=list;
var sortList=config.sortList;
updateHeaderSortCount(this,sortList);
setHeadersCss(this,$headers,sortList,sortCSS);
appendToTable(this,multisort(this,sortList,cache))
}).bind("appendCache",function(){appendToTable(this,cache)
}).bind("applyWidgetId",function(e,id){getWidgetById(id).format(this)
}).bind("applyWidgets",function(){applyWidget(this)
});
if($.metadata&&($(this).metadata()&&$(this).metadata().sortlist)){config.sortList=$(this).metadata().sortlist
}if(config.sortList.length>0){$this.trigger("sorton",[config.sortList])
}applyWidget(this)
})
};
this.addParser=function(parser){var l=parsers.length,a=true;
for(var i=0;
i<l;
i++){if(parsers[i].id.toLowerCase()==parser.id.toLowerCase()){a=false
}}if(a){parsers.push(parser)
}};
this.addWidget=function(widget){widgets.push(widget)
};
this.formatFloat=function(s){var i=parseFloat(s);
return(isNaN(i))?0:i
};
this.formatInt=function(s){var i=parseInt(s);
return(isNaN(i))?0:i
};
this.isDigit=function(s,config){return/^[-+]?\d*$/.test($.trim(s.replace(/[,.']/g,"")))
};
this.clearTableBody=function(table){if($.browser.msie){function empty(){while(this.firstChild){this.removeChild(this.firstChild)
}}empty.apply(table.tBodies[0])
}else{table.tBodies[0].innerHTML=""
}}
}});
$.fn.extend({tablesorter:$.tablesorter.construct});
var ts=$.tablesorter;
ts.addParser({id:"text",is:function(s){return true
},format:function(s){return $.trim(s.toLocaleLowerCase())
},type:"text"});
ts.addParser({id:"digit",is:function(s,table){var c=table.config;
return $.tablesorter.isDigit(s,c)
},format:function(s){return $.tablesorter.formatFloat(s)
},type:"numeric"});
ts.addParser({id:"currency",is:function(s){return/^[£$€?.]/.test(s)
},format:function(s){return $.tablesorter.formatFloat(s.replace(new RegExp(/[£$€]/g),""))
},type:"numeric"});
ts.addParser({id:"ipAddress",is:function(s){return/^\d{2,3}[\.]\d{2,3}[\.]\d{2,3}[\.]\d{2,3}$/.test(s)
},format:function(s){var a=s.split("."),r="",l=a.length;
for(var i=0;
i<l;
i++){var item=a[i];
if(item.length==2){r+="0"+item
}else{r+=item
}}return $.tablesorter.formatFloat(r)
},type:"numeric"});
ts.addParser({id:"url",is:function(s){return/^(https?|ftp|file):\/\/$/.test(s)
},format:function(s){return jQuery.trim(s.replace(new RegExp(/(https?|ftp|file):\/\//),""))
},type:"text"});
ts.addParser({id:"isoDate",is:function(s){return/^\d{4}[\/-]\d{1,2}[\/-]\d{1,2}$/.test(s)
},format:function(s){return $.tablesorter.formatFloat((s!="")?new Date(s.replace(new RegExp(/-/g),"/")).getTime():"0")
},type:"numeric"});
ts.addParser({id:"percent",is:function(s){return/\%$/.test($.trim(s))
},format:function(s){return $.tablesorter.formatFloat(s.replace(new RegExp(/%/g),""))
},type:"numeric"});
ts.addParser({id:"usLongDate",is:function(s){return s.match(new RegExp(/^[A-Za-z]{3,10}\.? [0-9]{1,2}, ([0-9]{4}|'?[0-9]{2}) (([0-2]?[0-9]:[0-5][0-9])|([0-1]?[0-9]:[0-5][0-9]\s(AM|PM)))$/))
},format:function(s){return $.tablesorter.formatFloat(new Date(s).getTime())
},type:"numeric"});
ts.addParser({id:"shortDate",is:function(s){return/\d{1,2}[\/\-]\d{1,2}[\/\-]\d{2,4}/.test(s)
},format:function(s,table){var c=table.config;
s=s.replace(/\-/g,"/");
if(c.dateFormat=="us"){s=s.replace(/(\d{1,2})[\/\-](\d{1,2})[\/\-](\d{4})/,"$3/$1/$2")
}else{if(c.dateFormat=="uk"){s=s.replace(/(\d{1,2})[\/\-](\d{1,2})[\/\-](\d{4})/,"$3/$2/$1")
}else{if(c.dateFormat=="dd/mm/yy"||c.dateFormat=="dd-mm-yy"){s=s.replace(/(\d{1,2})[\/\-](\d{1,2})[\/\-](\d{2})/,"$1/$2/$3")
}}}return $.tablesorter.formatFloat(new Date(s).getTime())
},type:"numeric"});
ts.addParser({id:"time",is:function(s){return/^(([0-2]?[0-9]:[0-5][0-9])|([0-1]?[0-9]:[0-5][0-9]\s(am|pm)))$/.test(s)
},format:function(s){return $.tablesorter.formatFloat(new Date("2000/01/01 "+s).getTime())
},type:"numeric"});
ts.addParser({id:"metadata",is:function(s){return false
},format:function(s,table,cell){var c=table.config,p=(!c.parserMetadataName)?"sortValue":c.parserMetadataName;
return $(cell).metadata()[p]
},type:"numeric"});
ts.addWidget({id:"zebra",format:function(table){if(table.config.debug){var time=new Date()
}var $tr,row=-1,odd;
$("tr:visible",table.tBodies[0]).each(function(i){$tr=$(this);
if(!$tr.hasClass(table.config.cssChildRow)){row++
}odd=(row%2==0);
$tr.removeClass(table.config.widgetZebra.css[odd?0:1]).addClass(table.config.widgetZebra.css[odd?1:0])
});
if(table.config.debug){$.tablesorter.benchmark("Applying Zebra widget",time)
}}})
})(jQuery);
!function($){var Carousel=function(element,options){this.$element=$(element);
this.options=$.extend({},$.fn.carousel.defaults,options);
this.options.slide&&this.slide(this.options.slide);
this.options.pause=="hover"&&this.$element.on("mouseenter",$.proxy(this.pause,this)).on("mouseleave",$.proxy(this.cycle,this))
};
Carousel.prototype={cycle:function(){if(this.options.auto){}return this
},to:function(pos){var $active=this.$element.find(".active"),children=$active.parent().children(),activePos=children.index($active),that=this;
if(pos>(children.length-1)||pos<0){return
}if(this.sliding){return this.$element.one("slid",function(){that.to(pos)
})
}if(activePos==pos){return this.pause().cycle()
}return this.slide(pos>activePos?"next":"prev",$(children[pos]))
},pause:function(){clearInterval(this.interval);
this.interval=null;
return this
},next:function(){if(this.sliding){return
}return this.slide("next")
},prev:function(){if(this.sliding){return
}return this.slide("prev")
},slide:function(type,next){var $active=this.$element.find(".active"),$next=next||$active[type](),isCycling=this.interval,direction=type=="next"?"left":"right",fallback=type=="next"?"first":"last",that=this;
this.sliding=true;
isCycling&&this.pause();
$next=$next.length?$next:this.$element.find(".item")[fallback]();
if($next.hasClass("active")){return
}if(!$.support.transition&&this.$element.hasClass("slide")){this.$element.trigger("slide");
$active.removeClass("active");
$next.addClass("active");
this.sliding=false;
this.$element.trigger("slid")
}else{$next.addClass(type);
$next[0].offsetWidth;
$active.addClass(direction);
$next.addClass(direction);
this.$element.trigger("slide");
this.$element.one($.support.transition.end,function(){$next.removeClass([type,direction].join(" ")).addClass("active");
$active.removeClass(["active",direction].join(" "));
that.sliding=false;
setTimeout(function(){that.$element.trigger("slid")
},0)
})
}isCycling&&this.cycle();
return this
}};
$.fn.carousel=function(option){return this.each(function(){var $this=$(this),data=$this.data("carousel"),options=typeof option=="object"&&option;
if(!data){$this.data("carousel",(data=new Carousel(this,options)))
}if(typeof option=="number"){data.to(option)
}else{if(typeof option=="string"||(option=options.slide)){data[option]()
}else{data.cycle()
}}})
};
$.fn.carousel.defaults={interval:5000,pause:"hover",auto:true};
$.fn.carousel.Constructor=Carousel;
$(function(){$("body").on("click.carousel.data-api","[data-slide]",function(e){var $this=$(this),href,$target=$($this.attr("data-target")||(href=$this.attr("href"))&&href.replace(/.*(?=#[^\s]+$)/,"")),options=!$target.data("modal")&&$.extend({},$target.data(),$this.data());
$target.carousel(options);
e.preventDefault()
})
})
}(window.jQuery);
(function(d){var k=d.scrollTo=function(a,i,e){d(window).scrollTo(a,i,e)
};
k.defaults={axis:"xy",duration:parseFloat(d.fn.jquery)>=1.3?0:1};
k.window=function(a){return d(window)._scrollable()
};
d.fn._scrollable=function(){return this.map(function(){var a=this,i=!a.nodeName||d.inArray(a.nodeName.toLowerCase(),["iframe","#document","html","body"])!=-1;
if(!i){return a
}var e=(a.contentWindow||a).document||a.ownerDocument||a;
return d.browser.safari||e.compatMode=="BackCompat"?e.body:e.documentElement
})
};
d.fn.scrollTo=function(n,j,b){if(typeof j=="object"){b=j;
j=0
}if(typeof b=="function"){b={onAfter:b}
}if(n=="max"){n=9000000000
}b=d.extend({},k.defaults,b);
j=j||b.speed||b.duration;
b.queue=b.queue&&b.axis.length>1;
if(b.queue){j/=2
}b.offset=p(b.offset);
b.over=p(b.over);
return this._scrollable().each(function(){var q=this,r=d(q),f=n,s,g={},u=r.is("html,body");
switch(typeof f){case"number":case"string":if(/^([+-]=)?\d+(\.\d+)?(px|%)?$/.test(f)){f=p(f);
break
}f=d(f,this);
case"object":if(f.is||f.style){s=(f=d(f)).offset()
}}d.each(b.axis.split(""),function(a,i){var e=i=="x"?"Left":"Top",h=e.toLowerCase(),c="scroll"+e,l=q[c],m=k.max(q,i);
if(s){g[c]=s[h]+(u?0:l-r.offset()[h]);
if(b.margin){g[c]-=parseInt(f.css("margin"+e))||0;
g[c]-=parseInt(f.css("border"+e+"Width"))||0
}g[c]+=b.offset[h]||0;
if(b.over[h]){g[c]+=f[i=="x"?"width":"height"]()*b.over[h]
}}else{var o=f[h];
g[c]=o.slice&&o.slice(-1)=="%"?parseFloat(o)/100*m:o
}if(/^\d+$/.test(g[c])){g[c]=g[c]<=0?0:Math.min(g[c],m)
}if(!a&&b.queue){if(l!=g[c]){t(b.onAfterFirst)
}delete g[c]
}});
t(b.onAfter);
function t(a){r.animate(g,j,b.easing,a&&function(){a.call(this,n,b)
})
}}).end()
};
k.max=function(a,i){var e=i=="x"?"Width":"Height",h="scroll"+e;
if(!d(a).is("html,body")){return a[h]-d(a)[e.toLowerCase()]()
}var c="client"+e,l=a.ownerDocument.documentElement,m=a.ownerDocument.body;
return Math.max(l[h],m[h])-Math.min(l[c],m[c])
};
function p(a){return typeof a=="object"?a:{top:a,left:a}
}})(jQuery);
jQuery.easing.jswing=jQuery.easing.swing;
jQuery.extend(jQuery.easing,{def:"easeOutQuad",swing:function(x,t,b,c,d){return jQuery.easing[jQuery.easing.def](x,t,b,c,d)
},easeInQuad:function(x,t,b,c,d){return c*(t/=d)*t+b
},easeOutQuad:function(x,t,b,c,d){return -c*(t/=d)*(t-2)+b
},easeInOutQuad:function(x,t,b,c,d){if((t/=d/2)<1){return c/2*t*t+b
}return -c/2*((--t)*(t-2)-1)+b
},easeInCubic:function(x,t,b,c,d){return c*(t/=d)*t*t+b
},easeOutCubic:function(x,t,b,c,d){return c*((t=t/d-1)*t*t+1)+b
},easeInOutCubic:function(x,t,b,c,d){if((t/=d/2)<1){return c/2*t*t*t+b
}return c/2*((t-=2)*t*t+2)+b
},easeInQuart:function(x,t,b,c,d){return c*(t/=d)*t*t*t+b
},easeOutQuart:function(x,t,b,c,d){return -c*((t=t/d-1)*t*t*t-1)+b
},easeInOutQuart:function(x,t,b,c,d){if((t/=d/2)<1){return c/2*t*t*t*t+b
}return -c/2*((t-=2)*t*t*t-2)+b
},easeInQuint:function(x,t,b,c,d){return c*(t/=d)*t*t*t*t+b
},easeOutQuint:function(x,t,b,c,d){return c*((t=t/d-1)*t*t*t*t+1)+b
},easeInOutQuint:function(x,t,b,c,d){if((t/=d/2)<1){return c/2*t*t*t*t*t+b
}return c/2*((t-=2)*t*t*t*t+2)+b
},easeInSine:function(x,t,b,c,d){return -c*Math.cos(t/d*(Math.PI/2))+c+b
},easeOutSine:function(x,t,b,c,d){return c*Math.sin(t/d*(Math.PI/2))+b
},easeInOutSine:function(x,t,b,c,d){return -c/2*(Math.cos(Math.PI*t/d)-1)+b
},easeInExpo:function(x,t,b,c,d){return(t==0)?b:c*Math.pow(2,10*(t/d-1))+b
},easeOutExpo:function(x,t,b,c,d){return(t==d)?b+c:c*(-Math.pow(2,-10*t/d)+1)+b
},easeInOutExpo:function(x,t,b,c,d){if(t==0){return b
}if(t==d){return b+c
}if((t/=d/2)<1){return c/2*Math.pow(2,10*(t-1))+b
}return c/2*(-Math.pow(2,-10*--t)+2)+b
},easeInCirc:function(x,t,b,c,d){return -c*(Math.sqrt(1-(t/=d)*t)-1)+b
},easeOutCirc:function(x,t,b,c,d){return c*Math.sqrt(1-(t=t/d-1)*t)+b
},easeInOutCirc:function(x,t,b,c,d){if((t/=d/2)<1){return -c/2*(Math.sqrt(1-t*t)-1)+b
}return c/2*(Math.sqrt(1-(t-=2)*t)+1)+b
},easeInElastic:function(x,t,b,c,d){var s=1.70158;
var p=0;
var a=c;
if(t==0){return b
}if((t/=d)==1){return b+c
}if(!p){p=d*0.3
}if(a<Math.abs(c)){a=c;
var s=p/4
}else{var s=p/(2*Math.PI)*Math.asin(c/a)
}return -(a*Math.pow(2,10*(t-=1))*Math.sin((t*d-s)*(2*Math.PI)/p))+b
},easeOutElastic:function(x,t,b,c,d){var s=1.70158;
var p=0;
var a=c;
if(t==0){return b
}if((t/=d)==1){return b+c
}if(!p){p=d*0.3
}if(a<Math.abs(c)){a=c;
var s=p/4
}else{var s=p/(2*Math.PI)*Math.asin(c/a)
}return a*Math.pow(2,-10*t)*Math.sin((t*d-s)*(2*Math.PI)/p)+c+b
},easeInOutElastic:function(x,t,b,c,d){var s=1.70158;
var p=0;
var a=c;
if(t==0){return b
}if((t/=d/2)==2){return b+c
}if(!p){p=d*(0.3*1.5)
}if(a<Math.abs(c)){a=c;
var s=p/4
}else{var s=p/(2*Math.PI)*Math.asin(c/a)
}if(t<1){return -0.5*(a*Math.pow(2,10*(t-=1))*Math.sin((t*d-s)*(2*Math.PI)/p))+b
}return a*Math.pow(2,-10*(t-=1))*Math.sin((t*d-s)*(2*Math.PI)/p)*0.5+c+b
},easeInBack:function(x,t,b,c,d,s){if(s==undefined){s=1.70158
}return c*(t/=d)*t*((s+1)*t-s)+b
},easeOutBack:function(x,t,b,c,d,s){if(s==undefined){s=1.70158
}return c*((t=t/d-1)*t*((s+1)*t+s)+1)+b
},easeInOutBack:function(x,t,b,c,d,s){if(s==undefined){s=1.70158
}if((t/=d/2)<1){return c/2*(t*t*(((s*=(1.525))+1)*t-s))+b
}return c/2*((t-=2)*t*(((s*=(1.525))+1)*t+s)+2)+b
},easeInBounce:function(x,t,b,c,d){return c-jQuery.easing.easeOutBounce(x,d-t,0,c,d)+b
},easeOutBounce:function(x,t,b,c,d){if((t/=d)<(1/2.75)){return c*(7.5625*t*t)+b
}else{if(t<(2/2.75)){return c*(7.5625*(t-=(1.5/2.75))*t+0.75)+b
}else{if(t<(2.5/2.75)){return c*(7.5625*(t-=(2.25/2.75))*t+0.9375)+b
}else{return c*(7.5625*(t-=(2.625/2.75))*t+0.984375)+b
}}}},easeInOutBounce:function(x,t,b,c,d){if(t<d/2){return jQuery.easing.easeInBounce(x,t*2,0,c,d)*0.5+b
}return jQuery.easing.easeOutBounce(x,t*2-d,0,c,d)*0.5+c*0.5+b
}});
/*! Copyright (c) 2011 Brandon Aaron (http://brandonaaron.net)
 * Licensed under the MIT License (LICENSE.txt).
 *
 * Thanks to: http://adomas.org/javascript-mouse-wheel/ for some pointers.
 * Thanks to: Mathias Bank(http://www.mathias-bank.de) for a scope bug fix.
 * Thanks to: Seamus Leahy for adding deltaX and deltaY
 *
 * Version: 3.0.6
 * 
 * Requires: 1.2.2+
 */
(function($){var types=["DOMMouseScroll","mousewheel"];
if($.event.fixHooks){for(var i=types.length;
i;
){$.event.fixHooks[types[--i]]=$.event.mouseHooks
}}$.event.special.mousewheel={setup:function(){if(this.addEventListener){for(var i=types.length;
i;
){this.addEventListener(types[--i],handler,false)
}}else{this.onmousewheel=handler
}},teardown:function(){if(this.removeEventListener){for(var i=types.length;
i;
){this.removeEventListener(types[--i],handler,false)
}}else{this.onmousewheel=null
}}};
$.fn.extend({mousewheel:function(fn){return fn?this.bind("mousewheel",fn):this.trigger("mousewheel")
},unmousewheel:function(fn){return this.unbind("mousewheel",fn)
}});
function handler(event){var orgEvent=event||window.event,args=[].slice.call(arguments,1),delta=0,returnValue=true,deltaX=0,deltaY=0;
event=$.event.fix(orgEvent);
event.type="mousewheel";
if(orgEvent.wheelDelta){delta=orgEvent.wheelDelta/120
}if(orgEvent.detail){delta=-orgEvent.detail/3
}deltaY=delta;
if(orgEvent.axis!==undefined&&orgEvent.axis===orgEvent.HORIZONTAL_AXIS){deltaY=0;
deltaX=-1*delta
}if(orgEvent.wheelDeltaY!==undefined){deltaY=orgEvent.wheelDeltaY/120
}if(orgEvent.wheelDeltaX!==undefined){deltaX=-1*orgEvent.wheelDeltaX/120
}args.unshift(event,delta,deltaX,deltaY);
return($.event.dispatch||$.event.handle).apply(this,args)
}})(jQuery);
(function(){this.JST||(this.JST={});
this.JST["jobs/jobs_nav_items"]=(function(){this.JST||(this.JST={});
this.JST["jobs/jobs_nav_items"]=Handlebars.template(function(Handlebars,depth0,helpers,partials,data){this.compilerInfo=[2,">= 1.0.0-rc.3"];
helpers=helpers||Handlebars.helpers;
data=data||{};
var buffer="",stack1,functionType="function",escapeExpression=this.escapeExpression;
buffer+='<li><a href="/jobs">';
if(stack1=helpers.welcome){stack1=stack1.call(depth0,{hash:{},data:data})
}else{stack1=depth0.welcome;
stack1=typeof stack1===functionType?stack1.apply(depth0):stack1
}buffer+=escapeExpression(stack1)+'</a></li>\n<li class="divider-vertical"></li>\n<li><a href="/jobs/departments" data-parent="true">';
if(stack1=helpers.departments){stack1=stack1.call(depth0,{hash:{},data:data})
}else{stack1=depth0.departments;
stack1=typeof stack1===functionType?stack1.apply(depth0):stack1
}buffer+=escapeExpression(stack1)+'</a></li>\n<li class="divider-vertical"></li>\n<li><a href="/jobs/locations" data-parent="true">';
if(stack1=helpers.locations){stack1=stack1.call(depth0,{hash:{},data:data})
}else{stack1=depth0.locations;
stack1=typeof stack1===functionType?stack1.apply(depth0):stack1
}buffer+=escapeExpression(stack1)+'</a></li>\n<li class="divider-vertical"></li>\n<li><a href="/jobs/life">';
if(stack1=helpers.life){stack1=stack1.call(depth0,{hash:{},data:data})
}else{stack1=depth0.life;
stack1=typeof stack1===functionType?stack1.apply(depth0):stack1
}buffer+=escapeExpression(stack1)+'</a></li>\n<li class="divider-vertical"></li>\n<li><a href="/jobs/departments/engineering">';
if(stack1=helpers.engineering){stack1=stack1.call(depth0,{hash:{},data:data})
}else{stack1=depth0.engineering;
stack1=typeof stack1===functionType?stack1.apply(depth0):stack1
}buffer+=escapeExpression(stack1)+"</a></li>\n";
return buffer
});
return this.JST["jobs/jobs_nav_items"]
}).call(this)
}).call(this);