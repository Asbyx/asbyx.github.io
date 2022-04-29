newCanvas(400, 400);
var allImagesLoaded = true; //true si pas d'images.

//var
var nn = new neuralByx(5, 2, 4, 10);
log(nn);
//--------------------------- 

// /!\  NE PAS OUBLIER allImagesLoaded = true DANS LE DERNIER ONLOAD /!\

if (allImagesLoaded) draw();

function draw(){
	requestAnimationFrame(draw);
	background(127); //fonctionne comme le fill();
}
