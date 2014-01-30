/*

jQuery imgLoadingEvents
par Gildas P. / www.gildasp.fr

infos, tuto, démos sur 
http://playingwithpixels.gildasp.fr/?p=344
http://www.gildasp.fr/exp/easydrag/

*/
(function(e){e.fn.imgPreloadLoop=function(t){imageCount=0;this.cible.each(function(){if(e(this).get(0).complete){imageCount++}});if(imageCount>=t){clearInterval(this.imgPreloadTimer);this.trigger("onImgLoaded",{loaded:imageCount,total:t,target:this});this.unbind("onImgProgress");this.unbind("onImgLoaded")}else{this.trigger("onImgProgress",{loaded:imageCount,total:t,target:this})}};e.fn.imgPreload=function(t){if(typeof t=="function"){t={end:t}}t=e.extend({start:function(){},progress:function(){},end:function(){}},t);this.cible=this.find("img").add(this.filter("img"));this.nbImg=this.cible.length;this.unbind("onImgLoadStart onImgProgress onImgLoaded");this.bind("onImgLoadStart",function(e,n){t.start(e,n);n.target.unbind("onImgLoadStart")});if(this.nbImg>0){this.cible.trigger("onImgLoadStart",{loaded:0,total:this.nbImg,target:this});this.bind("onImgProgress",function(e,n){t.progress(e,n)})}this.bind("onImgLoaded",function(e,n){t.end(e,n);n.target.unbind("onImgLoaded")});this.imgPreloadTimer=setInterval(e.proxy(this.imgPreloadLoop,this,this.nbImg),100);return this}})(jQuery)