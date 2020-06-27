var player = null;
var progressBar = null;
var currentValue = 0;
var paragraphs = [];
var ticks = [];
var obj = {};
var course = "";
$(document).ready( function(){
	let url = "http://localhost/players/course_player/assets/js/course.xml";
    fetch(url).then(response=>response.text()).then( data => {
    let parser = new DOMParser();
    let xml = parser.parseFromString(data, "application/xml");
    obj = xmlToJson(xml);
		
		var link ='';
		var img = '';
		var count = '';
		var center = false;

		// Lesson Navigation
		if (Array.isArray(obj.root.course.lesson) == true) {
			for(var i = 0;i < obj.root.course.lesson.length; i++){
				value = obj.root.course.lesson[i]
	 			course +='<a class="lesson" data-rel="'+i+'" href="http://localhost/players/course_player/">'
	 			+value['@attributes'].name+'</a>';
			}
		} else {
			var lesson=obj.root.course.lesson["@attributes"].name;
			course +='<a class="lesson" data-rel="0" href="http://localhost/players/course_player/">'
			+lesson+'</a>';
			obj.root.course.lesson = [obj.root.course.lesson];
		}

		$('.sidenav').prepend(course);

		getLesson(0);
 	
 		play(0);
 	});

	$('.sidenav').resizable({
		minWidth: '250',
		handles: 'e, w',
		animate: false,
		animateEasing: 'none',
		stop: function(event, ui) {
			$('#main').css('margin-left',ui.size.width + 'px');
		}
	});
});

$(document).on('click', '.lesson', function(){
	var i = $(this).data('rel');

	multipleTopic(lesson1.topics[i], i);
});

function play(count){
	var count = count;
	player = $('.player'+count+'')[0];
	//console.log(player.duration);
	

	

	$(player).on('canplaythrough', function(e) {
		var duration=player.duration;
		duration = Math.round(duration);
		//console.log(duration)		
		if(progressBar == null && $('#player_slider').length > 0) {
			initializeSlider(duration, [], 0);
			//console.log(duration)
		}
		
	});
	player.ontimeupdate = function() {
		jQuery(".end-time").html(fancyTimeFormat(player.duration));
		jQuery(".start-time").html(fancyTimeFormat(player.currentTime));
		if(player.currentTime > currentValue)
			currentValue = player.currentTime;
		if(progressBar != null)
			progressBar.bootstrapSlider('setValue',player.currentTime);
		$.each(paragraphs, function(i,para) {
			var time = player.currentTime / 100;
			if(time < para.min || time > para.max)
				return;
			$('.quest').find('span[data-time]').removeClass('bg-info');
			$('.quest').find('span[data-time="' + para.max + '"]').addClass('bg-info');
		});
	}

	player.onended = function() {
		
		$('.play-narration i').removeClass('fa-pause-circle').addClass('fa-play-circle');

		$('.slide_'+count+'').fadeOut('fast');
		$('.slide_'+count+'').next().fadeIn('slow');
		
		play(count+1);
		var duration= $('.player'+count+'').duration;
		//console.log(duration);
		$('.start-time').text('0:00');
		initializeSlider(duration, [], 0);

	}

	setSlideHeight();
	$(window).resize(function() {
		setSlideHeight();
	});
	setNarration();
}



function getLesson(index){
	var lesson1 = obj.root.course.lesson[index];
	// Main Topics view
	if (Array.isArray(lesson1.topics)== true) {
		for (i = 0; i < lesson1.topics.length; i++) {	
			multipleTopic(lesson1.topics[i], i);
		}
	} else {
		var topics=lesson1.topics["@attributes"].name;
		quest +='<h2  id=Question>'+topics+'</h2>';  
		multipleTopic(lesson1.topics, 0);		
	}
}

function setNarration(){
	var minTime = 0;
	$('.slide-text-content span[data-time]').each(function() {
		var max = parseFloat($(this).attr('data-time'));
		paragraphs.push({min:minTime,max: max});
		minTime = max;
	});
}

// creating topic div from json
function multipleTopic(topic, i){
//	console.log(topic["@attributes"].name)
	
	var count= i, aContent=[], link ='', img = '', center=false, questCenter='';
	var quest ='<h2 class="heading">'+topic["@attributes"].name+'</h2>';
	if(topic.content !== undefined){
		if (Array.isArray(topic.content)== true) {
			for(var cont of topic.content){
				aContent = getContent(cont, count);
				quest += aContent[0];
				link += aContent[1];
				img += aContent[2];
				center += aContent[3];
				questCenter += aContent[4];
				console.log(center);
			}
		} else {
			aContent = getContent(topic.content, count)
			quest += aContent[0];
			link += aContent[1];
			img += aContent[2];
			center += aContent[3];
			questCenter += aContent[4];
		}
	}
	console.log(questCenter);

	var row = "<div class='container-fluid slide_"+count+" slide-section'>"
		row +="	  <div class='p-4'>"
		row +="     <div class='row'>"
		row	+= "      <div class='col-md-8 slide-text-content quest' id='quest'></div>"
		row	+= "      <div class='col-md-4 text-center' id='img'></div>"
		row +="       <div class='col-md-12 text-content' id='center'></div>"
		row +="     </div>"
		row +="   </div>"
		row +="</div>"
	$('.slides').append(row);
	$('.slide_0').nextAll().hide();
	if(quest)
		$('.slide_'+count+'').find('.quest').prepend(quest);
	if(link){
		$('.slide_'+count+'').find('.quest').append(link);
	}
	$('.slide_'+count+'').find('#img').html(img);
	
	SelectPlayer(topic ,count)
}

function SelectPlayer(topics ,i){
var count= i
//console.log(topics);
	if(topics.video !== undefined && topics.video){
 		var Video = topics.video;
 		var video ='<video  class="player'+count+'">';
		video +='<source src="'+Video+'" type="video/webm;codecs=vp8,vorbis"/>';
		video +='</video>';
		$('.slide_'+count+'').find('#center').append(video);
	}

	if (topics.audio !== undefined && topics.audio) {
 		var Audio=topics.audio;
 		var audio ='<audio class="player'+count+'">';
		audio +='<source src="'+Audio+'" type="audio/mp3">'
		audio +='</audio>';
		$('#player-container').append(audio);
	} 

}

// creating content from json
function getContent(cont, count){
	var align = "", quest = '', link = '', img = '', questCenter='',
	
	align = cont["@attributes"].align;
	if(align == 'left'){
	 	for(var value of cont.par){
		 	var time=value["@attributes"].time;
		 	if(value["@attributes"].type=='text'){
		 		quest +='<span  data-time="'+time+'">'+value.span+'</span>';
		 	}
		 	if(value["@attributes"].type=='link'){
		 		link +='<span data-time="'+time+'"><a href="'+value.link+'">'+value.span+'</a></span>'
		 	}
	 	}
	 }
	if(align == 'right'){	
	 	var img1=cont.img["@attributes"].src;
	 	img +='<img src="'+img1+'" class="img-fluid img-thumbnail">' 	
	}
	if(align == 'center'){
	 	 
	 	
	 	 
	 	for(var value of cont.par){
	 		var time=value["@attributes"].time;
	 		if(value["@attributes"].type=='text'){
	 			questCenter +='<span  data-time="'+time+'">'+value.span+'</span>';
	 		}
	 		if(value["@attributes"].type=='link'){		 		
	 			link +='<span data-time="'+time+'"><a href="'+value.link+'">'+value.span+'</a></span>'
	 		}
	 	}
	 
	}

	
	
	return [quest, link, img, questCenter];
}

function initializeSlider(duration, ticks, value) {
	//console.log(Math.round(duration));
	progressBar = $('#player_slider').bootstrapSlider({
		min: 0,
		max: Math.round(player.duration),
		tooltip: 'hide',
		step: 0.000001,
		ticks: ticks,
		value: value
	}).on('change',function(event) {
		if(event.value.newValue > currentValue) {
			event.stopPropagation();
			var value = fancyTimeFormat(event.value.oldValue);
			$('.start-time').text(value);
			progressBar.bootstrapSlider('setValue',event.value.oldValue);
			return false;
		}
		else {
			var value = fancyTimeFormat(event.value.newValue);
			$('.start-time').text(value);
		    player.currentTime = event.value.newValue;
		    if(player.paused === false)
		    	playPausePlayer();
		}
	});
}

function setSlideHeight() {
	var totalHeight = $(window).height();
	var height = totalHeight - ($('.navbar').outerHeight() + $('.progressbar-section').outerHeight() + 25);
	$('.slide-section').css('min-height',height + 'px');
}

function fancyTimeFormat(time)
{   
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

$(document).on('click','.open-sidenav', function(e) {
	e.preventDefault();
	var isOpened = $(this).hasClass('open');
	var width = '0';
	if(!isOpened)
		width = '250px';
	$('.sidenav').css('width',width);
	$('#main').css('margin-left',width);
	$(this).toggleClass('open');
	return false;
});

$(document).on('click','.sidenav .closebtn', function(e) {
	e.preventDefault();
	$('.open-sidenav').trigger('click');
	return false;
});

$(document).on('click','.play-narration', function(e) {
	e.preventDefault();
	playPausePlayer();
	return false;
});

function playPausePlayer() {
	if(player.paused === false) {
		player.pause();
		$('.play-narration i').removeClass('fa-pause-circle').addClass('fa-play-circle');
	}
	else {
		player.play();
		$('.play-narration i').removeClass('fa-play-circle').addClass('fa-pause-circle');
	}
}

$(document).on('submit','.search-form', function(e) {
	e.preventDefault();
	var search = $('input[type="search"]').val();
	$('.btn-clear-search').addClass('hide');
	if(search != '') {
		ticks = [];
		clearSearch();
		$('.slide-section:visible .slide-text-content').html($('.slide-section:visible .slide-text-content').html().replace(new RegExp('(' + search + ')', 'ig'),'<span class="highlighted bg-danger">$1</span>'));
		$('.slide-section:visible .slide-text-content .highlighted').each(function() {
			if($(this).parents('span[data-time]').length > 0) {
				var tick = parseFloat($(this).parents('span[data-time]').attr('data-time')) * 100;
				if(ticks.indexOf(tick) == -1)
					ticks.push(tick);
			}
		});
		if(ticks.length > 0) {
			progressBar.bootstrapSlider('destroy');
			initializeSlider(Math.round(player.duration), ticks, currentValue);
		}
	}
	else {
		clearSearch();
		if(ticks.length > 0) {
			ticks = [];
			progressBar.bootstrapSlider('destroy');
			initializeSlider(Math.round(player.duration), ticks, currentValue);
		}
	}
	
	return false;
});

function clearSearch() {
	var html = $('.slide-section:visible .slide-text-content').html();
	$('.slide-section:visible .slide-text-content .highlighted.bg-danger').each(function() {
		var text = $(this).text();
		html = html.replace('<span class="highlighted bg-danger">' + text + '</span>',text);
	});
	$('.slide-section:visible .slide-text-content').html(html);
}

$(document).on('hide', function() {
	if(player != null && !player.paused)
		playPausePlayer();
});

  	// $(document).ready(function(){
  		
  	// 	 $.getJSON('http://localhost/players/course_player/assets/js/course.xml',function(data){
  	// 	 	var course ='';
  	// 			var quest ='';
  	// 			var img = '';
  	// 		$.each(data, function(key, value){
  	// 			$.each(value, function(key, value){
  	// 			course +='<a href="http://localhost/players/course_player/">'+value.lesson_name+'</a>';
  	// 			quest +='<h2>'+value.Question+'</h2>';
			// 	quest +='<p>';
			// 		$.each(value.paragraph, function(key, value){
			// 		quest +='<span class="" data-time="'+value.time+'">'+value.text+'</span>';
			// 		});
			// 	quest +='</p>';
			// 	img +='<img src="'+value.image+'" class="img-fluid img-thumbnail">'
  	// 			});
  	// 		});
  	// 		$('.sidenav').prepend(course);
  	// 		$('#quest').html(quest);
  	// 		$('#img').html(img);

  	// 	 // });
			// });
  	// });
			//});

//});