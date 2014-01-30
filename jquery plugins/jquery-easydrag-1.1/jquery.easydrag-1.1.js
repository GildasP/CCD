/*

jQuery easyDrag
drag facile et tactile...
par Gildas P. / www.gildasp.fr

infos, tuto, démos sur 
http://www.gildasp.fr/exp/easydrag/

Testé et approuvé sur Firefox, Safari, Opera, Chrome, IE 10, 9, 8, 7, 6, tablette Android, et iPhone.
Enjoy !

*/

(function($) {
    $.fn.easyDrag = function(params) {

    	params = $.extend({
    		handle: 'this', 
    		axis: false, 
    		container: false, 
    		start: function(){},
    		drag: function(){},
    		stop: function(){},
    		cursor: 'move'
    	}, params);

    	/////////////////////////

		easyDrag_maxZindex = 0;

		// curseur
		if(params.handle == 'this' || this.find(params.handle).length==0){
			handlers = this;
		} else {
			handlers = this.find(params.handle);
		}
		handlers.css('cursor', params.cursor);

		easyDrag_maxZindex = 0;

		this.each(function(){

			// les handlers se souviennent de leurs items draggables
			if(params.handle == 'this' || $(this).find(params.handle).length==0){
				handle = $(this);
			} else {
				handle = $(this).find(params.handle);
			}

			handle.data('myDragItem', $(this));
			handle.data('axis', params.axis);
			handle.data('container', params.container);
			handle.data('startFunc', params.start);
			handle.data('dragFunc', params.drag);
			handle.data('stopFunc', params.stop);	

			// z-index
			if($(this).css('z-index')!='auto'){
				easyDrag_maxZindex = Math.max(easyDrag_maxZindex, $(this).css('z-index'));
			};

			// positionnement
			if($(this).css('position') == 'absolute' || $(this).css('position') == 'fixed'){
				
			} else {
				if($(this).css('left') == 'auto'){ $(this).css('left', '0'); } // sur android...
				if($(this).css('top') == 'auto'){ $(this).css('top', '0'); }
				$(this).css('position', 'relative');
			}

			// clic events
			handle.mousedown(function(event){
				event.preventDefault();				

				dragHandle = $(this);
				dragItem = $(this).data('myDragItem');
				initItemX = parseInt(dragItem.css('left'));
				initItemY = parseInt(dragItem.css('top'));

				easyDrag_Axis = $(this).data('axis');
				easyDrag_Container = $(this).data('container');
				if(easyDrag_Container && easyDrag_Container.length>0){
					easydrag_refX = $(this).offset().left;
					easydrag_refY = $(this).offset().top;
				}

				dragHandle.data('startFunc').call(dragItem);

				initEventX = event.pageX;
				initEventY = event.pageY;

				$(document).on('mousemove', function(e){
					e.preventDefault();

					dragHandle.data('dragFunc').call(dragItem); // drag event
					
					eventX = e.pageX;
					eventY = e.pageY;

					var nextX = (initItemX + eventX-initEventX);
					var nextY = (initItemY + eventY-initEventY);

					if(!easyDrag_Axis || easyDrag_Axis=='x'){ dragItem.css({'left': nextX+'px'}); }
					if(!easyDrag_Axis || easyDrag_Axis=='y'){ dragItem.css({'top': nextY+'px'}); }

					easyDrag_contain();
				});

				$(document).mouseup(function(){
					$(document).off('mousemove mouseup');
					dragHandle.data('stopFunc').call(dragItem); // stop event
					
				});
				// over the top !
				easyDrag_maxZindex++;
				dragItem.css('z-index', easyDrag_maxZindex);
			});

			// touch events
			handle.on('touchstart', function(event){
				event.preventDefault();				

				dragHandle = $(this);
				dragItem = $(this).data('myDragItem');
				initItemX = parseInt(dragItem.css('left'));
				initItemY = parseInt(dragItem.css('top'));

				easyDrag_Axis = $(this).data('axis');
				easyDrag_Container = $(this).data('container');
				if(easyDrag_Container && easyDrag_Container.length>0){
					easydrag_refX = $(this).offset().left;
					easydrag_refY = $(this).offset().top;
				}

				dragHandle.data('startFunc').call(dragItem);

				touch = event.originalEvent.changedTouches[0];
				initEventX = touch.pageX;
				initEventY = touch.pageY;
				

				$(document).on('touchmove', function(e){
					e.preventDefault();

					dragHandle.data('dragFunc').call(dragItem); // drag event
					
					touch = e.originalEvent.changedTouches[0];
					eventX = touch.pageX;
					eventY = touch.pageY;					

					var nextX = (initItemX + eventX-initEventX);
					var nextY = (initItemY + eventY-initEventY);

					if(!easyDrag_Axis || easyDrag_Axis=='x'){ dragItem.css({'left': nextX+'px'}); }
					if(!easyDrag_Axis || easyDrag_Axis=='y'){ dragItem.css({'top': nextY+'px'}); }

					easyDrag_contain();
				});

				$(document).on('touchend', function(){
					$(document).off('touchmove touchend');
					dragHandle.data('stopFunc').call(dragItem); // stop event
					
				});
				// over the top !
				easyDrag_maxZindex++;
				dragItem.css('z-index', easyDrag_maxZindex);
			});
		});

    	////////////////////////////////////

    	return this;
    };

    function easyDrag_contain(){
    	if(easyDrag_Container && easyDrag_Container.length>0){

    		// position actuelle...
			var cur_offset = dragItem.offset();
			var container_offset = easyDrag_Container.offset();

    		// horizontal
    		var limite1 = container_offset.left;
			var limite2 = limite1+easyDrag_Container.width()-dragItem.innerWidth();
			limite1 += parseInt(dragItem.css('margin-left'));
			if(cur_offset.left<limite1){
				dragItem.offset({left: limite1});
			} else if(cur_offset.left>limite2){
				dragItem.offset({left: limite2});
			}

			// vertical
			var limite1 = container_offset.top;
			var limite2 = limite1+easyDrag_Container.height()-dragItem.innerHeight();
			limite1 += parseInt(dragItem.css('margin-top'));
			if(cur_offset.top<limite1){
				dragItem.offset({top: limite1});
			} else if(cur_offset.top>limite2){
				dragItem.offset({top: limite2});
			}
    	}
    };

})(jQuery);