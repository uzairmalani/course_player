<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
    <meta http-equiv="X-UA-Compatible" content="IE=edge">
    <meta name="viewport" content="width=device-width, initial-scale=1, shrink-to-fit=no">
    <title>LJ Web Player</title>
    <meta http-equiv="cache-control" content="max-age=0" />
    <meta http-equiv="cache-control" content="no-cache" />
    <meta http-equiv="expires" content="0" />
    <meta http-equiv="expires" content="Tue, 01 Jan 1980 1:00:00 GMT" />
    <meta http-equiv="pragma" content="no-cache" />
    <base href="<?php echo HTTP_MAIN_SERVER ?>">
    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/4.7.0/css/font-awesome.min.css">
    <link href="players/course_player//assets/vendor/bootstrap/css/bootstrap.min.css" rel="stylesheet" type="text/css">
    <link href="players/course_player/assets/vendor/fontawesome-free/css/all.min.css" rel="stylesheet" type="text/css">
    <link href="https://fonts.googleapis.com/css?family=Nunito:200,200i,300,300i,400,400i,600,600i,700,700i,800,800i,900,900i" rel="stylesheet">
    <link href="players/course_player/assets/vendor/bootstrap-slider/bootstrap-slider.min.css" rel="stylesheet" type="text/css">
    <link rel="stylesheet" type="text/css" href="https://code.jquery.com/ui/1.12.0/themes/smoothness/jquery-ui.css">
      <?php
        if (!empty($aCSS)) {
            foreach ($aCSS as $sCss) {
                echo '<link rel="stylesheet" href="' . $sCss . '?' . time() . '">' . "\n";
            }
        }
        ?>
    <link href="players/course_player/assets/css/style.css?<?php echo time(); ?>" rel="stylesheet" />
    <link rel="shortcut icon" href="players/course_player/assets/images/favicon.ico" type="image/x-icon">
    <link rel="icon" href="players/course_player/assets/images/favicon.ico" type="image/x-icon">
    <script src="players/course_player/assets/vendor/jquery/jquery.min.js"></script>
    <script src="players/course_player/assets/vendor/bootstrap/js/bootstrap.min.js"></script>
    <script src="players/course_player/assets/vendor/bootstrap-slider/bootstrap-slider.min.js"></script>
    <script src="https://code.jquery.com/ui/1.12.1/jquery-ui.min.js" integrity="sha256-VazP97ZCwtekAsvgPBSUwPFKdrwD3unUfSGVYrahUqU=" crossorigin="anonymous"></script>
    <script type="text/javascript" src="https://cdnjs.cloudflare.com/ajax/libs/jquery-visibility/1.0.11/jquery-visibility.min.js"></script>
    
      <script  src="players/course_player/assets/js/xmlToJson.js"></script>
    <script  src="players/course_player/assets/js/script.js"></script>
  
</head>
<body>
  <div id="content">
    <?php echo $yield; ?>
  </div>
  <script type="text/javascript">
    var baseUrl = '<?php echo HTTP_MAIN_SERVER ?>';
  </script>
  <?php
  if (!empty($aScript)) {
      foreach ($aScript as $sScript) {
          echo '<script type="text/javascript" src="' . $sScript . '?' . time() . '"></script>' . "\n";
      }
  }
  ?>
  <script type="text/javascript">
    $(document).ready(function(e) {
    <?php
      if (!empty($aInlineScript)) {
          foreach ($aInlineScript as $sScript) {
              echo $sScript . "\n";
          }
      }
    ?>
    });
  </script>
</body>
</html>