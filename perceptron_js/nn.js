newCanvas(400, 400);
var allImagesLoaded = true; //true si pas d'images.

//var
var i, j;
var timer = 0;
//--------------------------- 

// /!\  NE PAS OUBLIER allImagesLoaded = true DANS LE DERNIER ONLOAD /!\

function NeuralNetwork(i, h, o) {
	this.inputsNodes = i;
	this.hiddenNodes = h;
	this.outputsNodes = o;


	
}



if (allImagesLoaded) draw();
function draw(){
	timer ++;
	requestAnimationFrame(draw);
	background(127); //fonctionne comme le fill();
	fill(255);
}


function isKeyPressed(key) {
	if(key == "Space"){
	}
}
