newCanvas(400, 400);
var allImagesLoaded = true; //true si pas d'images.

textSize = 10;
//var
var score = highscore = 0;

var pipeRight, pipeLeft;
pipeRight = new Pipe();


var nbBirds = 100;
var nbBirdsAlive = nbBirds;
var birds = [];
for (var i = 0; i < nbBirds; i++) {
	birds[i] = new Bird();
}
//--------------------------- 

// /!\  NE PAS OUBLIER allImagesLoaded = true DANS LE DERNIER ONLOAD /!\

if (allImagesLoaded) draw();

function draw(){
	requestAnimationFrame(draw);
	
	clear();
	background(127); //fonctionne comme le fill();
	
	fill(0);
	text(score, 5, 10);
	text(highscore, 5, 20);


	for (var i = 0; i < nbBirds; i++) {
		/*on regarde s'il est en vie, s'il l'est on l'affiche, et à la fin
		on check s'il est tjrs en vie, s'il ne l'est plus, il y a un oiseau de 
		moins en vie.
		*/

		let wasAlive = birds[i].isAlive;
		
		if(wasAlive){
			birds[i].show();
			if(!birds[i].isAlive) {
				nbBirdsAlive--;
				if(nbBirdsAlive < nbBirds/10) birds[i].isOneOfTheBests = true;
			}
		}
	}

	//s'il ne reste aucun oiseau, on lance la gen suivante
	if(nbBirdsAlive <= 0) reproduction();


	pipeRight.show();
	try{ 
		pipeLeft.show(); 
	} catch (e) {};

	if(pipeRight.x < 35){
		pipeLeft = pipeRight;
		pipeRight = new Pipe();
		score ++;
	}
}

function reproduction(){
	pipeRight = new Pipe();
	if (score > highscore) {highscore = score;}
	score = 0;

	//prendre 10% des ia avec le meilleur score
	let birdsSelected = [];
	for (var i = 0; i < nbBirds; i++) {
		if (birds[i].isOneOfTheBests) {
			birds[i].isOneOfTheBests = false;
			birdsSelected.push(_.cloneDeep(birds[i]));
		}
	}

	//on conserve les parents
	birds = [];
	for (var i = 0; i < birdsSelected.length; i++) {
		birdsSelected[i].isAlive = true;
		birdsSelected[i].y = height/2;
		birdsSelected[i].inertie = 0;
		birdsSelected[i].isOneOfTheBests = false;

		birds[i] = _.cloneDeep(birdsSelected[i]);
	}

	//on remplit le reste avec 50% d'enfants des meilleurs et 50% de randoms
	for (var i = birdsSelected.length; i < nbBirds/2 + birdsSelected.length; i++) {
		birds[i] = _.cloneDeep(birdsSelected[random(0, birdsSelected.length, true)]);
		birds[i].brain.mutate(0.1);

		birds[i + nbBirds/2] = new Bird();
	}

	nbBirdsAlive = nbBirds;
}