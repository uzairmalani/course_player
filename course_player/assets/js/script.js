var player = null;
var progressBar = null;
var lessons = null;
var currentValue = 0;
var paragraphs = [];
var ticks = [];
var obj = {};
var lesson_count=0;
var course = "";
var Modules="";
$(document).ready( function(){

	 $.getJSON("http://localhost/players/course_player/get_course/1",
	  function(data){
      Modules = data['modules'];

    });
	let url = "http://localhost/players/course_player/assets/js/course2.xml";
    fetch(url).then(response=>response.text()).then( data => {
	    //let parser = new DOMParser();
	    //let xml = parser.parseFromString(data, "application/xml");
	    //obj = xmlToJson(xml); 
	    //OBJtoXML(obj);
	    let xml = $.parseXML(data);
	    obj = $(xml);


		var link ='';
		var img = '';
		var count = '';
		var center = false;

		    // Lesson Navigation
		lessons = obj.find('lesson');
		// if (lessons.length > 0) {
		// 	for(var i = 0;i < lessons.length; i++){
		// 		value = lessons[i];
	 // 			course +='<div class="option-heading"><a class="lesson" data-rel="'+i+'" href="http://localhost/players/course_player/">'
	 // 			+$(value).attr('name')+'</a></div>';
		// 		var lesson1 = $(lessons[i]);
		// 		let topics = lesson1.find('topics');
		// 		course +='<div class="option-content is-hidden">';
		// 		for(var j=0; j < topics.length; j++ ){
		// 		topic = topics[j];
		// 		course +='<a class="topics" data-lesson="'+i+'" data-topic="'+j+'" href="http://localhost/players/course_player/">'
	 // 			+$(topic).attr('name')+'</a>';
		// 		}
		// 		course +='</div>';
		// 	}
		// } else {
		// 	var lesson=lessons.prop('name');
		// 	course +='<a class="lesson" data-rel="0" href="http://localhost/players/course_player/">'
		// 	+lesson+'</a>';
		// }

		console.log(Modules);
		if(Array.isArray(Modules)){
			for(var i = 0;i < Modules.length; i++){
	  		course +='<div class="option-heading"><i class="fa fa-angle-down" aria-hidden="true"></i><a class="lesson" data-rel="0" href="http://localhost/players/course_player/">'
	 		+Modules[i].name+'</a></div>';
	 		course +='<div class="option-content is-hidden">';
	 		if(Modules[i].lessons){
	 		SelectTopics(Modules[i],i);
	 		SelectLesson(Modules[i],i);
	 		}else{
			SelectTopics(Modules[i],i);	 		
			}
	 		course += '</div>';	
	 	}

		}else{
		 course +='<div class="option-heading"><i class="fa fa-angle-down" aria-hidden="true"></i><a class="lesson" data-rel="0" href="http://localhost/players/course_player/">'
	 		+Modules.name+'</a></div>';
	 		course +='<div class="option-content is-hidden">';
	 		if(Modules.lessons){
	 		console.log(Modules)
	 		SelectTopics(Modules,0);
	 		SelectLesson(Modules,0);
	 		}else{
			SelectTopics(Modules,0);	 		
			}
	 		course += '</div>';

	 	}


	 // 		var Lesson=Modules.lessons;
	 // 		if(Array.isArray(Lesson)){
	 // 			course +='<div class="option-content is-hidden">';
	 // 			for(var i = 0;i < Lesson.length; i++){
	 // 				var lesson_name = Lesson[i].name;
	 // 				if(lesson_name==""){
	 // 					var topics = Lesson[i].topic;
		// 				 for(var j = 0;j < topics.length; j++){
		// 				 	var topic_name =topics[j];
 	// 						course +='<a class="topics" data-lesson="'+i+'" data-topic="'+j+'" href="http://localhost/players/course_player/">'
	 // 	 				 	+topic_name+'</a>';

		// 				 }
	 // 				}
	 // 				course += '<div class="option-lesson">';
	 // 				course +='<a class="Lesson" data-lesson="'+i+'" href="http://localhost/players/course_player/">'
	 // 	 			+lesson_name+'</a>';
	 // 	 			course += '</div>';
	 // 			}
	 // 			course +='</div>';
	 // 		}else{
	 // 			course +='<div class="option-content is-hidden">';
	 // 			course +='<a class="topics" data-lesson="'+i+'" data-topic="'+j+'" href="http://localhost/players/course_player/">'
	 // 	 				 	+lesson_name+'</a>';
	 // 	 		course +='</div>';

	 // 		}
	 		

		//}
		

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

function SelectLesson(Module,i){
	var Lessons = Module.lessons;

	if(Array.isArray(Lessons)){	
	 	for(var j = 0;j < Lessons.length; j++){
	 	course += '<div class="option-lesson">';
	 	var count = j+1;
	  	course +='<i class="fa fa-plus-square" aria-hidden="true"></i><a class="lesson" data-module="'+i+'" data-rel="'+count+'" data-lesson="'+j+'" href="http://localhost/players/course_player/">'
	  	 			+Lessons[j].name+'</a>';
	  	course += '<div class="option-topics is-hidden">';
	  	SelectTopics(Lessons[j],j)
	  	course += '</div>';
	  	course += '</div>';
	 	}

	}else{
		console.log(Lessons);
	 	course += '<div class="option-lesson">';
	  	course +='<i class="icon-plus icon-white"></i><a class="lesson" data-module="'+i+'" data-lesson="0" href="http://localhost/players/course_player/">'
	  	 			+Lessons.name+'</a>';
	  	 course += '</div>';

	}
}
function SelectTopics(lesson,i){
	var Topics= lesson.topic;
	if(Array.isArray(Topics)){
	 	for(var j = 0;j < Topics.length; j++){
	  		course +='<a class="topics" data-lesson="'+i+'" data-topic="'+j+'" href="http://localhost/players/course_player/">'
	 		+Topics[j]+'</a>';	
	 	}
	 	
	} else {
	  	course +='<a class="topics" data-lesson="'+i+'" data-topic="1" href="http://localhost/players/course_player/">'
	 		+Topics+'</a>';	
	}
}


$(document).on('click', '.option-heading', function(e){
	e.preventDefault()
 $(this).toggleClass('is-active').next(".option-content").stop().slideToggle(500);
 $(this).find('i').toggleClass('fa-angle-down fa-angle-up', 1500)
});

$(document).on('click', '.option-lesson', function(e){
	e.preventDefault()
 $(this).toggleClass('is-active').find(".option-topics").stop().slideToggle(500);
  $(this).find('i').toggleClass('fa-plus-square fa-minus-square', 1500)

 

});
$(document).on('click', '.lesson', function(e){
	e.preventDefault()
	var i = $(this).data('rel');
	console.log(i)
	$('#player-container').html("");
	$('.slides').html("");

	getLesson(i);
	$('.play-narration i').removeClass('fa-pause-circle').addClass('fa-play-circle');
	
	play(0);

	setTimeout(function() {
        player.play();
    	$('.play-narration i').addClass('fa-pause-circle').removeClass('fa-play-circle');}, 2000);

	$('.player0').on('canplaythrough', function(e) {
		var duration=$(this).duration;
		duration = Math.round(duration);

		$('.start-time').text('0:00');
		currentValue = 0;
		initializeSlider(duration, [], 0);
	});
	
	

	return false;
});


function play(count){
	var count = count;
	player = $('.player'+count+'')[0];
	

	$(player).on('canplaythrough', function(e) {
		var duration=player.duration;
		duration = Math.round(duration);
		
		if(progressBar == null && $('#player_slider').length > 0) {
			initializeSlider(duration, [], 0);
		
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
			//var time = parseFloat((player.currentTime / 100).toFixed(2));
			var time1 = player.currentTime;
			var mins = ~~((time1 % 3600) / 60);
    		var secs = ~~time1 % 60;
    		var ret = "";
    		ret += "" + mins + "." + (secs < 10 ? "0" : "");
    		ret += "" + secs;
    		ret = parseFloat(ret);

			// if(parseFloat(time % 0.60) == 0){

		 //  	time = parseFloat(((time % 0.60) + (++count)).toFixed(2));
		 //  	// console.log(time);
			// }
			if(ret < para.min || ret > para.max)
				return;



			// if($('.quest:visible').find('li')){
			// $('.quest:visible').find('span[data-time]').removeClass('bg-info');
			// $('.quest:visible').find('span[data-time="' + para.max + '"]').addClass('bg-info');
			// $('.slide-section:visible').find('.quest:visible').find('span[data-time]').removeClass('bg-info');
			// $('.slide-section:visible').find('.quest:visible').find('span[data-time="' + para.max + '"]').addClass('bg-info');
			// }
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

	player.onended = function() {
		
		$('.play-narration i').removeClass('fa-pause-circle').addClass('fa-play-circle');
		var length1 = $('.slide_'+count+'').next().length;

		if(length1 > 0) {
			$('.slide_'+count+'').fadeOut('fast');
		$('.slide_'+count+'').hide();
		$('.slide_'+count+'').next().show( "slide", {direction: "right" }, 2000 );

		paragraphs = [];
		play(count+1);
		progressBar.bootstrapSlider('setValue',0);
		setTimeout(function() {
        player.play();
    	$('.play-narration i').addClass('fa-pause-circle').removeClass('fa-play-circle');}, 2000);
		
		var duration= $('.player'+count+'').duration;
		$('.start-time').text('0:00');
		currentValue = 0;
		initializeSlider(duration, [], 0);
		}else{
			$('.popup-inner h1').html("");
			$('[data-popup="popup-1"]').fadeIn(350);
			$('.popup-inner').prepend("<h1>Thankyou</h1>");
			$('[data-popup-close]').on('click', function(e) {			
			$('[data-popup="popup-1"]').fadeOut(350);
			e.preventDefault();
			});
		}
	}

	setSlideHeight();
	$(window).resize(function() {
		setSlideHeight();
	});
	setNarration();
}



function getLesson(index){
	var lesson1 = $(lessons[index]);
	// Main Topics view
	let topics = lesson1.find('topics');
	if (topics.length > 0) {
		for (i = 0; i < topics.length; i++) {	
			multipleTopic(topics[i], i);
		}
	} else {
		//quest +='<h2  id=Question>'+topics+'</h2>';  
		multipleTopic(topics, 0);		
	}
}

function setNarration(){
	var minTime = 0;
	$('.slide-section:visible span[data-time]').each(function() {
		var max = parseFloat($(this).attr('data-time'));
		paragraphs.push({min:minTime,max: max});
		minTime = max;
	});
}

// creating topic div from json
function multipleTopic(topic, i){
	var count= i, aContent=[], link ='', img = '', center=false, questCenter='';
	let t = $(topic);
	let name = t.attr('name');
	let time = t.attr('data-time');
	var quest ='<h2 data-time="" class="heading"><span data-time="'+time+'">'+name+'</span></h2>';
	let content = t.find('content'); 
		if (content.length > 0) {
			for(var cont of content){
				aContent = getContent(cont, count);
				quest += aContent[0];
				link = aContent[1];
				img = aContent[2];
			}
		} else {
			aContent = getContent(content, count)
			quest += aContent[0];
			link = aContent[1];
			img = aContent[2];

		}

	var row = "<div class='container-fluid slide_"+count+" slide-section'>"
		row +="	  <div class='p-4'>"
		row +="     <div class='row'>"
		row	+= "      <div class='col-md-8 slide-text-content quest' id='quest'></div>"
		row	+= "      <div class='col-md-4 text-center' id='img'></div>"
		row +="       <div class='col-md-12 text-content center' id='center'></div>"
		row +="     </div>"
		row +="   </div>"
		row +="</div>"

	$('.slides').append(row);
	$('.slide_0').nextAll().hide();

	

	$('.slide_'+count+'').find('.quest').prepend(quest);
	if(link){
		$('.slide_'+count+'').find('.quest').append(link);
	}
	$('.slide_'+count+'').find('#img').html(img);

	if($('.slide_'+count+'').find(".align_center").length){
		$('.slide_'+count+'').find('.quest').remove();
		$('.slide_'+count+'').find('#img').remove();
		$('.slide_'+count+'').find('#center').html(quest);
		if(img){
		$('.slide_'+count+'').find('#center').html(img);
		}
	}

	if($('.slide_'+count+'').find(".align_right").length){
	    var newrow	 = "<div class='col-md-4 text-center' id='img'></div>"
			newrow	+= "<div class='col-md-8 slide-text-content quest' id='quest'></div>"
		$('.slide_'+count+'').find('.row').html(newrow)

	if(quest){
		$('.slide_'+count+'').find('.quest').prepend(quest);
	}
	if(link){
		$('.slide_'+count+'').find('.quest').append(link);
	}
	$('.slide_'+count+'').find('#img').html(img);
	}

	
	SelectPlayer(topic ,count)
}

function SelectPlayer(topics ,i){
var count= i
	let t = $(topics);
	let vid = t.find('video');
	if(vid.length){
 		var Video = vid.html();
 		var video ='<video  class="player'+count+'">';
		video +='<source src="'+Video+'" type="video/webm;codecs=vp8,vorbis"/>';
		video +='</video>';
		$('.slide_'+count+'').find('#center').append(video);
	}
	let aud = t.find('audio');

	if (aud.length) {
 		var Audio=aud.html();
 		var audio ='<audio class="player'+count+'">';
		audio +='<source src="'+Audio+'" type="audio/mp3">'
		audio +='</audio>';
		$('#player-container').append(audio);
	} 

}

//Dispay Content
function makeContent(value, align, quest, link){
	var v = $(value);
	let time = v.attr('data-time');
	let span = v.find('span');;
 	if(v.attr('type')=='text'){
 		quest +='<span class="align_'+align+'"  data-time="'+time+'">';
 		quest +=span.html();
 		quest +='</span>';
 	}
 	if(v.attr('type')==='link'){
 		link +='<span data-time="'+time+'"><a href="'+v.find('link')+'">'+span+'</a></span>'
 	}
 	return [quest,link]
}

// creating content from json
function getContent(cont, count){
	var align = "", quest = '', link = '', img = '';
	var cont = $(cont);
	align = cont.attr('align');
	var par = cont.find('par');
	var image = cont.find('img');
	if(par.length){
		
		if (par.length > 0){
			for(var value of par){
	 			[quest, link] = makeContent(value, align, quest, link);

		 	}
		} else {
		 	[quest, link] = makeContent(par[0], align, quest, link);
		}
	}
	if(image.length > 0){
		var img1=image.attr('src');
	 	img +='<img src="'+img1+'" class="img-fluid img-thumbnail">'
	}
	
	return [quest,  link, img];
}

function initializeSlider(duration, ticks, value) {

	progressBar = $('#player_slider').bootstrapSlider({
		min: 0,
		max: Math.round(player.duration),
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
			$('.start-time').text(value);
		    player.currentTime = event.value.newValue;
		    if(player.paused === false)
		    	playPausePlayer();
		//}
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