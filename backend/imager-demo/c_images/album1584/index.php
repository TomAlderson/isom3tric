<?php
header('Content-Type: image/gif');
//error_reporting(0);
$todown = $_GET['file'].".gif";
if (file_exists($todown))
{
	echo file_get_contents($todown);
	exit;
}
$content = file_get_contents("http://images.habbogroup.com/c_images/album1584/".$todown);
if (strlen($content) == 0) {
exit; }
echo $content;
file_put_contents($todown, $content);
?>