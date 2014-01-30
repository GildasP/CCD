/*
jQuery jProcessingJS [beta]
par Gildas P. / http://www.gildasp.fr

Tutos, infos, démos à venir sur http://playingwithpixels.gildasp.fr
*/

$.fn.jProcessingJS = function(params){

	/*
	Améliorations possibles :

	(- quand on appelle le plugin de l'extérieur (via $(document).ready par ex)
	le sketch n'est accessible qu'au bout de 1ms... pas avant.
	bon, en même temps ça n'a pas grand intérêt de faire ça)

	- en cas de preload long, avoir un drawPreload à afficher en attendant ?
	c'est tout à fait faisable en dehors des images gérées en interne... pour du son par exemple.
	pas sûr que ce soit très utile.

	- la propriété mousePressed ne se met pas à jour ! vu que je ne m'en suis pas occupé.

	- en mode responsive, écoute du resize de la canvas au lieu de window ?
	http://benalman.com/code/projects/jquery-resize/examples/resize/

	*/

	// on n'agit que si la cible existe...
	if(typeof this[0] != "undefined"){

		if(typeof this[0].frameCount != "undefined"){
			// ciblage via le $(this) à l'intérieur du setup...
			var sketch = this[0];
		} else {
			// ciblage via $('#canvasid')
			var id = this.attr('id');
			var sketch = Processing.getInstanceById(id);
		}

		/*
		Remarque sketch ne réprésente pas la même chose que sketch.externals.sketch...
		*/

		params = $.extend({
			fullScreen: false,
			responsive: true,
			mouseOverlay: false,
			preventMouse: false,
			noRightClic: false,
			touchEnabled: true,
			optMath: false,
			waitFor: undefined // fonction ou nom d'une variable booleenne
		}, params);

		// comment bloquer l'exécution du sketch quelques temps :)
		if(typeof params.waitFor != "undefined"){
			// on désactive le draw du sketch temporairement
			var draw_ = sketch.draw;
			sketch.draw = function(){};

			var paramType = (typeof params.waitFor); // type du paramaètre

			switch(paramType){
				case "function": // fonction qui renvoit un booleen
					var waitFunc = params.waitFor;
				break;
				case "string": // le nom d'une variable
					var waitFunc = function(){ 
						eval('var value = '+params.waitFor+';');
						return value;
					};
				break;
				default: // le paramètre utilisé n'est pas consistant, alors on n'en tient pas compte !
					var waitFunc = function(){ return true; }
				break;
			}

			var waiter = setInterval(function(){
				if(waitFunc()){ // on lance le sketch quand la fonction renvoit true
					clearInterval(waiter);
					sketch.draw = draw_;
				}
			}, 100);
		}	

		// pour faciliter l'accès à la canvas html elle-même, depuis le sketch
		sketch.canvas = $(sketch.externals.canvas);

		// correction du halo sur chrome...
		sketch.canvas.css({
			'outline': 'none',
			'-webkit-tap-highlight-color': 'rgba(255, 255, 255, 0)' /* mobile webkit */
		});

		// fullscreen
		if(params.fullScreen){
			$(window).resize(function(){
				sketch.size( $(window).width(), $(window).height(), sketch.externals.context );
				sketch.canvasX = 0;
				sketch.canvasY = 0;
			});
			$(window).trigger('resize');

			// positionnement css, pour éviter les barres de scroll
			var positionnement = sketch.canvas.css('position');
			if(positionnement != 'fixed' && positionnement != 'absolute'){
				sketch.canvas.css('position', 'fixed');
			}

		} else { // mode de déformation de la canvas et du sketch

			if(!params.responsive){
				$(window).resize(function(){
					sketch.size(this.innerWidth(), this.innerHeight(), sketch.externals.context);

					var posRef = sketch.canvas.offset(); // update coords canvas
					sketch.canvasX = posRef.left;
					sketch.canvasY = posRef.top;
				});
				$(window).trigger('resize'); // juste après le setup, du coup -> override le size() du setup		
			} else { console.log('responsive mode');
				$(window).resize(function(){
					var posRef = sketch.canvas.offset(); // update coords canvas
					sketch.canvasX = posRef.left;
					sketch.canvasY = posRef.top;
					sketch.size( sketch.canvas.width(), sketch.canvas.height(), sketch.externals.context );
				});
				$(window).trigger('resize');
			}
		}

		// désactiver le clic droit
		if(params.noRightClic){
			$(document).on("contextmenu", function(e){
				e.preventDefault();
			});
			// la suite se trouve avec mouseOverlay
		}
			
		// mouse events et TOUCH events via jquery en cas d'overlay
		if(params.mouseOverlay){

			if(params.preventMouse){ // preventMouse même si pas d'écouteurs par ailleurs
				if(typeof sketch.mousePressed == "undefined"){
					$(document).on('mousedown touchstart', function(e){
						e.preventDefault();		
						sketch.mousePressed	= true;	
					});
				}
				if(typeof sketch.mouseReleased == "undefined" && typeof sketch.mouseClicked == "undefined"){
					$(document).on('mouseup touchend', function(e){
						e.preventDefault();
						sketch.mousePressed	= false;	
					});
				}
			}

			if(typeof sketch.mousePressed != "undefined"){

				// pour contourner le doublon avec les events naturels de Pjs...
				sketch.mousePressed_ = sketch.mousePressed;
				sketch.mousePressed = function(){};

				$(document).on('mousedown touchstart', function(e){

					if(params.preventMouse){ e.preventDefault(); }		

					if(sketch.mouseX>0 && sketch.mouseX<sketch.width && sketch.mouseY>0 && sketch.mouseY<sketch.height){
						sketch.mousePressed_();			
					}		
				});
			}
			if(typeof sketch.mouseReleased != "undefined"){
				
				// pour contourner le doublon avec les events naturels de Pjs...
				sketch.mouseReleased_ = sketch.mouseReleased;
				sketch.mouseReleased = function(){};

				$(document).on('mouseup touchend', function(e){

					if(params.noRightClic && e.which == 3){ // clic droit
						e.preventDefault();
					} else {

						if(params.preventMouse){ e.preventDefault(); }	

						if(sketch.mouseX>0 && sketch.mouseX<sketch.width && sketch.mouseY>0 && sketch.mouseY<sketch.height){
							sketch.mouseReleased_();			
						}
					}
				});
			}
			if(typeof sketch.mouseClicked != "undefined"){
				
				// pour contourner le doublon avec les events naturels de Pjs...
				sketch.mouseClicked_ = sketch.mouseClicked;
				sketch.mouseClicked = function(){};

				$(document).on('mouseup touchend', function(e){

					if(params.noRightClic && e.which == 3){ // clic droit
						e.preventDefault();
					} else {

						if(params.preventMouse){ e.preventDefault(); }	

						if(sketch.mouseX>0 && sketch.mouseX<sketch.width && sketch.mouseY>0 && sketch.mouseY<sketch.height){
							sketch.mouseClicked_();			
						}		
					}
				});
			}

			// mouse position, relative to canvas

			if(typeof sketch.mouseMoved == "undefined" && typeof sketch.mouseOver == "undefined" && typeof sketch.mouseOut == "undefined"){
				// mouse position only, moins de calculs
				$(document).on('mousemove', function(e){
					sketch.mouseX = e.pageX - sketch.canvasX;
					sketch.mouseY = e.pageY - sketch.canvasY;
				});
				if(params.touchEnabled){
					$(document).on('touchmove', function(e){
						var touch = e.originalEvent.changedTouches[0];
						sketch.mouseX = touch.pageX - sketch.canvasX;
						sketch.mouseY = touch.pageY - sketch.canvasY;
					});
				}

			} else {
				// mouseMove(), mouseOver(), mouseOut()
				if(typeof sketch.mouseMoved != "undefined"){
					sketch.mouseMoved_ = sketch.mouseMoved;
					sketch.mouseMoved = function(){};
				} else {
					sketch.mouseMoved_ = function(){};
				}
				if(typeof sketch.mouseOver != "undefined"){
					sketch.mouseOver_ = sketch.mouseOver;
					sketch.mouseOver = function(){};
				} else {
					sketch.mouseOver_ = function(){};
				}
				if(typeof sketch.mouseOut != "undefined"){
					sketch.mouseOut_ = sketch.mouseOut;
					sketch.mouseOut = function(){};
				} else {
					sketch.mouseOut_ = function(){};
				}
				sketch.hover = false;
				$(document).on('mousemove', function(e){
					sketch.mouseX = e.pageX - sketch.canvasX;
					sketch.mouseY = e.pageY - sketch.canvasY;
					if(sketch.mouseX>0 && sketch.mouseX<sketch.width && sketch.mouseY>0 && sketch.mouseY<sketch.height){
						sketch.mouseMoved_();
						if(!sketch.hover){
							sketch.hover = true;
							sketch.mouseOver_();
						}
					} else if(sketch.hover){
						sketch.hover = false;
						sketch.mouseOut_();
					}	
				});
				if(params.touchEnabled){
					$(document).on('touchmove', function(e){
						var touch = e.originalEvent.changedTouches[0];
						sketch.mouseX = touch.pageX - sketch.canvasX;
						sketch.mouseY = touch.pageY - sketch.canvasY;
						if(sketch.mouseX>0 && sketch.mouseX<sketch.width && sketch.mouseY>0 && sketch.mouseY<sketch.height){
							sketch.mouseMoved_();
							if(!sketch.hover){
								sketch.hover = true;
								sketch.mouseOver_();
							}
						} else if(sketch.hover){
							sketch.hover = false;
							sketch.mouseOut_();
						}	
					});
				}
			}			

			// désactiver la maj de mouseX et mouseY via pjs
			sketch.updateMousePosition = function(){};
		}

		if(params.optMath){ // des opérations mathématiques plus rapides...
			/*
			références :
			http://code.google.com/p/jspeed/
			http://www.html5rocks.com/en/tutorials/canvas/performance/
			*/
			sketch.round = function(nb){
				return (0.5 + nb) << 0;
			};
			sketch.floor = function(nb){
				return nb >> 0;
			};
			sketch.abs = function(nb){
				return nb < 0 ? ~nb++ : nb;
			};
			sketch.min = function(nb1, nb2){
				return nb1 < nb2 ? nb1 : nb2;
			};
		}

		// hop, une nouvelle fonction en bonus
		sketch.transBackground = function(){
			this.background(0,0);
		};
		
	}

	return this;
};