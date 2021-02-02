<?php
//HAY QUE INSTALAR LIBRERIA GD: sudo apt-get install php5-gd
function libreriasOk()
{
  try{
    gd_info();

  }catch(Exception $e){
    return false;
  }
  return true;
}
function resizeImage($sourceImage, $targetImage, $maxWidth, $maxHeight, $quality = 80)
{
    // Obtain image from given source file.
    if (!$image = @imagecreatefromjpeg($sourceImage))
    {
        return false;
    }

    // Get dimensions of source image.
    list($origWidth, $origHeight) = getimagesize($sourceImage);

    if ($maxWidth == 0)
    {
        $maxWidth  = $origWidth;
    }

    if ($maxHeight == 0)
    {
        $maxHeight = $origHeight;
    }

    // Calculate ratio of desired maximum sizes and original sizes.
    $widthRatio = $maxWidth / $origWidth;
    $heightRatio = $maxHeight / $origHeight;

    // Ratio used for calculating new image dimensions.
    $ratio = min($widthRatio, $heightRatio);

    // Calculate new image dimensions.
    $newWidth  = (int)$origWidth  * $ratio;
    $newHeight = (int)$origHeight * $ratio;

    // Create final image with new dimensions.
    $newImage = imagecreatetruecolor($newWidth, $newHeight);
    imagecopyresampled($newImage, $image, 0, 0, 0, 0, $newWidth, $newHeight, $origWidth, $origHeight);
    imagejpeg($newImage, $targetImage, $quality);

    // Free up the memory.
    imagedestroy($image);
    imagedestroy($newImage);

    return true;
}
function permisosOk($nom)
{
  if (!is_writable($nom)){
  echo "No se puede escribir el archivo.. fijate permisos";
  return false;
}
return true;
}
function varsOk()
{
  if(!isset($_GET['nombre'])){
    echo "no se pasa por metodo GET variable nombre";
    return false;
  }
  return true;
}
function getSize()
{
  if(!isset($_GET['ancho'])){
    return 500;
  }
  return $_GET['ancho'];
}
function crearArchivo($nom)
{
  $datosPUT = fopen("php://input", "r");
  /* Leer 1 KB de datos cada vez
   y escribir en el fichero */
  $fp = fopen($nom, "w");

  while ($datos = fread($datosPUT, 1024)){
    fwrite($fp, $datos);
  }

  fclose($fp);
  fclose($datosPUT);
}
//if(!permisosOk($nom))return;
if(!libreriasOk())return;
if(!varsOk())return;
$ancho=getSize();

$CARPETA_IMAGENES='imagenesExterno';
$archivo=(isset($_GET['nombre'])?$_GET['nombre']."":"perfil").".jpg";
$destino=$CARPETA_IMAGENES."/".$archivo;
crearArchivo($archivo);

  // rename($nom,$newName);
  // copy($newName,$nuevaCarpeta);
   if (file_exists($archivo)){
    if(resizeImage($archivo,$destino,$ancho,0))
    echo "ok"; else echo "No se puede resizar ";
   }
  
  else echo "No se encuentra ".$archivo." para resizar ";

?>