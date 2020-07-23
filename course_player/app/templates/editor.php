<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Hazwoper HTML</title>

    <!-- Custom styles -->
    <link rel="stylesheet" href="css/style.css">
    <link rel="stylesheet" href="https://code.jquery.com/ui/1.12.1/themes/base/jquery-ui.css">
    <link rel="stylesheet" href="css/font-awesome.min.css">
    <link rel="stylesheet" href="https://stackpath.bootstrapcdn.com/bootstrap/4.5.0/css/bootstrap.min.css" integrity="sha384-9aIt2nRpC12Uk9gS9baDl411NQApFmC26EwAOH8WgZl5MYYxFfc+NcPb1dKGj7Sk" crossorigin="anonymous">
    <link rel="stylesheet" href="./dist/css/summernote-bs4.css" />
    <link rel="stylesheet" href="css/bootstrap-slider.min.css" />
    <link rel="stylesheet" href="./dist/css/summernote.css" />
    <link rel="stylesheet" href="./css/accordion.css" />
    <link rel="stylesheet" href="./css/accordion.css" />
    
</head>
    <body>


      
      <!-- First Step -->
      <div id="EditorFirstStep">
          <div class="container">
            <div class="btn btn-group p-0 pull-right mb-4">
              <button class="btn btn-warning new-course" data-toggle="modal" data-target="#exampleModal">Create New Course</button>
            </div>
            <table class="table table-bordered table-striped  ">
              <thead>
                <tr>
                  <th>Course Title</th>
                  <th width="250px">Course Categories</th>
                  <th width="140px">Published Date</th>
                  <th width="140px">Modified Date</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td><a href="javascript:;">OSHA 8 Hour HAZWOPER Refresher Online Training – 29 CFR 1910.120 (e)</a></td>
                  <td>HAZWOPER Training</td>
                  <td>01/04/2020</td>
                  <td>10/04/2020</td>
                </tr>
                <tr>
                  <td><a href="javascript:;">OSHA 24 Hour HAZWOPER Online Training – 29 CFR 1910.120 (e)</a></td>
                  <td>HAZWOPER Training</td>
                  <td>03/04/2020</td>
                  <td>10/04/2020</td>
                </tr>
                <tr>
                  <td><a href="javascript:;">OSHA 40 Hour HAZWOPER Online Training – 29 CFR 1910.120 (e)</a></td>
                  <td>HAZWOPER Training</td>
                  <td>05/04/2020</td>
                  <td>10/04/2020</td>
                </tr>
                <tr>
                  <td><a href="javascript:;">OSHA 8 Hour HAZWOPER Refresher Online Training – 29 CFR 1910.120 (e)</a></td>
                  <td>HAZWOPER Training</td>
                  <td>07/04/2020</td>
                  <td>10/04/2020</td>
                </tr>
                <tr>
                  <td><a href="javascript:;">Bloodborne Pathogens Training</a></td>
                  <td>HAZWOPER Training</td>
                  <td>07/04/2020</td>
                  <td>10/04/2020</td>
                </tr>
                <tr>
                  <td><a href="javascript:;">Competent Person for Fall Protection</a></td>
                  <td>HAZWOPER Training</td>
                  <td>07/04/2020</td>
                  <td>10/04/2020</td>
                </tr>
              </tbody>
            </table>
          </div>
          
      </div>
      

      

      <!-- Second Step -->
      <div id="mySidenav" class="sidenav">
        <a id="CloseMainNav" href="javascript:void(0)" class="closebtn">&times;</a>
        <ul class="cd-accordion cd-accordion--animated margin-top-lg margin-bottom-lg sideAccordion sortable"></ul>
        <button id="saveTocBtn" class="btn btn-warning saveTocBTn">Save TOC</button>
        <button id="addModule" data-rel="1" class="btn btn-warning">Add Module</button>
        <button class="btn btn-warning " id="full-width-btn"><i class="fa fa-arrow-right"></i></button>
      </div>

      <div id="timerNav" class="sidenav">
        <a id="OpenTimeNav" href="javascript:void(0)" class="closebtn openTimer" onclick="">
          <i class="fa fa-arrow-left"></i>
        </a>
        <a id="closeTimeNav" href="javascript:void(0)" class="closebtn" onclick="">&times;</a>
        <div id="timer"></div>
      </div>

      <div id="main">
        <header>
          <nav class="navbar navbar-expand-lg navbar-light bg-light">
            <div class="container">
              <div class="row w-100">
                <div class="col-md-8 col-sm-12">
                  <button id="SideNavigation" onclick="" class="navbar-toggler" type="button" data-toggle="collapse" data-target="#navbarSupportedContent" aria-controls="navbarSupportedContent" aria-expanded="false" aria-label="Toggle navigation">
                    <span class="navbar-toggler-icon"></span>
                  </button>                
                  <img src="images/logo.png" alt="" width="260px">
                </div>
                
                <div class="col-md-4 col-sm-12">  
                    <h5 class="courseName mb-0" id="courseName">
                      Bloodborne Pathogens Training
                    </h5>
                </div>
              </div>
            </div>  
          </nav>   
        </header>
      
        <div id="slides"></div>
      </div>

      <!-- Second Step -->

      <div id="EditorSecondStep">
        <button class="btn btn-warning">ADD MODULE</button>
      </div>

      <!-- Modal -->
      <div class="modal fade" id="exampleModal" tabindex="-1" role="dialog" aria-labelledby="exampleModalLabel" aria-hidden="true">
        <div class="modal-dialog">
          <div class="modal-content">
            <div class="modal-header">
              <h5 class="modal-title" id="exampleModalLabel">New Course Title</h5>
              <button type="button" class="close" data-dismiss="modal" aria-label="Close">
                <span aria-hidden="true">&times;</span>
              </button>
            </div>
            <div class="modal-body">
              <form action="">
                <input type="text" class="form-control" placeholder="Enter Your Course Title" id="courseNameInput">
              </form>
            </div>
            <div class="modal-footer">
              <button type="button" class="btn btn-secondary" data-dismiss="modal">Close</button>
              <button id="CreateNewCourse" type="button" class="btn btn-primary" data-dismiss="modal" aria-label="Close">Save changes</button>
            </div>
          </div>
        </div>
      </div>
 
      <script src="https://cdnjs.cloudflare.com/ajax/libs/jquery/3.4.1/jquery.js"></script>
      <script src="https://code.jquery.com/ui/1.12.1/jquery-ui.js"></script>
      <!-- <script src="https://maxcdn.bootstrapcdn.com/bootstrap/3.4.1/js/bootstrap.min.js"></script> -->
      <script src="https://cdn.jsdelivr.net/npm/popper.js@1.16.0/dist/umd/popper.min.js" integrity="sha384-Q6E9RHvbIyZFJoft+2mJbHaEWldlvI9IOYy5n3zV9zzTtmI3UksdQRVvoxMfooAo" crossorigin="anonymous"></script>
      <script src="https://stackpath.bootstrapcdn.com/bootstrap/4.5.0/js/bootstrap.min.js" integrity="sha384-OgVRvuATP1z7JjHLkuOU7Xw704+h835Lr+6QL9UvYjZE3Ipu6Tp75j7Bh/kR0JKI" crossorigin="anonymous"></script>
      <script src="js/FileSaver.js"></script>
      <script src="js/bootstrap-slider.min.js"></script>
      <script src="js/util.js"></script>
      <script src="js/script.js"></script>
      <script src="./dist/js/summernote-bs4.js"></script>
</body>
</html>