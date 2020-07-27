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
var coruse_toc;
var courseID;
var getTrackid="";
var getTracktime;
//var base_url= window.location.href +"assets/js/";
var base_url= 'http://player.ljwebmgmt.com/'
var url = base_url+"/assets/js/module0.xml";
var link ='';
var img = '';
var count = '';
var center = false;

var CourseTable =  $('#CourseList tbody');
	$.ajax({
		type: 'GET',
		url: base_url+"/viewcourse",
		success: function(list){
			var CourseData = JSON.parse(list)
			CourseData.forEach(course => {
				$('#CourseList tbody').append('<tr><td><a href="'+base_url+'player" data-rel="'+course.id+'" class="playCourse">'+course.course_name+'</a><td>'+course.course_category+'</td><td>'+course.modified_date+'</td><td>'+course.publish_date+'</td></tr>');
			})
		}
	});

$(document).on('click','.playCourse', function(){
	courseID = $(this).attr('data-rel');
	localStorage.setItem("courseId", courseID);


});

	
	function tracking(){
		var topics = $(".slides").find('.container-fluid').not(":hidden").attr("topics");
		var content = $('.slides').find('.container-fluid').not(":hidden").attr("parent");
		var topicID= $('#mySidenav').find("div[parent="+content+"]").find("a[data-topic="+topics+"]").attr('topic-id');
		var current_time = player.currentTime;
		var duration = player.duration;
		var completed =$('.slides').find('.container-fluid').not(":hidden").attr('completed');
		if(current_time === undefined){
			current_time = 0;
		}
		if(completed === undefined){
			completed = 0;
		}

		$.ajax({
     		type: 'POST',
    		url: base_url+"/user_tracking",
			data:{
			courseid:courseID,
			topicid:topicID,
			durations:duration,
			currenttime:current_time,
			is_completed:completed
			},
			success: function(resultData) {
			// alert(resultData)
			  }
		});
		// $.getJSON(base_url+"/user_tracking/"+courseID+"/"+topicID+"/"+current_time+"/"+duration+"/"+completed,
		// 	function(data){
			  
		// });
	}

	//fetching TOC
	function fetchingTOC(ID){
	// $.getJSON(base_url+"/user_tracking/"+courseID+"/1/null/null/0",
	// 	function(data){
		

 //    });

	$.getJSON(base_url+"/get_topic/"+courseID,
		function(data){
		    Modules = data['modules'];   	

    });
	}

	

	//display TOC
	function selectModule (Module){
		var Modules = Module;
		if(Array.isArray(Modules)){
			for(var i = 0;i < Modules.length; i++){
	  			course +='<div content="module-'+Modules[i].id+'" class="contents option-heading "><i class="fa fa-angle-down" aria-hidden="true"></i><a class="lesson"  data-module="'+i+'" data-rel="'+i+'" href="'+window.location.href+'">'
	 			+Modules[i].name+'</a></div>';
	 			course +='<div parent="module-'+Modules[i].id+'" class="option-content is-hidden">';
	 		if(Modules[i].lessons){
	 			SelectTopics(Modules[i],i,"modules");
	 			SelectLesson(Modules[i],i);
	 		}else{
				SelectTopics(Modules[i],i,"modules");	 		
			}
	 		course += '</div>';	
	 		}
		}else{
		 	course +='<div content="module-'+Modules.id+'" class="contents option-heading"><i class="fa fa-angle-down" aria-hidden="true"></i><a class="lesson" data-module="0" data-rel="0" href="'+window.location.href+'">'
	 		+Modules.name+'</a></div>';
	 		course +='<div parent="lesson-'+Modules.id+'" class="option-content is-hidden">';
	 		if(Modules.lessons){
	 			SelectTopics(Modules,0,"modules");
	 			SelectLesson(Modules,0);
	 		}else{
				SelectTopics(Modules,0,"modules");	 		
			}
	 		course += '</div>';
		}

	}
	function activeClass(){
		var topics = $(".slides").find('.container-fluid').not(":hidden").attr("topics");
		var content = $('.slides').find('.container-fluid').not(":hidden").attr("parent");
		$('#mySidenav').find("div").find("a").removeClass('active');
		$('#mySidenav').find("div[parent="+content+"]").children("a[data-topic="+topics+"]").addClass('active');
		$('.option-topics').find('.active').parent().siblings('.contents').addClass('is-active');
		$('.option-topics').find('.active').parent().css('display' , 'block');
		$('.option-topics').find('.active').parent().siblings('.option-lesson').parent('.option-content').css('display' , 'block');

	}
	function startplayer(){
		courseID = localStorage.getItem("courseId");
		fetchingTOC(courseID);
		 $.getJSON(base_url+"/get_user_tracking/"+courseID+"/1",
			function(data){
				
			  getTrackid = parseInt(data['topic_id']);
			  getTracktime =parseFloat(data['current_time']);

			//  console.log(topic);
			// console.log($('#mySidenav').find("div").children("a").remove()); 

		});

		
		//getLesson(url,0,'module-1');

		 setTimeout(function() {
		 	selectModule(Modules);

		// 	player = $('.player0').find('source').attr("data-rel");
		// 	$('.player0').find('source').attr("src",player);
		
		 },600);

		setTimeout(function() {
			$('.sidenav').prepend(course);
			$('#mySidenav').find("div").children("a[topic-id="+getTrackid+"]").trigger('click'); 
			//play(0);
			activeClass();
			
			;},700);

		// setTimeout(function() {
	
		// 	player.load();
		// 	//player.play();
		// },800);

		$('.sidenav').resizable({
			minWidth: '250',
			handles: 'e, w',
			animate: false,
			animateEasing: 'none',
			stop: function(event, ui) {
				$('#main').css('margin-left',ui.size.width + 'px');
			}
		});
	}


	function SelectLesson(Module,i){
		var Lessons = Module.lessons;
		if(Array.isArray(Lessons)){	
		 	for(var j = 0;j < Lessons.length; j++){
		 		course += '<div  content="lesson-'+Lessons[j].id+'" class="contents option-lesson">';
		 		var count = j+1;
		  		course +='<i class="fa fa-plus-square" aria-hidden="true"></i><a class="lesson" data-module="'+i+'" data-rel="'+count+'" data-lesson="'+j+'" href="'+base_url+'">'
		  	 			+Lessons[j].name+'</a></div>';
		  		course += '<div parent="lesson-'+Lessons[j].id+'" class="option-topics is-hidden">';
		  		SelectTopics(Lessons[j],j,"lesson")
		  		
		  		course += '</div>';
		 	}
		}else{
		 	course += '<div content="lesson-'+Lessons[j].id+'" class="contents option-lesson">';
		  	course +='<i class="icon-plus icon-white"></i><a class="lesson" data-module="'+i+'" data-lesson="0" href="'+base_url+'">'
		  	 			+Lessons.name+'</a></div>';
		  	

		}
	}
	
	function SelectTopics(lesson,i, parent){
		var parent = parent;
		var Topics= lesson.topic;
		if(Array.isArray(Topics)){
		 	for(var j = 0;j < Topics.length; j++){
		  		course +='<a   class="topics" topic-id="'+Topics[j].id+'" data-'+parent+'="'+i+'" data-topic="'+j+'" href="#">'
		 		+Topics[j].name+'</a>';	
		 	}
		 	
		} else {
		  	course +='<a class="topics" data-'+parent+'="'+i+'" data-topic="1" href="#">'
		 		+Topics.name+'</a>';	
		}
	}
	$(document).on('click', '.option-heading', function(e){
		e.preventDefault()
	 	$(this).toggleClass('is-active').next(".option-content").stop().slideToggle(500);
	 	$(this).find('i').toggleClass('fa-angle-down fa-angle-up', 1500)
	});

	$(document).on('click', '.option-lesson', function(e){
		e.preventDefault()
	 	$(this).toggleClass('is-active').next(".option-topics").stop().slideToggle(500);
	 	$(this).find('i').toggleClass('fa-plus-square fa-minus-square', 1500)
	});


	$(document).on('click', '.topics', function(e){
	 	e.preventDefault()
	 	var modules =parseInt($(this).attr('data-modules'));
	 	var lesson =parseInt($(this).attr('data-lesson'));
	 	var topic =parseInt($(this).attr('data-topic'));
	 	var xmlLesson="";
	 	var content;
	 	$('#player-container').html("");
		$('.slides').html("");

		content = $(this).parent().attr('parent');
		if($(this).attr('data-modules')){
			//content = $(this).parent().siblings(".contents").attr('content');
	  		xmlLesson=base_url+"assets/js/"+Modules[modules].xml;
	  			
	 	}else{
	 		//content = $(this).parent().parent(".contents").attr('content');
	 		var modulesss = $(this).parent().siblings().find('.lesson').attr('data-module');
	 		xmlLesson=base_url +"assets/js/"+ Modules[modulesss].lessons[lesson].url;
			
		}
			getLesson(xmlLesson,topic,content);
		
			
		$('.play-narration i').removeClass('fa-pause-circle').addClass('fa-play-circle');
		setTimeout(function() {
		player = $('.player'+topic+'').find('source').attr("data-rel");
		$('.player'+topic+'').find('source').attr("src",player);

		},3000);	


		setTimeout(function() {
		play(topic);
		},3100);
		
		setTimeout(function() {
		player.load();
	    }, 3300);
		setTimeout(function() {
			var value = fancyTimeFormat(getTracktime);
			console.log(value);
			$('.start-time').text(value);
			//progressBar.bootstrapSlider('setValue',getTracktime);
			currentValue = getTracktime;
			//progressBar.bootstrapSlider('destroy');
			initializeSlider(Math.round(player.duration), ticks, currentValue);
			progressBar.bootstrapSlider('setValue',currentValue);
			player.currentTime = currentValue;
			//initializeSlider(null, [], getTracktime);
			//player.play();
			activeClass();
		},3550);

		return false;

	});

	$(document).on('click', '.lesson', function(e){
		e.preventDefault()
		var i = $(this).data('rel');
		var imodules = $(this).attr('data-module');
		var xmlLesson =""
		var content = $(this).parent().attr('content');

		if($(this).attr('data-lesson')){
		var ilesson = $(this).attr('data-lesson');
		xmlLesson=base_url +"assets/js/" +Modules[imodules].lessons[ilesson].url;
		getLesson(xmlLesson,0,content);
		}else{

		xmlLesson=base_url+"assets/js/"+Modules[imodules].xml;
		getLesson(xmlLesson,0,content);
		}
		
		$('#player-container').html("");
		$('.slides').html("");

		
		$('.play-narration i').removeClass('fa-pause-circle').addClass('fa-play-circle');

		setTimeout(function() {
		player = $('.player0').find('source').attr("data-rel");
		$('.player0').find('source').attr("src",player);
	
		},500);	
		setTimeout(function() {
			play(0);
		},700);

		setTimeout(function() {
			player.load();
	   		player.play();
	   		$('.play-narration i').addClass('fa-pause-circle').removeClass('fa-play-circle');
	   	}, 900);

		setTimeout(function() {
			$('.start-time').text('0:00');
			currentValue = 0;
			initializeSlider(null, [], 0);
			activeClass();
		},900);

	});

	function getLesson(xml_lesson,topic,content){
		let url = xml_lesson;
		var lesson = {};
		var topics=null;
		$(".se-pre-con").fadeIn("fast");
	    fetch(url).then(response=>response.text()).then( data => {
	    	let xml = $.parseXML(data);
		    lesson1 = $(xml);
			var select_topic=topic;
			let topics = lesson1.find('topics');
			
			if (topics.length > 0) {
				for (i = 0; i < topics.length; i++) {	
					multipleTopic(topics[i], i,select_topic,content);
				}
			} else {
				multipleTopic(topics, 0, select_topic,content);		
			}
		});
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
	function multipleTopic(topic, i, topic_number,contents){
		var select_topic=topic_number;
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

		var row = "<div parent="+contents+" topics="+count+" class='container-fluid slide_"+count+" slide-section'>"
			row +="	  <div class='p-4'>"
			row +="     <div class='row'>"
			row	+= "      <div class='col-md-8 slide-text-content quest' id='quest'></div>"
			row	+= "      <div class='col-md-4 text-center' id='img'></div>"
			row +="       <div class='col-md-12 text-content center' id='center'></div>"
			row +="     </div>"
			row +="   </div>"
			row +="</div>"

		$('.slides').append(row);
		$('.slide_'+select_topic+'').siblings().hide();

		

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
			$('.slide_'+count+'').find('#center').append(img);
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
			audio +='<source src="" data-rel="'+base_url+'/assets/audios/'+Audio+'" type="audio/mp3">'
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
		 	img +='<img src="/assets/images/'+img1+'" class="img-fluid img-thumbnail align_'+align+'">'
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
		if(!isOpened){
			width = '250px';
			$('.se-pre-con').css('width' ,'82%');
		}
		$('.sidenav').css('width',width);
		$('#main').css('margin-left',width);
		$('.se-pre-con').css('width' ,'100%');
		$(this).toggleClass('open');
		return false;
	});

	$(document).on('click','.sidenav .closebtn', function(e) {
		e.preventDefault();
		$('.open-sidenav').trigger('click');
		$('.se-pre-con').css('width' ,'100%');
		return false;
	});

	$(document).on('click','.play-narration', function(e) {
		e.preventDefault();
		playPausePlayer();
		return false;
	});

	function play(count){
		var count = count;
		player = $('.player'+count+'')[0];
		$(player).on('canplaythrough', function(e) {
			var duration=player.duration;
			duration = Math.round(duration);
			if($('#player_slider').length > 0) {
				initializeSlider(duration, [], 0);
			}
		$(".se-pre-con").fadeOut("slow");	
		});
		player.ontimeupdate = function() {
			jQuery(".end-time").html(fancyTimeFormat(player.duration));
			jQuery(".start-time").html(fancyTimeFormat(player.currentTime));
			if(player.currentTime > currentValue)
				currentValue = player.currentTime;
			if(progressBar != null)
				progressBar.bootstrapSlider('setValue',player.currentTime);

			$.each(paragraphs, function(i,para) {
				var time1 = player.currentTime;
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

		player.onended = function() {
			$('.slide_'+count+'').attr('completed' , 1);
			tracking();
			$('.play-narration i').removeClass('fa-pause-circle').addClass('fa-play-circle');
			var length1 = $('.slide_'+count+'').next().length;
 			
			if(length1 > 0) {
			play_id=count+1;
			player = $('.player'+play_id+'').find('source').attr("data-rel");
			$('.player'+play_id+'').find('source').attr("src",player);
				$('.slide_'+count+'').fadeOut('fast');
			$('.slide_'+count+'').hide();
			$('.slide_'+count+'').next().show( "slide", {direction: "right" }, 2000 );
			
			paragraphs = [];
			
			progressBar.bootstrapSlider('setValue',0);
			setTimeout(function() {
				play(play_id);
			player.load();
	        player.play();
	    	$('.play-narration i').addClass('fa-pause-circle').removeClass('fa-play-circle');}, 2000);
			
			var duration= $('.player'+count+'').duration;
			$('.start-time').text('0:00');
			currentValue = 0;
			initializeSlider(duration, [], 0);
			activeClass();
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