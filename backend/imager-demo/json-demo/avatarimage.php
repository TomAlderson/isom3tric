<?php

$inputFigure		= strtolower($_GET["figure"]);
$inputAction		= isset($_GET["action"]) ? strtolower($_GET["action"]) : 'std';
$inputDirection		= isset($_GET["direction"]) ? (int)$_GET["direction"] : 4;
$inputHeadDirection	= isset($_GET["head_direction"]) ? (int)$_GET["head_direction"] : $inputDirection;
$inputGesture		= isset($_GET["gesture"]) ? strtolower($_GET["gesture"]) : 'std';
$inputSize			= isset($_GET["size"]) ? strtolower($_GET["size"]) : 'n';
$inputFormat		= isset($_GET["img_format"]) ? strtolower($_GET["img_format"]) : 'png';
$inputFrame			= isset($_GET["frame"]) ? strtolower($_GET["frame"]) : '0';
$inputHeadOnly		= isset($_GET["headonly"]) ? (bool)$_GET["headonly"] : false;

// $inputAction		= explode(",", $inputAction);
// $inputFormat		= $inputFormat == "gif" ? "gif" : "png";
// $inputFrame			= explode(",", $inputFrame);

// $expandedstyle = $inputFigure.".s-".(($inputSize == "s" || $inputSize == "l") ? "n" : $inputSize).($inputHeadOnly ? "h" : "").".g-".$inputGesture.".d-".$inputDirection.".h-".$inputHeadDirection.".a-".implode("-",str_replace("=","",$inputAction)).".f-".implode("-",str_replace("=","",$inputFrame));

// http://localhost:1337/avatarimage.php?figure=hd-180-1.ch-255-66.lg-280-110.sh-305-62.ha-1012-110.hr-828-61&action=std&gesture=std&direction=2&size=l&head_direction=2&frame=&headonly=0&img_format=png

// echo("http://localhost:1337/avatarimage.php?figure=" . $inputFigure . "&action=" . $inputAction . "&gesture=" . $inputGesture . "&direction=" . $inputDirection . "&size=" . $inputSize . "&head_direction=" . $inputHeadDirection . "&frame=" . $inputFrame . "&headonly=" . $inputHeadOnly . "&img_format=" . $inputFormat);

$query_array = [
    'figure' => $inputFigure,
    'action' => $inputAction,
    'gesture' => $inputGesture,
    'direction' => $inputDirection,
    'size' => $inputSize,
    'head_direction' => $inputHeadDirection,
    'frame' => $inputFrame,
    'headonly' => $inputHeadOnly,
    'img_format' => $inputFormat
];

$remoteImage = "http://localhost:1337/avatarimage.php?";

$query = http_build_query($query_array, '', '&');

$ch = curl_init();
curl_setopt($ch, CURLOPT_URL, $remoteImage . $query);
curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
$data = curl_exec($ch);

echo $data;

curl_close($ch);

// $imginfo = base64_encode(file_get_contents($remoteImage . "?" . $query));

// echo $imginfo;