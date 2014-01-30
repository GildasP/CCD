/*
jQuery MultipleAudioPlayer plugin - version 0.9

par Gildas P. / www.gildasp.fr

/////////

Ce plugin permet :
- de lister une série de sons
- d'écrire automatiquement un player audio HTML5 minimal pour chacun
- de récupérer un événement quand ils sont tous chargés, et prêts à servir
- de piloter ensuite chaque son indépendemment

Idéal pour du jeu vidéo ou des sons d'événements

Requis :
- la librairie jQuery
- 2 fichiers pour chaque son : un .mp3 et un .ogg, pour une compatibilité sur tous les navigateurs récents

*/

(function($){
	$.fn.multipleAudioPlayer = function(soundsList, endfunc){

		// écriture des balises audio
		for(i=0; i<soundsList.length; i++){

			// identifiant pour le player, le nom du fichier sans les éventuels dossiers
			var soundName = soundsList[i].slice( soundsList[i].lastIndexOf('/')+1 );

			this.append('\
				<audio autobuffer preload="auto" class="audioPlayer-'+soundName+'"> \
					<source src="'+soundsList[i]+'.mp3" type="audio/mpeg"></source> \
					<source src="'+soundsList[i]+'.ogg" type="audio/ogg"></source> \
				</audio>');
		}

		// preloading
		var audioPlayers = this.find('audio');
		var audioCount = audioPlayers.length;

		audioPlayers.bind('canplaythrough', function(){
			audioCount--;
			if(audioCount<=0){ // all sounds loaded
				$.event.trigger({ type: "soundsLoaded"});
			}
		});

		$(document).bind("soundsLoaded", function(){
			endfunc(); // la fonction à déclencher une fois les sons chargés
			$(document).unbind("soundsLoaded");
		});
		return this;
	};
	$.fn.play = function(soundName){
		var audioPlayer = this.find('audio.audioPlayer-'+soundName);
		if(audioPlayer.length>0) audioPlayer.get(0).play();
		return this;
	};
	$.fn.pause = function(soundName){
		var audioPlayer = this.find('audio.audioPlayer-'+soundName);
		if(audioPlayer.length>0) audioPlayer.get(0).pause();
		return this;
	};
	$.fn.stop = function(soundName){
		var audioPlayer = this.find('audio.audioPlayer-'+soundName);
		if(audioPlayer.length>0){ 
			audioPlayer.get(0).pause();
			audioPlayer.get(0).currentTime = 0;
		}
		return this;
	};

})(jQuery);