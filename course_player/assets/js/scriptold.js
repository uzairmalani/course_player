
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
var coruse_toc="";

$(document).ready( function(){

	// $(window).load(function() {
	// 	// Animate loader off screen
	// 	$(".se-pre-con").fadeOut("slow");
	// });
	// function ViewData(){
	// 	$.ajax({
	// 	            type:"get",
	// 	            dataType: "json",
	// 	            url:'http://localhost/players/course_player/get_topic',
	// 	            success:function(data){
	// 	            	console.log(data);

	// 	            }
		           
	// 	});
	// }
	$.getJSON("http://localhost/players/course_player/get_topic/1",
		function(data){
		    	coruse_toc = data;   
		    		    	
    });
    setTimeout(function() {
		getcoursee(coruse_toc);
	},200);


	$.getJSON("http://localhost/players/course_player/get_course/1",
		function(data){
		    	Modules = data['modules'];   	
		    	console.log(Modules);
    });

	
	var url = "http://localhost/players/course_player/assets/js/course2.xml";
	//fetch(url).then(response=>response.text()).then( data => {
		var link ='';
		var img = '';
		var count = '';
		var center = false;

		//let xml = $.parseXML(data);
	   // obj = $(xml);

	   // lessons = obj.find('lesson');
	
	// function selectModule (Module){

	// 	var Modules = Module;
	// 	if(Array.isArray(Modules)){
	// 		for(var i = 0;i < Modules.length; i++){
	//   			course +='<div class="option-heading"><i class="fa fa-angle-down" aria-hidden="true"></i><a class="lesson"  data-module="'+i+'" data-rel="'+i+'" href="http://localhost/players/course_player/">'
	//  			+Modules[i].name+'</a></div>';
	//  			course +='<div class="option-content is-hidden">';
	//  		if(Modules[i].lessons){
	//  			SelectTopics(Modules[i],i,"modules");
	//  			SelectLesson(Modules[i],i);
	//  		}else{
	// 			SelectTopics(Modules[i],i,"modules");	 		
	// 		}
	//  		course += '</div>';	
	//  		}
	// 	}else{
	// 	 	course +='<div class="option-heading"><i class="fa fa-angle-down" aria-hidden="true"></i><a class="lesson" data-module="0" data-rel="0" href="http://localhost/players/course_player/">'
	//  		+Modules.name+'</a></div>';
	//  		course +='<div class="option-content is-hidden">';
	//  		if(Modules.lessons){
	//  			SelectTopics(Modules,0,"modules");
	//  			SelectLesson(Modules,0);
	//  		}else{
	// 			SelectTopics(Modules,0,"modules");	 		
	// 		}
	//  		course += '</div>';
	// 	}
	// }
	setTimeout(function() {
		//selectModule(Modules);
	},200);
	
	setTimeout(function() {
		$('.sidenav').prepend(course);
		play(0);

		;},500);	
	getLesson(url,0);

	
//});
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

	function getcoursee(toc){
		coruse_toc =toc; 
		console.log(coruse_toc);
		for(var i = 0;i < coruse_toc.length; i++){
			if(coruse_toc[i]['level'] == 1 && coruse_toc[i]['module_name'] != null){
	  		coruse_toc['position'] -= 1;
	  		console.log(coruse_toc[i]['module_name']);
	  		course +='<div class="option-heading"><i class="fa fa-angle-down" aria-hidden="true"></i><a class="lesson"  data-module="" data-rel="" href="http://localhost/players/course_player/">'
	  			+coruse_toc[i]['module_name']+'</a></div>';
	  			course +='<div class="option-content is-hidden">';
	  		}
	  		if(coruse_toc[i]['level'] == 2 && coruse_toc[i]['topic_name'] != null){
			  	console.log(coruse_toc[i]['position']);
			  	SelectTopics(coruse_toc[i]['topic_name'],0,"modules",coruse_toc[i]['position']);	
			 }
			 if(coruse_toc[i]['level'] == 2 && coruse_toc[i]['lesson_name'] != null){
			  	console.log(coruse_toc[i]['position']);
			  	SelectLesson(coruse_toc[i]['lesson_name'],0,coruse_toc[i]['position'],coruse_toc[i]['type_id']);
			  	course += '<div class="option-topics is-hidden">';	
			 }
			 if(coruse_toc[i]['level'] == 3 && coruse_toc[i]['topic_name'] != null){
			 console.log(coruse_toc[i]['topic_name']);
		  	 SelectTopics(coruse_toc[i]['topic_name'],coruse_toc[i]['lesson_id'],"lesson",coruse_toc[i]['position']);			  	
			 }
		}
	 //  	if(coruse_toc['level'] == 1 && coruse_toc['module_name'] != null){
	 //  		coruse_toc['position'] -= 1;
	 //  		console.log(coruse_toc['module_name']);
	 //  		course +='<div class="option-heading"><i class="fa fa-angle-down" aria-hidden="true"></i><a class="lesson"  data-module="'+item['position']+'" data-rel="'+item['position']+'" href="http://localhost/players/course_player/">'
	 //  			+coruse_toc['module_name']+'</a></div>';
	 //  			course +='<div class="option-content is-hidden">';
	 //  	}
	 //  	if(coruse_toc['level'] == 2 && coruse_toc['topic_name'] != null){
	 //  	console.log()
	 //  	SelectTopics(coruse_toc['topic_name'],0,"modules");	
	 //  	}
		// console.log(coruse_toc);
	}

	function SelectLesson(Module,i,position,lesson_id){
		var Lessons = Module;
		if(Array.isArray(Lessons)){	
		 	for(var j = 0;j < Lessons.length; j++){
		 		course += '<div class="option-lesson">';
		 		var count = j+1;
		  		course +='<i class="fa fa-plus-square" aria-hidden="true"></i><a class="lesson" data-module="'+i+'" data-rel="'+count+'" data-lesson="'+j+'" href="http://localhost/players/course_player/">'
		  	 			+Lessons[j]+'</a>';
		  		course += '<div class="option-topics is-hidden">';
		  		SelectTopics(Lessons[j],j,"lesson")
		  		course += '</div>';
		  		course += '</div>';
		 	}
		}else{
		 	course += '<div class="option-lesson">';
		  	course +='<i class="fa fa-plus-square" aria-hidden="true"></i><a class="lesson" data-module="'+i+'" data-rel="'+position+'" data-lesson="'+lesson_id+'" href="http://localhost/players/course_player/">'
		  	 			+Lessons+'</a>';
		  

		}
	}
	function SelectTopics(lesson,i, parent,position){
		var parent = parent;
		var Topics= lesson;
		if(Array.isArray(Topics)){
		 	for(var j = 0;j < Topics.length; j++){
		  		course +='<a class="topics" data-'+parent+'="'+i+'" data-topic="'+position+'" href="#">'
		 		+Topics[j]+'</a>';	
		 	}
		 	
		} else {
		  	course +='<a class="topics" data-'+parent+'="'+i+'" data-topic="'+position+'" href="#">'
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

	$(document).on('click', '.topics', function(e){
	 	e.preventDefault()
	 	var modules =parseInt($(this).attr('data-modules'));
	 	var lesson =parseInt($(this).attr('data-lesson'));
	 	var topic =parseInt($(this).attr('data-topic'));
	 	var xmlLesson="";
	 	

	 	$('#player-container').html("");
		$('.slides').html("");

		if($(this).attr('data-modules')){
	  		xmlLesson=Modules[modules].xml;
	  		console.log(modules);
	 	}else{
	 		var modulesss = $(this).parent().siblings('.lesson').attr('data-module');
	 		console.log(modulesss , lesson);
	 		xmlLesson=Modules[modulesss].lessons[lesson].url;
		}

		getLesson(xmlLesson,topic);
			
		$('.play-narration i').removeClass('fa-pause-circle').addClass('fa-play-circle');
		setTimeout(function() {
		play(topic);
		},300);
		

		setTimeout(function() {
		player.load();
	    player.play();
	    $('.play-narration i').addClass('fa-pause-circle').removeClass('fa-play-circle');}, 400);
		setTimeout(function() {
			$('.start-time').text('0:00');
			currentValue = 0;
			initializeSlider(null, [], 0);
	},500);

		return false;

	});

	$(document).on('click', '.lesson', function(e){
		e.preventDefault()
		var i = $(this).data('rel');
		var imodules = $(this).attr('data-module');
		var xmlLesson =""
		
		if($(this).attr('data-lesson')){
		var ilesson = $(this).attr('data-lesson');
		console.log('lessons');
		xmlLesson=Modules[imodules].lessons[ilesson].url;
		}else{
			console.log('module');
		xmlLesson=Modules[imodules].xml;
		}
		

		$('#player-container').html("");
		$('.slides').html("");

		getLesson(xmlLesson,0);
		$('.play-narration i').removeClass('fa-pause-circle').addClass('fa-play-circle');

		setTimeout(function() {
			play(0);
		},300);
		setTimeout(function() {
		player.load();
	    player.play();
	    $('.play-narration i').addClass('fa-pause-circle').removeClass('fa-play-circle');}, 400);
		setTimeout(function() {
			$('.start-time').text('0:00');
			currentValue = 0;
			initializeSlider(null, [], 0);
	},500);

});


	



	function getLesson(xml_lesson,topic){
		let url = xml_lesson;
		var lesson = {};
		var topics=null;
		$(".se-pre-con").fadeIn("slow");
	    fetch(url).then(response=>response.text()).then( data => {
	    	let xml = $.parseXML(data);
	    	//$(".se-pre-con").fadeOut("slow");
		    lesson1 = $(xml);

			var select_topic=topic;
			// var lesson1 = $(lessons[index]);
			// Main Topics view
			let topics = lesson1.find('topics');
			
			if (topics.length > 0) {
				for (i = 0; i < topics.length; i++) {	
					multipleTopic(topics[i], i,select_topic);
				}

			} else {
				//quest +='<h2  id=Question>'+topics+'</h2>';  
				multipleTopic(topics, 0, select_topic);		
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
	function multipleTopic(topic, i, topic_number){
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
		 	img +='<img src="'+img1+'" class="img-fluid img-thumbnail align_'+align+'">'
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
		//	else {
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
		//$(".se-pre-con").fadeOut("slow");
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