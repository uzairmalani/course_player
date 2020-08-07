<?php 

?>

<div id="mySidenav" class="sidenav">
	<a href="http://localhost/players/course_player/" class="backbtn">&larr;</a>
  	<a href="javascript:void(0)" class="closebtn">&times;</a>
  <!-- <a href="http://localhost/players/course_player/">Lesson 1: Lorem Ipsum is simply dummy text of the printing</a>
  <a href="http://localhost/players/course_player/">Lesson 2: Lorem Ipsum is simply dummy text of the printing</a>
  <a href="http://localhost/players/course_player/">Lesson 3: Lorem Ipsum is simply dummy text of the printing</a>
  <a href="http://localhost/players/course_player/">Lesson 4: Lorem Ipsum is simply dummy text of the printing</a> -->
</div>
 

<div id="main" class="">
	<div>
		<nav class="navbar navbar-expand-lg navbar-light">
		  <button class="btn btn-link my-2 my-sm-0 open-sidenav" title="Ask Question">
		    <span class="navbar-toggler-icon"></span>
		  </button>
		  <a class="navbar-brand" href="">
		  </a>
		  <button class="navbar-toggler" type="button" data-toggle="collapse" data-target="#navbarSupportedContent" aria-controls="navbarSupportedContent" aria-expanded="false" aria-label="Toggle navigation">
		    <span class="navbar-toggler-icon"></span>
		  </button>

		  <div class="collapse navbar-collapse" id="navbarSupportedContent">
		  	<ul class="navbar-nav mr-auto"></ul>
		    <form class="form-inline my-2 my-lg-0 search-form">
		      <!--  -->
			    <input class="form-control mr-sm-2" type="search" placeholder="Search Content" aria-label="Search">
		      <button class="btn btn-outline-primary my-2 my-sm-0 btn-search" type="submit">Search</button>
		   <!--    <button class="btn btn-link mycol-md-4 text-center-2 my-sm-0" title="Ask Question"><i class="fa fa-question"></i></button> -->
		    </form>
		  </div>
		  <ul class="navbar-nav ml-auto">
				<li class="nav-item dropdown"> <a class="nav-link dropdown-toggle drop" href="#" id="navbarDropdown" role="button" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false"> <?php print_r($data['user_name']); ?>
    </a>
					<div class="dropdown-menu" aria-labelledby="navbarDropdown"> <!-- <a class="dropdown-item" href="#">Edit Profile</a>
						<a class="dropdown-item" href="#">Setting</a> -->
						<div class="dropdown-divider"></div> <a class="dropdown-item" href="logout.php">Sign Out</a>
					</div>
				</li>
			</ul>
		</nav>
		<div class="collapse navbar-collapse" id="navbarSupportedContent">
			<ul class="navbar-nav ml-auto">
				<li class="nav-item dropdown"> <a class="nav-link dropdown-toggle drop" href="#" id="navbarDropdown" role="button" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">
        <img class="img-profile rounded-circle" src=""></a>
					<div class="dropdown-menu" aria-labelledby="navbarDropdown"> <!-- <a class="dropdown-item" href="#">Edit Profile</a>
						<a class="dropdown-item" href="#">Setting</a> -->
						<div class="dropdown-divider"></div> <a class="dropdown-item" href="logout.php">Sign Out</a>
					</div>
				</li>
			</ul>
		</div>
	</nav>
		<div class="player-div pb-4">
			<input type="hidden" name="course_id" id="course_id" value=
<?php print_r($data['course_id']); ?>>
<input type="hidden" name="user_id" id="user_id" value=
<?php print_r($data['user_id']); ?>>
				 <div class="se-pre-con">
				 </div>
			<div class=slides>
			
			</div>
			<div class="container-fluid progressbar-section">
				<div class="row">
					<div class="col-2 col-md-1 text-center p-0">
						<button class="btn btn-link m-0 p-0 play-narration"><i class="fa fa-play-circle fa-2x"></i></button>
						
					</div>
					<div class="col-8 col-md-10">
						<input id="player_slider" data-slider-id='player_slider' type="text" data-slider-min="0" data-slider-value="0" data-slider-handle="square" />
					</div>
					<div class="col-2 col-md-1 text-center p-0">
						<button class="btn btn-link m-0 p-0"><i class="fa fa-info-circle fa-2x"></i></button>
					</div>
				</div>
				<div class="row">
					<div class="col-2 col-md-1 text-center">
					</div>
					<div class="col-8 col-md-offset-1 col-md-10 p-0">
						<b class="start-time pull-left">0:00</b>
						<b class="end-time pull-right">0:00</b>
					</div>
					<div class="col-2 col-md-1 text-center"></div>
				</div>
			</div>

		
		</div>
	<!-- 	<div class="player-div slide2 pb-4">
			<div class="container-fluid slide-section">
				<div class="p-4 ">
					<div class="row">
						<div class="col-md-8 slide-text-content " id='quest'>
						</div>
						<div class="col-md-4 text-center" id="img">
					
						</div>
						<div class="col-md-12 slide-text-content" id='center'>		
						</div>
					</div>

				</div>
			</div>
			<div class="container-fluid progressbar-section">
				<div class="row">
					<div class="col-2 col-md-1 text-center p-0">
						<button class="btn btn-link m-0 p-0 play-narration"><i class="fa fa-play-circle fa-2x"></i></button>
						
					</div>
					<div class="col-8 col-md-10">
						<input id="player_slider" data-slider-id='player_slider' type="text" data-slider-min="0" data-slider-value="0" data-slider-handle="square" />
					</div>
					<div class="col-2 col-md-1 text-center p-0">
						<button class="btn btn-link m-0 p-0"><i class="fa fa-info-circle fa-2x"></i></button>
					</div>
				</div>
				<div class="row">
					<div class="col-2 col-md-1 text-center">
					</div>
					<div class="col-8 col-md-offset-1 col-md-10 p-0">
						<b class="start-time pull-left">0:00</b>
						<b class="end-time pull-right">0:00</b>
					</div>
					<div class="col-2 col-md-1 text-center"></div>
				</div>
			</div>

	
		</div> -->


	<div class="popup" data-popup="popup-1">
	<div class="popup-inner">
		
		<p><a data-popup-close="popup-1" href="#">Close</a></p>
		
		<a class="popup-close" data-popup-close="popup-1" href="#">x</a>
	</div>
	</div>

	<div class="audio-player">
	  <div class="audio-wrapper" id="player-container">
	   
	  </div>
	</div>
</div>
<script type="text/javascript">
	$(document).ready(function () {
		
        startplayer();

       setInterval(function()
		{
			tracking();
		}, 5000);
    });
	
	</script>	