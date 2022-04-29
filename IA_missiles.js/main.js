/*
TO DO:

algorithme de génétique

regarder comment collecter les data et les stocker

lancer simulation et voir si ça fonctionne

faire la vrai simulation
*/




newCanvas(800, 200);
var allImagesLoaded = false; //true si pas d'images.

//var
var nbIA = 100;
var m = [];
for(var i = 0; i < nbIA; i++){
	m[i] = new Missile();
}

var P = new Point();
var training = true;
//--------------------------- 

img.onload = allImagesLoaded = true;
// /!\  NE PAS OUBLIER allImagesLoaded = true DANS LE DERNIER ONLOAD /!\

if (allImagesLoaded) draw();


function draw(){
	requestAnimationFrame(draw);
	clear();
	background(127); //fonctionne comme le fill();

	let morts = 0;
	for(var i = 0; i < nbIA; i++){
		if(m[i].isAlive){
			m[i].think();
			m[i].show();
		} else morts ++;
	}
	P.show();

	if (morts == nbIA && training){
		gen();
	}
}

function gen(){
	m.sort(function(a,b){return (b.score - a.score);});

	let theGen = [];
	for(var i = 0; i < 10; i++){ //collecte des cerveaux
		theGen[i] = _.cloneDeep(m[i].brain);
	}

	for (var i = 0; i < nbIA; i++) { //création des nouveaux missiles
		m[i] = new Missile();
	}

	for (var i = 0; i < 50; i++) { //attribution des nouveaux cerveaux
		if(i >= 10) {
			m[i].brain = theGen[random(0, 10, true)];
			m[i].brain.mutate(0.01);
		} else {
			m[i].brain = _.cloneDeep(theGen[i]);
		}
	}

	P = new Point();
}


function giveMeMissiles (){
	for(var j = 0; j < nbIA; j++){
		if(m[j].isAlive) return j;
	}
}
/*
DESCRIPTION DU PROJET

Le but est d'entraîner une ia à aller vers un point, en gérant la gravité.


L'ia part de la droite, orientée vers le haut, puis doit aller à droite, sur un point positionné de manière random
_inputs: x, y, x du point d'arrivée, angle, velocitée en x, vélocitée en y
_hidden: 25 * 25
_outputs: truster, vers la droite, vers la gauche	ACTIVE SI A PLUS DE 0.5  (classification task)
reward = 1 / dist


1) faire l'ia avec de la génétique (avec mon réseau de neurones)

2) faire de la collecte de donnée avec pleins de réseaux random de ma librairie
 Donner les données au ml5
 voir ce que le ml5 propose

*/
