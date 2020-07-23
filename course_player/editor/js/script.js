
$(window).on('load', function(){
	// $('#player_slider').hide();
	$('.progress-bar.bg-warning').show()
})

$(document).ready(function(){

	// var player = null;
	var progressBar = null;
	var lessons = null;
	var currentValue = 0;
	var paragraphs = [];
	var ticks = [];
	var obj = {};
	var lesson_count=0;
	var course = "";
	var Modules="";

	  // Nav
	  document.getElementById('addModule').style.display = 'none';
	  document.getElementById('full-width-btn').style.display = 'none';
	  document.getElementById('saveTocBtn').style.display = 'none';
	  document.getElementById('CloseMainNav').style.display = 'none';
	  document.getElementById('closeTimeNav').style.display = 'none';
	  document.getElementById('OpenTimeNav').style.display = 'none';
	  
	  function OpenTimerNav(){
		document.getElementById('OpenTimeNav').style.display = 'none';
		document.getElementById('timerNav').classList.add('activeTImerNav')
		document.getElementById("timerNav").style.width = "250px";
		document.getElementById("main").style.marginLeft = "0";
		document.getElementById('closeTimeNav').style.display = 'block';
	  }

	  function closeTimerNav() {
		document.getElementById('timerNav').classList.remove('activeTImerNav')
		document.getElementById('closeTimeNav').style.display = 'none';
		document.getElementById('OpenTimeNav').style.display = 'block';
		document.getElementById("timerNav").style.width = "0";
		document.getElementById("main").style.marginLeft= "0";
	  }


	  function openNav() {
		document.getElementById("mySidenav").style.width = "320px";
		document.getElementById("main").style.marginLeft = "320px";
		document.getElementById('addModule').style.display = 'block';
		document.getElementById('full-width-btn').style.display = 'block';
		document.getElementById('saveTocBtn').style.display = 'block';
		document.getElementById('CloseMainNav').style.display = 'block';
		document.getElementById('CloseMainNav').style.right = '-48px';
		document.getElementById("mySidenav").style.overflowX = "visible";
	  }

	  function closeNav() {
		document.getElementById("mySidenav").style.width = "0";
		document.getElementById("mySidenav").style.overflowX = "hidden";
		document.getElementById('addModule').style.display = 'none';
		document.getElementById('full-width-btn').style.display = 'none';
		document.getElementById('saveTocBtn').style.display = 'none';
		document.getElementById("main").style.marginLeft= "0";
		document.getElementById('CloseMainNav').style.display = 'none';
		$('.cd-accordion').css({
		  'margin-top' : '0px'
		});
	  }

	  

	  // Audion Player function
	  document.addEventListener("DOMContentLoaded", function() { startplayer(); }, false);

	  var player;

	  function startplayer() 
	  {
		player = document.getElementById('audio1');
		player.controls = true;
		
	  }

	  // Upload Audio

	var PlayerDuration = document.getElementById('audio');

	var players;
	var currentValue;
	function fancyTimeFormat(time){
		  var hrs = ~~(time / 3600);
		  var mins = ~~((time % 3600) / 60);
		  var secs = ~~time % 60;
		  var ret = "";
		  if (hrs > 0) {
			  ret += "" + hrs + ":" + (mins < 10 ? "0" : "");
		  }
		  ret += "" + mins + ":" + (secs < 10 ? "0" : "");
		  ret += "" + secs;
		  return ret;
	  }
	  
	  function play(count){
		players = $('.player'+count+'')[0];
		
		$(document).on('canplaythrough', players, function(e) {
		  var duration=players.duration;
		  duration = Math.round(duration);
		  if(progressBar == null && $('#player_slider').length > 0) {
			initializeSlider(duration, [], 0);
		  }
		});

		
		players.ontimeupdate = function() {
		  jQuery("#audioDuration").html(fancyTimeFormat(players.duration));
		  jQuery("#currentTime").html(fancyTimeFormat(players.currentTime));
		  
		  if(players.currentTime > currentValue)
			currentValue = players.currentTime;
		  if(progressBar != null)
			progressBar.bootstrapSlider('setValue',players.currentTime);

		  $.each(paragraphs, function(i,para) {
			var time1 = players.currentTime;
			var mins = ~~((time1 % 3600) / 60);
			  var secs = ~~time1 % 60;
			  var ret = "";
			  ret += "" + mins + "." + (secs < 10 ? "0" : "");
			  ret += "" + secs;
			  ret = parseFloat(ret);
			if(ret < para.min || ret > para.max)
			  return;

			if($('.slide-section:visible').find('.quest:visible')){
				$('.slide-section:visible').find('.quest:visible').find('span[data-time]').removeClass('bg-info');
				$('.slide-section:visible').find('.quest:visible').find('span[data-time="' + para.max + '"]').addClass('bg-info');
			}
			if($('.slide-section:visible').find('#center:visible')){
				$('.slide-section:visible').find('#center:visible').find('span[data-time]').removeClass('bg-info');
				$('.slide-section:visible').find('#center:visible').find('span[data-time="' + para.max + '"]').addClass('bg-info');
			}
			
		  
		  });
		}

		players.onended = function() {
	  
	  $('.play-narration i').removeClass('fa-pause-circle').addClass('fa-play-circle');
	  // var length1 = $('.slide_'+count+'').next().length;

	  // if(length1 > 0) {
	  // 	$('.slide_'+count+'').fadeOut('fast');
	  // $('.slide_'+count+'').hide();
	  // $('.slide_'+count+'').next().show( "slide", {direction: "right" }, 2000 );

	  // paragraphs = [];
	  // play(count+1);
	  // progressBar.bootstrapSlider('setValue',0);
	  // setTimeout(function() {
    //   player.play();
  // 	$('.play-narration i').addClass('fa-pause-circle').removeClass('fa-play-circle');}, 2000);
	  
	  // var duration= $('.player'+count+'').duration;
	  // $('.start-time').text('0:00');
	  // currentValue = 0;
	  // initializeSlider(duration, [], 0);
	  // }else{
	  // 	$('.popup-inner h1').html("");
	  // 	$('[data-popup="popup-1"]').fadeIn(350);
	  // 	$('.popup-inner').prepend("<h1>Thankyou</h1>");
	  // 	$('[data-popup-close]').on('click', function(e) {			
	  // 	$('[data-popup="popup-1"]').fadeOut(350);
	  // 	e.preventDefault();
	  // 	});
	  // }
  }

  // setSlideHeight();
  // $(window).resize(function() {
  // 	setSlideHeight();
  // });
  // setNarration();
}


function playPausePlayer() {
  if(players.paused === false) {
	  players.pause();
	  // $('.play-narration i').removeClass('fa-pause-circle').addClass('fa-play-circle');
  }
  else {
	  players.play();
	  // $('.play-narration i').removeClass('fa-play-circle').addClass('fa-pause-circle');
  }
}

function initializeSlider(duration, ticks, value) {
	progressBar = $('#player_slider').bootstrapSlider({
	min: 0,
	max: Math.round(players.duration),
	tooltip: 'hide',
	step: 0.000001,
	ticks: ticks,
	value: value
	}).on('change',function(event) {
	// if(event.value.newValue > currentValue) {
	// 	event.stopPropagation();
	// 	var value = fancyTimeFormat(event.value.oldValue);
	// 	$('.start-time').text(value);
	// 	progressBar.bootstrapSlider('setValue',event.value.oldValue);
	// 	return false;
	// }
	// else {
		var value = fancyTimeFormat(event.value.newValue);
		$('.currentTime').text(value);
		players.currentTime = event.value.newValue;
		if(players.paused === false)
			playPausePlayer();
	//}
	});
}

function setSlideHeight() {
	var totalHeight = $(window).height();
	var height = totalHeight - ($('.navbar').outerHeight() + $('.progressbar-section').outerHeight() + 25);
	$('.slide-section').css('min-height',height + 'px');
}
	  
function play_aud(){            
	var playerSource = document.getElementById('audio');
	
	if($(playerSource).children().attr('src') != ''){
		// player.play();
		$('#playBtn').children('.fa').addClass('fa-pause');
	}else{
		alert('please upload the audio file')
	}
	}

function openFull() {
	document.getElementById("mySidenav").style.width = "100%";
	$('.cd-accordion').css({
		'margin-top' : '45px'
	});
	document.getElementById('CloseMainNav').style.right = '10px';
	document.getElementById('CloseMainNav').style.zIndex = '9999';
}


	// Creating ID's for the Accordion
	var count = 0; 
	var lessoncount = 0;
	var innerTopicsCount = 0;
	var countplay = 0;

	var demoAccordion = $(".sideAccordion");
	var slides = document.querySelectorAll('#slides');

	$(document).on('click', '#innerTopics', function(){
		innerTopicsCount += 1;
		$(this).siblings('.cd-accordion__sub.cd-accordion__sub--l2').prepend('<li id="topic-'+innerTopicsCount+'" class="cd-accordion__item inner-topics" data-inner-topic="'+innerTopicsCount+'"><div class="actionIcons"><span id="editTopic" class="fa fa-pencil" aria-hidden="true"></span><span id="checkTopic" class="fa fa-check" aria-hidden="true"></span><span id="deletTopic" class="fa fa-trash" aria-hidden="true"></span></div><span>Topic <input type="text" id="module-name-'+lessoncount+'" class="inputText innerTopics" value="" placeholder="LESSON PLACEHOLDER '+innerTopicsCount+'"></span><span class="textInput"></span></li>');
		$(slides).append('<div class="slide" data-editor='+innerTopicsCount+' id="editor-'+innerTopicsCount+'"><div class="container"><h4 class="topic-title" style="margin-top: 20px;"></h4></div><div class="container editorMain-'+innerTopicsCount+' pl-5 pr-5"><div class="row"><div class="col-12"><div class="templateStyle template-'+innerTopicsCount+'"><div class="column1 grid" data-coulmn="'+innerTopicsCount+'"><img src="./images/icons/1column.jpg" alt=""></div><div class="column2 grid" data-coulmn="'+(innerTopicsCount + innerTopicsCount)+'"><img src="./images/icons/2-column_ll_rs.jpg" alt=""></div><div class="column3 grid" data-coulmn="'+(innerTopicsCount + innerTopicsCount + innerTopicsCount)+'"><img src="./images/icons/2-column_ls_rl.jpg" alt=""></div></div></div></div><div class="grid editorsGrid"><div class="row"><div class="col-xs-12 editorsGrid-'+ innerTopicsCount +'" data-coulmn="'+innerTopicsCount+'"><div class="d-flex"><label class="switch"><input type="checkbox" checked id="myCheck'+innerTopicsCount+'"><span class="switch-slider round"></span></label><p class="labelText">Media / Text</p></div><div id="Editor'+innerTopicsCount+'" class="editor siblings" ><div class="summernote siblings"></div></div><div id="Media'+innerTopicsCount+'" class="siblings editor-media" ><video src="" width="100%" height="100%" controls="controls" id="getVideo-first-'+innerTopicsCount+'"><source src="" type=""></video><img src="" alt="" id="getImage-first-'+innerTopicsCount+'"><div class="upload-btn-wrapper"><button class="btn btn-warning">Upload</button><input type="file" class="imgVideoBtn" id="videoUpload-first-'+innerTopicsCount+'" onchange=""></div></div></div><div class="col-xs-4 editorsGrid-'+ (innerTopicsCount + innerTopicsCount) +'" data-coulmn="'+(innerTopicsCount + innerTopicsCount)+'"><div class="d-flex"><label class="switch"><input type="checkbox" checked id="myCheck'+innerTopicsCount+'"><span class="switch-slider round"></span></label><p class="labelText">Media / Text</p></div><div id="Editor2" class="editor siblings"><div class="summernote siblings"></div></div><div id="Media'+innerTopicsCount+'" class="siblings editor-media" ><video src="" width="720" height="480" controls="controls" id="getVideo-second-'+innerTopicsCount+'"><source src="" type=""></video><img src="" alt="" id="getImage-second'+innerTopicsCount+'"><div class="upload-btn-wrapper"><button class="btn btn-warning">Upload</button><input type="file" id="videoUpload-second-'+innerTopicsCount+'" class="imgVideoBtn"></div></div></div><div class="col-xs-4 editorsGrid-'+ (innerTopicsCount + innerTopicsCount + innerTopicsCount) +'" data-coulmn="'+(innerTopicsCount + innerTopicsCount + innerTopicsCount)+'"><div class="d-flex"><label class="switch"><input type="checkbox" checked id="myCheck'+innerTopicsCount+'"><span class="switch-slider round"></span></label><p class="labelText">Media / Text</p></div><div id="Editor'+innerTopicsCount+'" class="editor siblings"><div class="summernote siblings"></div></div><div id="Media'+innerTopicsCount+'" class="siblings editor-media" ><video src="" width="720" height="480" controls="controls" id="getVideo-third-'+innerTopicsCount+'"><source src="" type=""></video><img src="" alt="" id="getImage-third-'+innerTopicsCount+'"><div class="upload-btn-wrapper"><button class="btn btn-warning">Upload</button><input type="file" id="videoUpload-third-'+innerTopicsCount+'" class="imgVideoBtn"></div></div></div></div></div><div class="row"><div class="container-audio"><audio id="audio'+innerTopicsCount+'" controls class="audio-hide player'+innerTopicsCount+'"><source src="" id="src'+innerTopicsCount+'" class=""/></audio><div class="custom-audioplayer mb-5 mt-3"><div class="row align-items-center"><div class="col-2"><div class="audioBTn" data-rel='+innerTopicsCount+'><button class="mr-2 btn btn-warning" id="CaptureBtn"><i class="fa fa-camera" aria-hidden="true"></i></button><button id="playBtn" class="btn btn-warning playBtn" class="mr-2 btn btn-warning"><i class="fa fa-play"></i></button></div><div class="audioDuration"><span id="currentTime">0.00</span><span>/</span><span id="audioDuration">0.00</span></div></div><div class="col-10"><div class="progress"></div></div></div><input type="file" class="AudioUpload" id="upload'+innerTopicsCount+'" accept="audio/*"/></div></div><button class="btn btn-warning saveTopics" id="save-topic-'+innerTopicsCount+'">SAVE TOPICS</button></div></div></div>');
		var countingLength = $('.inner-topics');
		// console.log(countingLength);
		if(countingLength.length > 0){
			$('.cd-accordion').css({
				'margin-top' : '45px'
			});
			document.getElementById('CloseMainNav').style.display = 'block';
		}else{
			$('.cd-accordion').css({
				'margin-top' : '0px'
			});
			document.getElementById("CloseMainNav").style.marginTop = "0";
			document.getElementById('CloseMainNav').style.display = 'none';
		}

		return false;
		// setTimeout(function(){
		// })
	});
	
	

	$(document).on('change', '.switch input',function(){
		var getEditor = $(this).parent().parent();
		// console.log(getEditor.siblings());
		var checked = $(this).is(':checked');
		$(this).parent().toggleClass('active',checked);
		$(this).parent().toggleClass('',!checked);
		if($(this).parent().hasClass('active')){
			$(getEditor).siblings('.editor').show()
			$(getEditor).siblings('.editor-media').hide()
		}else{
			$(getEditor).siblings('.editor').hide()
			$(getEditor).siblings('.editor-media').show()
		}
	})

	var columns = $('.resizable-column');
	var column = $('.editorsGrid').children().children().find('.resizable-column');

	$(document).on('keypress','.inner-topics:visible',function(){
		var countingLength = $('.inner-topics');
		if(countingLength.length > 0){
			$('.cd-accordion').css({
				'margin-top' : '0'
			});
			document.getElementById('CloseMainNav').style.display = 'block';
		}else{
			$('.cd-accordion').css({
				'margin-top' : '45px'
			});
			document.getElementById("CloseMainNav").style.marginTop = "0";
			document.getElementById('CloseMainNav').style.display = 'none';
		}

		document.getElementById("mySidenav").style.width = "320px";
		document.getElementById("main").style.marginLeft = "320px";
		document.getElementById("main").style.marginLeft = "320px";
		document.getElementById('addModule').style.display = 'block';
		document.getElementById('full-width-btn').style.display = 'block';
		document.getElementById('saveTocBtn').style.display = 'block';
		document.getElementById('CloseMainNav').style.display = 'block';
		document.getElementById('CloseMainNav').style.right = '-48px';
		document.getElementById("mySidenav").style.overflowX = "visible";
		

		var dataCount = $(this).attr('data-inner-topic');
		// players.play(dataCount);
		// initializeSlider(dataCount)
		// setSlideHeight();

		$('.progress').append('<input id="player_slider" class="playerslider" type="text" data-slider-min="0" data-slider-value="0" data-slider-handle="square" />');
		
		// players.
		
		

		$('.templateStyle .grid').removeClass('active');
		$('.templateStyle .column1').addClass('active');
		$('.editor-media').hide();
		setTimeout(function(){
			$('.editorsGrid .resizable-column:nth-child(1)').show();
			$('.editorsGrid .resizable-column:nth-child(2)').hide();
			$('.editorsGrid .resizable-column:nth-child(3)').hide();
		}, 10)
		$('.summernote').summernote({
			editing:true,
			toolbar: [
				// ['style', ['style']],
				['font', ['bold', 'underline']],
				// ['fontname', ['fontname']],
				// ['color', ['color']],
				['para', ['ul', 'ol', 'paragraph']],
				['table', ['table']],
				['insert', ['link', 'picture', 'video']],
				['view', ['codeview']],
			],
			hint: {
				mentions: ['jayden','sam','alvin','david'],
				match: /\B@(\w*)$/,
				search:function (keyword, callback) {
					callback($.grep(this.mentions,function (item) {				
					return item.indexOf(keyword) == 0;
					}));
				},
				content:function (item) {				
					return '@' + item;
				}
			}
		});


		

		$(document).on('change', '.imgVideoBtn:visible',function(){
			$('.imgVideoBtn:visible').each(function(){
                var vreader =  new FileReader();
                var gettingInputsId = $(this).attr('id');
				var inputs = document.getElementById(gettingInputsId);
				var getVideosId = $(this).parent().siblings('video').attr('id');
				var getImageId = $(this).parent().siblings('img').attr('id');
				
				console.log(inputs.files[0]);

				vreader.readAsDataURL(inputs.files[0])

				vreader.onload = function(){
					if(vreader.readyState == 2){
					  document.getElementById(getVideosId).src = "";
					  document.getElementById(getImageId).src = vreader.result;
					}
				}

				if(inputs.files[0].type == 'image/jpeg' || inputs.files[0].type == 'image/png'){
					// vreader.readAsDataURL(inputs.files[0])
					document.getElementById(getVideosId).src = "";
					document.getElementById(getImageId).src = vreader.result;
					
					document.getElementById(getVideosId).style.display = "none"
					document.getElementById(getImageId).style.display = "block"
					// $(getVideo).hide();
					// $(getImage).show();
				  } else if(inputs.files[0].type == 'video/mp4'){
					// vreader.readAsDataURL(inputs.files[0])
					document.getElementById(getImageId).style.display = "none"
					document.getElementById(getVideosId).style.display = "block"
					// $(getImage).hide();
					// $(getVideo).show();
					vreader.onload =  function(){
					  document.getElementById(getImageId).src = "";
					  document.getElementById(getVideosId).src = vreader.result;
					}
				  }else{
					// vreader.onload =  function(){
					//   document.getElementById(getImageId).src = "";
					//   document.getElementById(getVideosId).src = "";
					// }
					alert('This format is not supported')
				  }


				// if(inputs.files[0].type == 'video/mp4'){
				// 	vreader.readAsDataURL(inputs.files[0])
				// 	// $(getImage).hide();
				// 	// $(getVideo).show();
				// 	vreader.onload =  function(){
				// 	document.getElementById(getImageId).src = "";
				// 	document.getElementById(getVideosId).src = vreader.result;	
				// 	}
				// }
			});
		});

		(function($, window, document, undefined) {
    
			$.widget('ce.resizableGrid', {
		
				_create: function() {
					this.resizing = false;
		
					this._on({
						'mousedown .resizable-column-handle': '_resizeStartHandler',
						'mousemove': '_resizeHandler',
						'mouseup': '_resizeStopHandler',
						'mouseleave': '_resizeStopHandler'
					});
				},
		
				_init: function() {
					this._createHelpers();
				},
		
				_createHelpers: function() {
					this.element.addClass('resizable-grid');
		
					this.element.find('> .row:not(.resizable-row)').each(function(rowIndex, rowElement) {
						var row = $(rowElement);
		
						row.addClass('resizable-row');
		
						row.find('> [class^="col-"]:not(.resizable-column)').each(function(columnIndex, columnElement) {
							var column = $(columnElement);
		
							column.addClass('resizable-column');
		
							column.append(
								$('<div>', { class: 'resizable-column-handle resizable-column-handle-w', 'data-is-west': 'true' }),
								$('<div>', { class: 'resizable-column-handle resizable-column-handle-e', 'data-is-west': 'false' })
							);
						});
					});
				},
		
				_resizeStartHandler: function(event) {
					this.resizing = {};
		
					this.resizing.handle = $(event.currentTarget).addClass('resizable-column-handle-resizing');
					this.resizing.column = this.resizing.handle.closest('.resizable-column').addClass('resizable-column-resizing');
					this.resizing.row = this.resizing.column.closest('.resizable-row').addClass('resizable-row-resizing');
		
					this.resizing.handleIsWest = this.resizing.handle.data('isWest');
					this.resizing.directionIsWest = this._getResizingDirectionIsWest(event.pageX);
					this.resizing.columnSize = this._getColumnSize(this.resizing.column);
					this.resizing.siblings = this._getResizingSiblings(this.resizing.column);
					this.resizing.offsets = this._getResizingOffsets();
		
					this.element.addClass('resizable-grid-resizing');
				},
		
				_resizeHandler: function(event) {
					if (!this.resizing) {
						return;
					}
		
					this.resizing.directionIsWest = this._getResizingDirectionIsWest(event.pageX);
		
					var resizingOffsetSize = this._getResizingOffsetSize(event.pageX);
		
					if (resizingOffsetSize && (this.resizing.columnSize !== resizingOffsetSize)) {
						if (resizingOffsetSize > this.resizing.columnSize) {
							var widestColumn = this._getWidestColumn(this.resizing.siblings),
								widestColumnSize = this._getColumnSize(widestColumn);
		
							this._setColumnSize(widestColumn, (widestColumnSize - 1));
							this._setColumnSize(this.resizing.column, resizingOffsetSize);
						} else {
							var narrowestColumn = this._getNarrowestColumn(this.resizing.siblings),
								narrowestColumnSize = this._getColumnSize(narrowestColumn);
		
							this._setColumnSize(narrowestColumn, (narrowestColumnSize + 1));
							this._setColumnSize(this.resizing.column, resizingOffsetSize);
						}
		
						this.resizing.columnSize = resizingOffsetSize;
					}
				},
		
				_resizeStopHandler: function(event) {
					if (!this.resizing) {
						return;
					}
		
					this.resizing.handle.removeClass('resizable-column-handle-resizing');
					this.resizing.column.removeClass('resizable-column-resizing');
					this.resizing.row.removeClass('resizable-row-resizing');
		
					this.element.removeClass('resizable-grid-resizing');
		
					this.resizing = false;
				},
		
				_getResizingDirectionIsWest: function(x) {
					var resizingDirectionIsWest;
		
					if (!this.resizing.directionLastX) {
						this.resizing.directionLastX = x;
						resizingDirectionIsWest = null;
					} else {
						if (x < this.resizing.directionLastX) {
							resizingDirectionIsWest = true;
						} else {
							resizingDirectionIsWest = false;
						}
		
						this.resizing.directionLastX = x;
					}
		
					return resizingDirectionIsWest;
				},
		
				_getResizingSiblings: function(column) {
					return ((this.resizing.handleIsWest) ? column.prevAll() : column.nextAll());
				},
		
				_getResizingOffsetSize: function(x) {
					var that = this,
						resizingOffsetSize;
		
					$.each(this.resizing.offsets, function(index, offset) {
						if ((that.resizing.directionIsWest && ((x <= offset.end) && (x >= offset.start))) || (!that.resizing.directionIsWest && ((x >= offset.start) && (x <= offset.end)))) {
							resizingOffsetSize = offset.size;
						}
					});
		
					return resizingOffsetSize;
				},
		
				_getResizingOffsets: function() {
					var that = this,
						row = this.resizing.row.clone(),
						css = { 'height': '1px', 'min-height': '1px', 'max-height': '1px' };
		
					row.removeClass('resizable-row resizable-row-resizing').css(css);
					row.children().empty().removeClass('resizable-column resizable-column-resizing').css(css);
					this.resizing.row.parent().append(row);
		
					var column = row.children().eq(this.resizing.row.children().index(this.resizing.column)),
						totalSize = this._getColumnSize(column);
		
					this._getResizingSiblings(column).each(function() {
						totalSize += (that._getColumnSize($(this)) - 1);
						that._setColumnSize($(this), 1);
					});
		
					var size = ((this.resizing.handleIsWest) ? totalSize : 1),
						sizeEnd = ((this.resizing.handleIsWest) ? 1 : totalSize),
						sizeOperator = ((this.resizing.handleIsWest) ? -1 : 1),
						offset = 0,
						offsetOperator = ((this.resizing.handleIsWest) ? 1 : 0);
		
					var columnGutter = ((column.outerWidth(true) - column.width()) / 2),
						columnWidth = ((this.resizing.handleIsWest) ? false : true);
		
					var resizingOffsets = [];
		
					while (true) {
						this._setColumnSize(column, size);
						this._setColumnOffset(column, offset);
		
						var left = (Math.floor((column.offset()).left) + columnGutter + ((columnWidth) ? column.width() : 0));
		
						resizingOffsets.push({ start: (left + ((columnGutter * 3) * -1)), end: (left + (columnGutter * 3)), size: size });
		
						if (size === sizeEnd) {
							break;
						}
		
						size += sizeOperator;
						offset += offsetOperator;
					}
		
					row.remove();
		
					return resizingOffsets;
				},
		
				_getWidestColumn: function(columns) {
					var that = this,
						widestColumn;
		
					columns.each(function() {
						if (!widestColumn || (that._getColumnSize($(this)) > that._getColumnSize(widestColumn))) {
							widestColumn = $(this);
						}
					});
		
					return widestColumn;
				},
		
				_getNarrowestColumn: function(columns) {
					var that = this,
						narrowestColumn;
		
					columns.each(function() {
						if (!narrowestColumn || (that._getColumnSize($(this)) < that._getColumnSize(narrowestColumn))) {
							narrowestColumn = $(this);
						}
					});
		
					return narrowestColumn;
				},
		
				_getColumnSize: function(column) {
					var columnSize;
		
					$.each($.trim(column.attr('class')).split(' '), function(index, value) {
						if (value.match(/^col-/) && !value.match(/-offset-/)) {
							columnSize = parseInt($.trim(value).replace(/\D/g, ''), 10);
						}
					});
		
					return columnSize;
				},
		
				_setColumnSize: function(column, size) {
					column.toggleClass([['col', 'xs', this._getColumnSize(column)].join('-'), ['col', 'xs', size].join('-')].join(' '));
				},
		
				_getColumnOffset: function(column) {
					var columnOffset;
		
					$.each($.trim(column.attr('class')).split(' '), function(index, value) {
						if (value.match(/^col-/) && value.match(/-offset-/)) {
							columnOffset = parseInt($.trim(value).replace(/\D/g, ''), 10);
						}
					});
		
					return columnOffset;
				},
		
				_setColumnOffset: function(column, offset) {
					var currentColumnOffset,
						toggleClasses = [];
		
					if ((currentColumnOffset = this._getColumnOffset(column)) !== undefined) {
						toggleClasses.push(['col', 'xs', 'offset', currentColumnOffset].join('-'));
					}
		
					toggleClasses.push(['col', 'xs', 'offset', offset].join('-'));
		
					column.toggleClass(toggleClasses.join(' '));
				},
		
				_destroy: function() {
					this._destroyHelpers();
				},
		
				_destroyHelpers: function() {
					this.element.find('.resizable-column-handle').remove();
					this.element.find('.resizable-column').removeClass('resizable-column resizable-column-resizing');
					this.element.find('.resizable-row').removeClass('resizable-row resizable-row-resizing');
					this.element.removeClass('resizable-grid resizable-grid-resizing');
				}
			});
		
		})(jQuery, window, document);
		
		$('.grid').resizableGrid();


		//*** get id
		var topicsid = $(this).attr("id").split("-")[1];
		
		if (typeof topicsid != "undefined"){	
			//*** hide other descriptions and show yours
			$(".slide").hide();
			$("#editor-" + topicsid).show();
			$(".slide").addClass('showing')
			
		}



		
		// $("#topic-1").removeClass("show");
		// // $("li").removeClass("active");
		// $(this).addClass("active");
		// let temp = $(".sideAccordion").children();
		// var index;

		// for (let i = 0; i < temp.length; i++)
		// {
		// 	if (this == temp[i] )
		// 	{
		// 		index = i;
		// 	break;
		// 	}
		// }
		
		// $(".show").addClass("slide");
		// $(".show").removeClass("show");

		// let text_children = $("#slides").children()
		// let the_child = text_children[index];
		// $(text_children[index]).addClass("show");
		// $(text_children[index]).removeClass("slide");
	});


	$(document).on('keypress', '.innerTopics', function(){
		var inputVal = $(this).val()
		$('.topic-title').text(inputVal)
	})


	$(document).on('click', '#addLessons', function(){
		lessoncount += 1;
		$(this).siblings('ul.cd-accordion__sub.cd-accordion__sub--l1').append('<li class="cd-accordion__item cd-accordion__item--has-children" data-lesson="'+lessoncount+'"><div class="actionIcons"><span id="editLesson" class="fa fa-pencil" aria-hidden="true"></span><span id="checkLesson" class="fa fa-check" aria-hidden="true"></span><span id="deletLesson" class="fa fa-trash" aria-hidden="true"></span></div><input class="cd-accordion__input" type="checkbox" name="sub-group-'+lessoncount+'" id="sub-group-'+lessoncount+'"/> <label class="cd-accordion__label cd-accordion__label--icon-folder" for="sub-group-'+lessoncount+'"><span>lesson <input type="text" id="module-name-'+lessoncount+'" class="inputText lessonInput" value="" placeholder="REGULATORY OVERVIEW"></span><span class="textInput"></span></label> <ul class="cd-accordion__sub cd-accordion__sub--l2"></ul><button id="innerTopics" class="btn btn-warning">Add Topic</button></li>')

		return false;
	})

	// $(document).on('click', '#addTopics', function(){
	// 	topicsCount1 += 1;
	// 	$(this).parent().prepend('<li class="cd-accordion__item" data-inner-topic="'+innerTopicsCount+'"><span>Topic '+innerTopicsCount+': REGULATORY OVERVIEW</span></li>')
	// })

	$('#addModule').click( function() {
		// Add Module 
		count += 1;

		$.ajax({
			type: 'POST',
			url: 'https://jsonplaceholder.typicode.com/todos/',
			success: function(order){
				console.log('success', order);
				$.each(order, function(i, order){

				});
			}	
		});


		var newAccordion = '<li class="Modules cd-accordion__item cd-accordion__item--has-children module-'+count+'" data-module="'+count+'"><div class="actionIcons"><span id="editModule" class="fa fa-pencil" aria-hidden="true"></span><span id="checkModule" class="fa fa-check" aria-hidden="true"></span><span id="deletModule" class="fa fa-trash" aria-hidden="true"></span></div><input class="cd-accordion__input" type="checkbox" name="group-'+count+'" id="group-'+count+'"/> <label class="cd-accordion__label cd-accordion__label--icon-folder" for="group-'+count+'"><span>Module <input type="text" id="module-name-'+count+'" class="inputText" value="" placeholder="REGULATORY OVERVIEW"></span><span class="textInput"></span></label><ul class="cd-accordion__sub cd-accordion__sub--l1"><button id="addLessons" class="btn btn-warning">Add Lesson</button></ul></li>';
		demoAccordion.append(newAccordion);
		
		var ModuleSelector = document.querySelectorAll('.Modules')
		ModuleSelector.forEach(module => {
			module.classList.add('active')
			$(module).find('ul.cd-accordion__sub.cd-accordion__sub--l1').addClass('cd-accordion__sub--is-visible')			
		})
	});

	$("#EditorSecondStep .btn").hide();

	$(document).on('click','#EditorSecondStep .btn',function(){
		$(this).hide();
		document.getElementById("mySidenav").style.width = "100%";
		document.getElementById("main").style.marginLeft = "0";
		document.getElementById('addModule').style.display = 'block';
		document.getElementById('full-width-btn').style.display = 'block';
		document.getElementById('saveTocBtn').style.display = 'block';
		document.getElementById("mySidenav").style.overflowX = "visible";
		document.getElementById('CloseMainNav').style.display = 'none';
		document.getElementById('CloseMainNav').style.right = '0';

		count += 1;
		var newAccordion = '<li class="Modules cd-accordion__item cd-accordion__item--has-children module-'+count+'" data-module="'+count+'"><div class="actionIcons"><span id="editModule" class="fa fa-pencil" aria-hidden="true"></span><span id="checkModule" class="fa fa-check" aria-hidden="true"></span><span id="deletModule" class="fa fa-trash" aria-hidden="true"></span></div><input class="cd-accordion__input" type="checkbox" name="group-'+count+'" id="group-'+count+'"/> <label class="cd-accordion__label cd-accordion__label--icon-folder" for="group-'+count+'"><span>Module <input type="text" id="module-name-'+count+'" class="inputText" value="" placeholder="REGULATORY OVERVIEW"></span><span class="textInput"></span></label><ul class="cd-accordion__sub cd-accordion__sub--l1"></ul><button id="addLessons" class="btn btn-warning">Add Lesson</button></li>';
		demoAccordion.append(newAccordion);
		
		var ModuleSelector = document.querySelectorAll('.Modules')
		ModuleSelector.forEach(module => {
			module.classList.add('active')
			$(module).find('ul.cd-accordion__sub.cd-accordion__sub--l1').addClass('cd-accordion__sub--is-visible')			
		})
	});


	$(document).on('click', '.Modules', function(){
		$(this).removeClass('active');
		$(this).find('ul.cd-accordion__sub.cd-accordion__sub--l1').removeClass('cd-accordion__sub--is-visible')			
	})


	
	// Delete Lesson 
	$(document).on('click', '#deletModule', function(){
		$(this).parent().parent().remove();
	});
	
	$(document).on('click', '#deletLesson', function(){
		$(this).parent().parent().remove();
	});

	$(document).on('click', '#deletTopic', function(){
		$(this).parent().parent().remove();
	});


	// Edit text Module
	$(document).on('click', '#editModule', function(){
		$(this).hide();
		$(this).siblings('#checkModule').show();
		$(this).parent().siblings('.cd-accordion__label').find('span.textInput').hide()
		$(this).parent().siblings('.cd-accordion__label').children().find('input').show().focus();
	});

	// Edit text Lesson
	$(document).on('click', '#editLesson', function(){
		$(this).hide();
		$(this).siblings('#checkLesson').show();
		$(this).parent().siblings('.cd-accordion__label').find('span.textInput').hide()
		$(this).parent().siblings('.cd-accordion__label').children().find('input').show().focus();
	});
	
	
	// Edit text topics
	$(document).on('click', '#editTopic', function(){
		$(this).hide();
		$(this).siblings('#checkTopic').show();
		$(this).parent().siblings('span.textInput').hide();
		$(this).parent().siblings().find('input').show().focus()
	});


	// Click On Save Module
	$(document).on('click', '#checkModule', function(){
		$(this).hide();
		$(this).siblings('#editModule').show();
		var getInput = $(this).parent().siblings('.cd-accordion__label').children().find('input').hide();
		var getValue = $(this).parent().siblings('.cd-accordion__label').children().find('input').val();
		$(this).parent().siblings('.cd-accordion__label').find('span.textInput').show().html(getValue)
		if(getValue < 3){
			$(getInput).hide();
		}else{
		}
	});

	// Click On Edit Lesson
	$(document).on('click', '#checkLesson', function(){
		$(this).hide();
		$(this).siblings('#editLesson').show();
		var getInput = $(this).parent().siblings('.cd-accordion__label').children().find('input').hide();
		var getValue = $(this).parent().siblings('.cd-accordion__label').children().find('input').val();
		$(this).parent().siblings('.cd-accordion__label').find('span.textInput').show().html(getValue)
		if(getValue < 3){
			$(getInput).hide();
		}else{
		}
	});
	
	
	// Click On Edit Lesson
	$(document).on('click', '#checkTopic', function(){
		$(this).hide();
		$(this).siblings('#editTopic').show();
		$(this).parent().siblings('span.textInput').hide();
		$(this).parent().siblings().find('input').show().focus()
		var getInput = $(this).parent().siblings().find('input').hide();
		var getValue = $(this).parent().siblings().find('input').val();
		$(this).parent().siblings('span.textInput').show().html(getValue)
		if(getValue < 3){
			$(getInput).hide();
		}else{
		}
	});
	
	// Sidenav Accordion
	(function() {		
	var accordionsMenu = document.getElementsByClassName('cd-accordion--animated');	

		if( accordionsMenu.length > 0 && window.requestAnimationFrame) {
			for(var i = 0; i < accordionsMenu.length; i++) {(function(i){
				accordionsMenu[i].addEventListener('change', function(event){
					animateAccordion(event.target);
				});
			})(i);}

			function animateAccordion(input) {
				var bool = input.checked,
					dropdown =  input.parentNode.getElementsByClassName('cd-accordion__sub')[0];
				
				Util.addClass(dropdown, 'cd-accordion__sub--is-visible'); // make sure subnav is visible while animating height

				var initHeight = !bool ? dropdown.offsetHeight: 0,
					finalHeight = !bool ? 0 : dropdown.offsetHeight;

				Util.setHeight(initHeight, finalHeight, dropdown, 200, function(){
					Util.removeClass(dropdown, 'cd-accordion__sub--is-visible');
					dropdown.removeAttribute('style');
				});
			}
		}
	}());



	// Create Course

	$('#CreateNewCourse').click(function(){
		if($('#courseNameInput').val().replace(/ /g,'').length > 4 && $('#courseNameInput').val().replace(/ /g,'').length < 215){
			$('#EditorFirstStep').fadeOut(300);
			$("#main").show();
			$("#EditorSecondStep .btn").show()
			$('#courseName').text($('#courseNameInput').val());
		}
		else{
			alert('Name Should be greater then 4 and less then 214')
		}
	});

	$('#courseNameInput').keypress(function(event){
		if(event.keyCode === 13) {
			if($(this).val().length > 4 && $(this).val().length < 214){
				$("#EditorSecondStep .btn").show()
				event.preventDefault();
				$('#EditorFirstStep').fadeOut(300);
				$('#exampleModal').fadeOut(200)
				$('.modal-backdrop').fadeOut(200)
				$("#main").show();
				$('#courseName').text($('#courseNameInput').val());
			}
		}
	})
	

	// Delete Audio Captured Time
	$(document).on('click', '.delete-timer', function(){

		var getCloseer = $(this).parent().attr('data-time');
		var getSpan = $('.note-editable').find('span[data-time="' +getCloseer+ '"]');
		
		
		if($(getSpan).attr('data-time') == $(this).parent().attr('data-time')){
			$(this).parent().remove();
			$(getSpan[0]).contents().unwrap();
		}else{
			// alert('! correct')
		}
	})

	$('#getVideo').hide();
	$('#getVideo2').hide();
	$('#getVideo3').hide();

	$('.siblings.editor-media').hide()
	
		
	$('#doubleColumnSection').change(function(){
		$(this).siblings().hide()
		$('#' + $(this).val()).show()
	});
		
	$('#threeColumnSection').change(function(){
		$(this).siblings().hide()
		$('#' + $(this).val()).show()
	});
		 

    // resizeable
	// $( ".resizable" ).resizable('e');
	$('.sortable').sortable({
		handle: ".cd-accordion__label",


		start : function(event, ui) {
			var start_pos = ui.item.index();
			ui.item.data('start_pos', start_pos);
		},
		update : function(event, ui) {
			var index = ui.item.index();
			var start_pos = ui.item.data('start_pos');
			
			//update the html of the moved item to the current index
			$('#sortable li:nth-child(' + (index + 1) + ')').html(index);
			
			if (start_pos < index) {
				//update the items before the re-ordered item
				for(var i=index; i > 0; i--){
					$('#sortable li:nth-child(' + i + ')').html(i - 1);
				}
			}else {
				//update the items after the re-ordered item
				for(var i=index+2;i <= $("#sortable li").length; i++){
					$('#sortable li:nth-child(' + i + ')').html(i-1);
				}
			}
		},
		axis : 'y'
	});

	$(document).on('click','.templateStyle .grid',function(){
		var EditrorGrid = $(this).parent().parent().parent().siblings('.editorsGrid').children().find('.resizable-column[data-coulmn='+$(this).attr('data-coulmn')+']');
		var EditrorGrid2 = $(this).parent().parent().parent().siblings('.editorsGrid').children().find('.resizable-column');
		if($(this).attr('data-coulmn') === EditrorGrid.attr('data-coulmn')){
			$('.templateStyle .grid').removeClass('active');
			$(this).addClass('active');
			$('.editorsGrid .resizable-column').removeClass('active')
			$(EditrorGrid).addClass('active')
			if($(this).hasClass('column1')){
				$(EditrorGrid2[0]).removeClass('col-xs-1 col-xs-2 col-xs-3 col-xs-4 col-xs-5 col-xs-6 col-xs-7 col-xs-8 col-xs-9 col-xs-10 col-xs-11');

				$(EditrorGrid2[0]).show().addClass('col-xs-12');
				$(EditrorGrid2[1]).hide();
				$(EditrorGrid2[2]).hide();
			}else if($(this).hasClass('column2')){
				$(EditrorGrid2[0]).removeClass('col-xs-1 col-xs-2 col-xs-3 col-xs-4 col-xs-5 col-xs-6 col-xs-7 col-xs-8 col-xs-9 col-xs-10 col-xs-11');
				$(EditrorGrid2[1]).removeClass('col-xs-1 col-xs-2 col-xs-3 col-xs-4 col-xs-5 col-xs-6 col-xs-7 col-xs-8 col-xs-9 col-xs-10 col-xs-11');

				$(EditrorGrid2[0]).show().addClass('col-xs-8');
				$(EditrorGrid2[1]).show().addClass('col-xs-4');
				$(EditrorGrid2[2]).hide();
			}else{
				$(EditrorGrid2[0]).removeClass('col-xs-1 col-xs-2 col-xs-3 col-xs-4 col-xs-5 col-xs-6 col-xs-7 col-xs-8 col-xs-9 col-xs-10 col-xs-11');
				$(EditrorGrid2[1]).removeClass('col-xs-1 col-xs-2 col-xs-3 col-xs-4 col-xs-5 col-xs-6 col-xs-7 col-xs-8 col-xs-9 col-xs-10 col-xs-11');

				$(EditrorGrid2[0]).show().addClass('col-xs-4');
				$(EditrorGrid2[1]).show().addClass('col-xs-8');
				$(EditrorGrid2[2]).hide();
			}
		}
	})

	  
	  $(document).on('keypress','.inputText',function(){
		  $(this).parent().parent().siblings('.actionIcons').children('#checkModule').show();
		  $(this).parent().parent().siblings('.actionIcons').children('#editModule').hide();
	  });

	  $(document).on('click','.textInput',function(){
		$(this).parent().find('.inputText').show().focus();
		$(this).hide();
	  });



	  var curretnTimeer = "";
	  
	  $(document).on('click','.playBtn:visible', function(e) {		
		  // countplay += 1;
		  
		  var relCount = $(this).parent().attr('data-rel')
		  
		  $(this).hide();
		  $('#CaptureBtn').show();
		  // console.log($('#currentTimeDelete').html('testing'));
		  e.preventDefault();
		  play(relCount);
		  players.play();
		  
		  initializeSlider();
		  setSlideHeight();
		  
		// var audioSource = $('audio source').attr('src');
		var audioSource = $(this).parent().parent().parent().parent().siblings('audio').children().attr('src');
		var range = window.getSelection ();                                        
		if(audioSource.length != "" && range.toString().length != ""){

		if (window.getSelection) {  // all browsers, except IE before version 9
			var range = window.getSelection ();   
			if(range.toString().length != ""){
				var getTimer1 = players.currentTime;
				// var duration = players.duration;
				var hrs1 = ~~(getTimer1 / 3600);
				var mins1 = ~~((getTimer1 % 3600) / 60);
				var secs1 = ~~getTimer1 % 60;
				var ret1 = "";
				if (hrs1 > 0) {
					ret1 += "" + hrs1 + ":" + (mins1 < 10 ? "0" : "");
				}
				ret1 += "" + mins1 + ":" + (secs1 < 10 ? "0" : "");
				ret1 += "" + secs1;
				curretnTimeer = ret1
				console.log(curretnTimeer);
			}else{
			  alert('Please Select The Text')
			  players.currentTime = 0
			  players.pause()
			}
		}
		else {
			if (document.selection.createRange) { // Internet Explorer
			  var range = document.selection.createRange ();
			  alert (range.text);
			} 
		}
			// var currentTimeDelete =  document.getElementById('currentTimeDelete');
			// currentTimeDelete.innerHTML = "testing"
			
				// return false;
			}else{
				alert('Upload The Audio File or Make Selection of Text');
			}
	  });

	$(document).on('click', '#CaptureBtn:visible', function(){
		var relCount = $(this).parent().attr('data-rel')

		$(this).hide();
		$('#playBtn').show();
		players.pause()
		document.getElementById('closeTimeNav').style.display = 'none';
		document.getElementById('OpenTimeNav').style.display = 'block';

		

		var audioSource = $(this).parent().parent().parent().parent().siblings('audio').children().attr('src');
		var range = window.getSelection ();                                        
		if(audioSource.length != "" && range.toString().length != ""){
			if (window.getSelection) {  // all browsers, except IE before version 9
				var range = window.getSelection ();                                        
				if(range.toString().length != ""){
					var getTimer = players.currentTime;
					var duration = players.duration;
					var hrs = ~~(getTimer / 3600);
					var mins = ~~((getTimer % 3600) / 60);
					var secs = ~~getTimer % 60;

					var ret = "";
					if (hrs > 0) {
						ret += "" + hrs + ":" + (mins < 10 ? "0" : "");
					}

					ret += "" + mins + ":" + (secs < 10 ? "0" : "");
					ret += "" + secs;

					console.log(ret);

					var audioTimer = document.getElementById('timer'),count = 0; 
					var highlight = window.getSelection();  
					// if(getTimer > 0 && highlight.rangeCount > 0){
						players.pause();
						play(relCount)
						var selection= highlight.getRangeAt(0);
						var selectedText = selection.extractContents();
						$(audioTimer).append('<span data-time="'+ ret +'">'+ '<div class="audioDuration"><span id="currentTimeDelete">'+curretnTimeer+'</span><span>/</span><span id="audioDurationDelete">'+ret+'</span></div>'+ '<p>'+selectedText.textContent.substring(0,26)+ '.....'  +'</p>'+'<img src="images/icons/criss-cross.png" class="delete-timer"></span>')
						var span= document.createElement("span");
						span.style.backgroundColor = "yellow";
						span.setAttribute('data-time', ret);
						// span.setAttribute('id',)
						span.appendChild(selectedText);
						selection.insertNode(span);
						alert('Timer has been Capture')
					// }else{
					// alert('Audio and text should be Selected')
					// }
				}else{
				alert('Please Select The Text')
				players.currentTime = 0
				players.pause()
				}
			}
			else {
				if (document.selection.createRange) { // Internet Explorer
				var range = document.selection.createRange ();
				alert (range.text);
				} 
			}
			// var currentTimeDelete =  document.getElementById('currentTimeDelete');
			// currentTimeDelete.innerHTML = "testing"
			
				// return false;
		}else{
			alert('Upload The Audio File or Make Selection of Text');
		}

	});


	

	$(document).on('change','.AudioUpload', (event), function(){
		var files = event.target.files;
		
		var audioId = $(this).parent().siblings('audio').attr('id');
		// console.log(audioId);
		$(this).parent().siblings('audio').children('source').attr('src', URL.createObjectURL(files[0]))
		
		document.getElementById(audioId).load();
		
		// $("#src").attr("src", URL.createObjectURL(files[0]));
	})


	$(document).on('click','#CloseMainNav',function(){
		closeNav();
	});
	
	$(document).on('click','#full-width-btn',function(){
		openFull();
	});
	


	
	$(document).on('click','#OpenTimeNav',function(){
		OpenTimerNav();
	});
	
	$(document).on('click','#closeTimeNav',function(){
		closeTimerNav();
	});
	
	$(document).on('click','#SideNavigation',function(){
		openNav();
	});

	

	$(document).on('click', '.saveTopics:visible', function(){
		players.currentTime = 0
		$('.progress').children().remove();
		var doc = document.implementation.createDocument("", "", null);
		var rootElem = doc.createElement("root");

		var courseElem = doc.createElement("course");
		courseElem.setAttribute("name", $('#courseName').text());

		$(".lessonInput").each(function(){
			var LessonsElem = doc.createElement("lesson");
			LessonsElem.setAttribute("name", $(this).val());
			courseElem.appendChild(LessonsElem);
			
			$('.innerTopics').each(function(){
				var TopicsElem = doc.createElement("topics");

				TopicsElem.setAttribute("name", $(this).val());
				TopicsElem.setAttribute("data-time", "0.25" +1);
				var audioHTML = doc.createElement("audio");
				var videoHTML = doc.createElement("video");
				var imageHTML = doc.createElement("img");
				var ContentTag = doc.createElement('content')
				var paragraph = doc.createElement('para')
				var spanContent = doc.createElement('span');
				
				TopicsElem.append(audioHTML);
				TopicsElem.append(ContentTag);
				audioHTML.append('/assets/audios/M-Intro1_Slide_2.wav');
				ContentTag.append(videoHTML)
				ContentTag.append(imageHTML)
				ContentTag.append(paragraph)
				ContentTag.setAttribute('align', 'left')
				
				paragraph.append(spanContent)

				LessonsElem.appendChild(TopicsElem);
			})
		});
		rootElem.appendChild(courseElem);
		console.log(rootElem);
		var test = $('<root></root>').val()
		var blob = new Blob([rootElem.appendChild(courseElem).innerHTML], {
			type: "XML;charset=utf-8",
			autoBom: true
		}
		);
		saveAs(blob, "create.xml");
	});


	$('.saveTocBTn').click(function(){

		var getModules = document.querySelectorAll('.Modules .inputText');

		$.ajax({
			type: 'POST',
			url: 'https://jsonplaceholder.typicode.com/todos/',
			success: function(order){
				console.log('success', order);
				$.each(order, function(i, order){

				})
			}	
		})
		console.log(getModules)
		
		// getModules.forEach(mdle => {
		// 	console.log(mdle.value);
		// 	localStorage.setItem(
		// 		'Modules', JSON.stringify(mdle.value),
		// 	)
		// })
	});
})