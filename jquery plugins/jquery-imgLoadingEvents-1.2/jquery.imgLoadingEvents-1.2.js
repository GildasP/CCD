/*

jQuery imgLoadingEvents
par Gildas P. / www.gildasp.fr

infos, tuto, démos sur 
http://playingwithpixels.gildasp.fr/?p=344
http://www.gildasp.fr/exp/easydrag/

*/

(function($) {

	$.fn.imgPreloadLoop = function(nbImg){
		// la cible peut être un multiple

		imageCount = 0;  
	    this.cible.each(function(){
	        // get(0) pour atteindre l'objet du DOM directement
	        if ($(this).get(0).complete) {
	            imageCount++;         
	        };
	    });   
	    //$('#debug').append(' '+imageCount+'/'+nbImg);
	    
	    if(imageCount >= nbImg){ 

		    // end loop
		    clearInterval(this.imgPreloadTimer);

		    // trigger final event
		    this.trigger("onImgLoaded", {loaded: imageCount, total: nbImg, target: this});

		    // unbind ?
		    this.unbind("onImgProgress");
		    this.unbind("onImgLoaded");

	    } else {
	    	// progress event
	    	this.trigger("onImgProgress", {loaded: imageCount, total: nbImg, target: this});
	    }
	};


    $.fn.imgPreload = function(params) {

    	if(typeof params == 'function'){
    		params = {end: params};
    	}

    	params = $.extend({
    		start: function(){},
    		progress: function(){},
    		end: function(){}
    	}, params);

    	/////

    	// sécurité : cherche les images dans l'objet, y compris l'objet lui-même...
		this.cible = this.find('img').add(this.filter('img'));

		// nb d'images à précharger
		this.nbImg = this.cible.length;

		// clear previous events
		this.unbind("onImgLoadStart onImgProgress onImgLoaded");

		// onImgLoadStart event
		this.bind("onImgLoadStart", function(e, data){
			params.start(e, data);
			data.target.unbind("onImgLoadStart");
		});

		if(this.nbImg>0){
			// trigger start
			this.cible.trigger("onImgLoadStart", {loaded: 0, total: this.nbImg, target: this});

			// onImgProgress event
			this.bind("onImgProgress", function(e, data){
				params.progress(e, data);
			});
		}

		// onImgLoaded event
		this.bind("onImgLoaded", function(e, data){
			params.end(e, data);
			data.target.unbind("onImgLoaded");
		});

		// start loop dans un objet local, pour pouvoir cumuler plusieurs écoutes distinctes
		this.imgPreloadTimer = setInterval($.proxy(
			this.imgPreloadLoop, this, this.nbImg
		), 100);
		/* $.proxy permet de ne pas perdre this... */

    	/////
    	return this;
    };

})(jQuery);

/*
function imageLoadingLoop(cible, nbImg){

	// la cible peut être un multiple

	imageCount = 0;  
    $(cible).each(function(){
        // get(0) pour atteindre l'objet du DOM directement
        if ($(this).get(0).complete) {
            imageCount++;         
        };
    });   
    //$('#debug').append(' '+imageCount+'/'+nbImg);
    
    if(imageCount >= nbImg){ 

	    // end loop
	    clearInterval(imageLoadingTimer);

	    // trigger final event
	    cible.trigger("onImgLoaded", {loaded: imageCount, total: nbImg, target: cible});

	    // unbind ?
	    cible.unbind("onImgProgress");
	    cible.unbind("onImgLoaded");

    } else {
    	// progress event
    	cible.trigger("onImgProgress", {loaded: imageCount, total: nbImg, target: cible});
    }
}

function imgPreload(cible, funcstart, funcprogress, funcend){

	// truc de ouf : si c'est des images ça marche, si c'est pas des images ça choppe les images...
	cible = cible.find('img').add(cible.filter('img'));

	// nb d'images à précharger
	nbimg = cible.length;

	// clear previous events
	cible.unbind("onImgLoadStart onImgProgress onImgLoaded");

	// onImgLoadStart event
	cible.bind("onImgLoadStart", function(e){
		funcstart(e);
		cible.unbind("onImgLoadStart");
	});

	if(nbimg>0){
		// trigger start
		cible.trigger("onImgLoadStart");

		// onImgProgress event
		cible.bind("onImgProgress", function(e, data){
			funcprogress(e, data);
		});
	}

	// onImgLoaded event
	cible.bind("onImgLoaded", function(e, data){
		funcend(e, data);
		cible.unbind("onImgLoaded");
	});

	// start loop
	imageLoadingTimer = setInterval(function(){
		imageLoadingLoop(cible, nbimg);
	}, 50);
}*/