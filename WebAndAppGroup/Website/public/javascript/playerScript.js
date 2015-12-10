//playerScript.js
$(window).load(function(){
	$(document).ready(function() {
		
		/*Variable Declarations*/{
			//Responsible for all js audio player communication on the index page
			var audioElement = document.createElement('player');
			var song = document.getElementById('song'); //Audio tag
			var playing = false;
			var looping = false;
			var activeSong = document.getElementById('song');
			var init = false; //Determines if the play button has been pressed at least once
			var socket = io.connect();
			
			//Used to hold active song info, is updated from eventual database
			var SongObject = function(songID, songDir, songTitle, songArtist) {
				this.songID = songID;
				this.songDir = songDir;
				this.songTitle = songTitle;
				this.songArtist = songArtist;
			} 

			//var songSource = document.getElementById('songSource'); //Source tag inside the audio tag
			document.getElementById("song").ontimeupdate = function() { updateTime(); };
			
			
			var song_1 = new SongObject(0, "/SongUpload/Songs/somethings-gotta-give_all-time-low_future-hearts.mp3", "Something's Gotta Give", "All Time Low");
			var song_2 = new SongObject(1, "/SongUpload/Songs/break-your-little-heart_all-time-low_nothing-personal.mp3", "Break Your Little Heart", "All Time Low");
			var song_3 = new SongObject(3, "/SongUpload/Songs/the-anthem_good-charlotte_the-young-and-the-hopeless.mp3", "The Anthem", "Good Charlotte");
		
			//Debug song destination array
			var songSrc = [song_1];
			currentSongSrc = 0;

			//Looks in the testAudio folder using this string.
			var currentSongDir = "testAudio/" + songSrc[currentSongSrc].songDir;
		}
		
		/*OnClick Functions*/{
			$('#playPauseButton').click(function() {
				playPause('song');
			});
			
			$('#nextButton').click(function() {
				nextSong();
			});
			
			$('#backButton').click(function() {
				restartSong();
			});
			
			$('#volumeDownInc').click(function() {
				var song = document.getElementById('song');
				if(song.volume >= 0.1)
					song.volume-=0.1;
			});
			
			$('#volumeUpInc').click(function() {
				var song = document.getElementById('song');
				if(song.volume <= 0.99)
					song.volume+=0.1;
			});
			
			$('#songSlider').click(function() {
				setSongPosition(this,event);
			});
			
			$('#volume').click(function() {
				muteAudio();
			});
			
			$('#volumeUp').click(function() {
				changeVolume(10, 'up');
			});
			
			$('#volumeDown').click(function() {
				changeVolume(10, 'down');
			});
			
			$('#volumeMeter').click(function() {
				setNewVolume(this,event);
			});
		}

		/*Play and Pause Methods*/{
			function play(id){
				activeSong = document.getElementById(id);
				activeSong.play();
				var percentageOfVolume = activeSong.volume / 1;
				var percentageOfVolumeMeter = document.getElementById('volumeMeter').offsetHeight * percentageOfVolume;    
				//Fills out the volume status bar.
				document.getElementById('volumeStatus').style.height = Math.round(percentageOfVolumeSlider) + "px";
				document.getElementById('playPauseButton').className = 'fa fa-pause';
			}
			
			function play2() {
				activeSong.play();
				document.getElementById('playPauseButton').className = 'fa fa-pause';
				playing = true;
				init = true;
				//var percentageOfVolume = activeSong.volume / 1;
				//var percentageOfVolumeMeter = document.getElementById('volumeMeter').offsetHeight * percentageOfVolume;    
				//Fills out the volume status bar.
				//document.getElementById('volumeStatus').style.height = Math.round(percentageOfVolumeSlider) + "px";	
			}
			
			//Pauses the active song.
			function pause() {
				document.getElementById('playPauseButton').className = 'fa fa-play';
				activeSong.pause();
				playing = false;
			}

			//Does a switch of the play/pause with one button.
			function playPause(id) {
				if(init) {
					//Sets the active song since one of the functions could be play.
					if(playing){
						pause();
					}
					else{
						play2();
					}
				}
				else{
					alert("No song selected please search for your favorite in the sidebar :)");
				}
			}
			
			function playSearched(songobject) {
				currentSongDir = "testAudio/" + songobject.songDir;
				activeSong.src = currentSongDir;
				activeSong.load();
				appendMetaTag();
				play2();
			}
		}
		
		/*Sound Methods*/{
			//Updates the volume of the track to a certain number.
			function volumeUpdate(number) {
				activeSong.volume = number / 100;
			}
		
			//Changes the volume up or down a specific number
			function changeVolume(number, direction) {
				//Checks to see if the volume is at zero, if so it doesn't go any further.
				if(activeSong.volume >= 0 && direction == "down") {
					activeSong.volume = activeSong.volume - (number / 100);
				}
				//Checks to see if the volume is at one, if so it doesn't go any higher.
				if(activeSong.volume <= 1 && direction == "up") {
					activeSong.volume = activeSong.volume + (number / 100);
				}
				
				 if(activeSong.volume > .6) {
					document.getElementById('volume').innerHTML = '<div id="volume-icon"></div><span>)</span><span>)</span><span>)</span>';
					document.getElementById("volume").setAttribute("class", "");
				} else if(activeSong.volume > 0 && activeSong.volume <= .3) {
					document.getElementById('volume').innerHTML = '<div id="volume-icon"></div><span>)</span>';
					document.getElementById("volume").setAttribute("class", "");
				} else if(activeSong.volume == 0) {
					document.getElementById("volume").setAttribute("class", "muted");
				} else {
					document.getElementById('volume').innerHTML = '<div id="volume-icon"></div><span>)</span><span>)</span>';
					document.getElementById("volume").setAttribute("class", "");
				}
				
				//Finds the percentage of the volume and sets the volume meter accordingly.
				var percentageOfVolume = activeSong.volume / 1;
				var percentageOfVolumeSlider = document.getElementById('volumeMeter').offsetHeight * percentageOfVolume;
				
				document.getElementById('volumeStatus').style.height = Math.round(percentageOfVolumeSlider) + "px";
			}
		
			//Set's volume as a percentage of total volume based off of user click.
			function setVolume(percentage){
				activeSong.volume =  percentage;
				
				if(percentage > .6){
					document.getElementById('volume').innerHTML = '<div id="volume-icon"></div><span>)</span><span>)</span><span>)</span>';
					document.getElementById("volume").setAttribute("class", "");
				}else if(percentage > 0 && percentage <= .3){
					document.getElementById('volume').innerHTML = '<div id="volume-icon"></div><span>)</span>';
					document.getElementById("volume").setAttribute("class", "");
				}else if(percentage == 0){
					document.getElementById("volume").setAttribute("class", "muted");
				}else{
					document.getElementById('volume').innerHTML = '<div id="volume-icon"></div><span>)</span><span>)</span>';
					document.getElementById("volume").setAttribute("class", "");
				}
				
				var percentageOfVolume = activeSong.volume / 1;
				var percentageOfVolumeSlider = document.getElementById('volumeMeter').offsetHeight * percentageOfVolume;
				
				document.getElementById('volumeStatus').style.height = Math.round(percentageOfVolumeSlider) + "px";
			}
		
			//Set's new volume id based off of the click on the volume bar.
			function setNewVolume(obj,e){
				var volumeSliderHeight = obj.offsetHeight;
				var evtobj = window.event? event: e;
				clickLocation = obj.offsetHeight - evtobj.layerY;
				
				var percentage = (clickLocation/volumeSliderHeight);
				setVolume(percentage);
			}
		
			//Mute
			function muteAudio() {
				var ismuted = document.getElementById("volume").getAttribute("class") == "muted" ? true : false;
				var curVol = document.getElementById("volume").getAttribute("muteVol");
			  
				if(ismuted == true){
					setVolume(curVol);
					document.getElementById("volume").setAttribute("class", "");
				}
				else {
					var prevVol = document.getElementById('volumeStatus').offsetHeight / document.getElementById('volumeMeter').offsetHeight;
					setVolume(0);
					document.getElementById("volume").setAttribute("class", "muted");
					document.getElementById("volume").setAttribute("muteVol", prevVol);
				}
			}
		}
		
		/*Manipulate Song Methods*/{
			function nextSong() {
				//Init returns true once the first song is played via play/pause toggle.
				if(init){
					if(currentSongSrc + 1 < songSrc.length) {
					//Sequentially goes to the next song in the playlist
						currentSongSrc++;
						//Used to reinitialize the audio player with a new song source
						currentSongDir = "testAudio/" + songSrc[currentSongSrc].songDir;
						activeSong.src = currentSongDir;
						activeSong.load();
						appendMetaTag();
						activeSong.play('song');
						return true;
					} else {
					//Once the playlist has ended, the player is reset and loops the first song in the song object array.	
						document.getElementById('song').currentTime = '0';
						pause();
						alert("No More Songs!");
						return false;
					}
				}
			}

			//Restart Song
			function restartSong() {
				document.getElementById('song').currentTime='0';
			}
			
			//Sets the location of the song based off of the percentage of the slider clicked.
			function setLocation(percentage) {
				activeSong.currentTime = activeSong.duration * percentage;
			}

			/*
			Gets the percentage of the click on the slider to set the song position accordingly.
			Source for Object event and offset: http://website-engineering.blogspot.com/2011/04/get-x-y-coordinates-relative-to-div-on.html
			*/
			function setSongPosition(obj,e) {
				//Gets the offset from the left so it gets the exact location.
				var songSliderWidth = obj.offsetWidth;
				var evtobj=window.event? event : e;
				clickLocation =  evtobj.layerX;
				
				var percentage = (clickLocation/songSliderWidth);
				//Sets the song location with the percentage.
				setLocation(percentage);
			}		
		}
		
		//Append Meta Tag: Redraws meta tag info on the main page when a new song is played
		function appendMetaTag() {
			document.getElementById('metaTagDiv').innerHTML = "Currently Playing: " + songSrc[currentSongSrc].songTitle + " - " + songSrc[currentSongSrc].songArtist;
		}

		function appendMeta(songTitle, songArtist) {
			document.getElementById('metaTagDiv').innerHTML = "Currently Playing: " + songTitle + " - " + songArtist;
		}

		//Updates the current time function so it reflects where the user is in the song.
		//This function is called whenever the time is updated.  This keeps the visual in sync with the actual time.
		function updateTime() {  
			var currentSeconds = (Math.floor(activeSong.currentTime % 60) < 10 ? '0' : '') + Math.floor(activeSong.currentTime % 60);
			var currentMinutes = Math.floor(activeSong.currentTime / 60);
			//Sets the current song location compared to the song duration.
			document.getElementById("songTimeA").innerHTML = currentMinutes + ":" + currentSeconds;
			document.getElementById("songTimeB").innerHTML = Math.floor(activeSong.duration / 60) + ":" + (Math.floor(activeSong.duration % 60) < 10 ? '0' : '') + Math.floor(activeSong.duration % 60);
			document.getElementById("songTimeC").innerHTML = currentMinutes + ":" + currentSeconds;
			document.getElementById("songTimeD").innerHTML = Math.floor(activeSong.duration / 60) + ":" + (Math.floor(activeSong.duration % 60) < 10 ? '0' : '') + Math.floor(activeSong.duration % 60);

			//Fills out the slider with the appropriate position.
			var percentageOfSong = (activeSong.currentTime/activeSong.duration);
			var percentageOfSlider = document.getElementById('songSlider').offsetWidth * percentageOfSong;
			
			//Updates the track progress div.
			document.getElementById('trackProgress').style.width = Math.round(percentageOfSlider) + "px";
		}

		$("#song").bind('ended', function() {
			nextSong();
		});
		
		function sleep(milliseconds) {
			var start = new Date().getTime();
			for (var i = 0; i < 1e7; i++) {
				if ((new Date().getTime() - start) > milliseconds){
					break;
				}
			}
		}
					
		socket.on('searchResult', function(data){
			console.log(data.message);
			console.log(data.message.title);
			while(document.getElementById("pizza").hasChildNodes()){
				var list = document.getElementById("pizza");
				list.removeChild(list.childNodes[0]);
			}
			for(i = 0; i < data.message.length; i++){
				if(data.message[i] != null)
				{
					//console.log(data.message[i].title);
					var span = document.createElement('span');
					span.innerHTML = "Song: " + data.message[i].title + "\nArtist: " + data.message[i].artist + "\nAlbum: " + data.message[i].album;
					var li = document.createElement('li');
					li.appendChild(span);
					li.onclick = function () {clicky(this)};
					li.source_data = data.message[i];
					document.getElementById('pizza').appendChild(li);
				}
			}
		});
		
		socket.on('playlist', function(data){
			console.log(data.message);
			for(i = 0; i < data.message.length; i++)
			{
				songSrc.push(new SongObject(data.message[i].songID, data.message[i].fileLocation, data.message[i].title, data.message[i].artist));
			}
		});
		
		function queryDatabase() {
			var query = document.getElementById('searchBar').value;
			socket.emit('searchQuery', {'message': query});
		}
		
		function clicky(object) {
			var searchsong = new SongObject(object.source_data.songID, object.source_data.fileLocation, object.source_data.title, object.source_data.artist);
			console.log(object);
			playSearched(searchsong);
			console.log(object.source_data.artist);
			appendMeta(object.source_data.title, object.source_data.artist);
			socket.emit('generatePlaylist', {'message': object.source_data.songID});
		}
		
		
		document.getElementById("searchBar").addEventListener("keydown", searchKeypress);
		function searchKeypress(){
			if($("#searchBar").is(':focus')){
				setTimeout(function(){ queryDatabase(); }, 150);
			}
		}
		
		$('#searchBar').focusin(function() {
			document.getElementById("pizza").style.display = "block";
		});
		
		$('#searchBar').focusout(function() {
			setTimeout(function(){
				document.getElementById("pizza").style.display = "none";
			}, 150);
		});
		
		/*Unused Methods*/{
			/*
			//Stop song by setting the current time to 0 and pausing the song.
			function stopSong() {
				activeSong.currentTime = 0;
				pause();
			}
			//Change Song
			function changeSong(id) {
				stopSong();
				//Sets the active song since one of the functions could be play.
				activeSong = document.getElementById(id);
				activeSong.play();
			}
			
			//Volume
			function isKeyPressed(event) {
				if (event.keyCode == 45) {
					document.getElementById('player').volume-=0.1;
				} else if(event.keyCode == 43 || event.keyCode == 61) {
					document.getElementById('player').volume+=0.1;
				}
			}
			*/
		}
		
	});
});