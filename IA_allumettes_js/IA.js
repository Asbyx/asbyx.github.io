newCanvas(400, 400);
var allImagesLoaded = true; //true si pas d'images.

//var
var state = "initTrain";
var lr = 0.001;
var nbAl, player;
var ai = [];
ai[1] = new IA();
ai[2] = new IA();
var isPause = false;
var games = 0;
//--------------------------- 

// /!\  NE PAS OUBLIER allImagesLoaded = true DANS LE DERNIER ONLOAD /!\

if (allImagesLoaded) draw();
function draw(){
	requestAnimationFrame(draw);
	background(127); //fonctionne comme le fill();
	clear();
	textSize(16);
	text("Nombre de games jouées: "+games, 3, 16);

	switch(state){
		case"initTrain":
			nbAl = 12;
			player = 1;
			state = "train";
			ai[1].exploRate = 1;
			break;

		case"initTest":
			nbAl = 12;
			player = 2;
			ia = ai[1];
			ia.exploRate = -1;
			state = "test";
			break;

		case"train":
			fill(0);
			for (var i = 0; i < nbAl; i++) {
				rect(100 + i*13, 100, 3, 100);
			}
			if(player == 1){
				nbAl -= ai[player].pick();
				if(nbAl <= 0){
					perdu();
					ai[1].think(-1);
					ai[2].think(1);
				} else player = 2;
			} else {
				nbAl -= ai[player].pick();
				if(nbAl <= 0){
					perdu();
					ai[1].think(1);
					ai[2].think(-1);
				} else player = 1;
			}
			break;

		case"test":
			fill(0);
			for (var i = 0; i < nbAl; i++) {
				rect(100 + i*13, 100, 3, 100);
			}
			if(player == 2) {
				nbAl -= ia.pick();
				if(nbAl <= 0){
					perdu();
				} else player = 1;
			}
			break;
	}
}

function IA (){
	this.s = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0];
	this.picks = [];
	this.exploRate = 1;

	this.pick = function() {
		this.picks.push(nbAl);
		if(Math.random() < this.exploRate){
			let pick = Math.floor(Math.random() * 3) + 1;
			return pick;
		} else {
			if(nbAl >= 4){
				if(this.s[nbAl - 1] < this.s[nbAl - 2] && this.s[nbAl - 1] < this.s[nbAl - 3]) return 1;
				if(this.s[nbAl - 2] < this.s[nbAl - 1] && this.s[nbAl - 2] < this.s[nbAl - 3]) return 2;
				if(this.s[nbAl - 3] < this.s[nbAl - 2] && this.s[nbAl - 1] > this.s[nbAl - 3]) return 3;
			}
			if(nbAl == 3){
				if(this.s[nbAl - 1] < this.s[nbAl - 2]) return 1;
				if(this.s[nbAl - 2] < this.s[nbAl - 1]) return 2;
			}
			if(nbAl <= 2) return 1;
		}
		return 0;
	}

	this.think = function(r) {
		for (var i = this.picks.length - 1; i >= 0; i--) {
			if(i == this.picks.length - 1){
				this.s[this.picks[i]] += lr*(r - this.s[this.picks[i]]);
			}
			else{
				this.s[this.picks[i]] += lr*(this.s[this.picks[i + 1]] - this.s[this.picks[i]]);
			}
		}
		this.picks = [];
		this.exploRate -= 0.001;
	}
}

function isKeyPressed (key){
	if(key === "Space"){
		if(state === "pause") state = "initTrain"; else state = "pause";
	}
	if(key === "Enter"){
		state = "initTest";
	}
	if(state === "test" && key <= 3){
		nbAl -= key;
		if(nbAl <= 0){
			perdu();
		} else player = 2;
	}
}

function perdu(){
	games++;
	nbAl = 12;
	player = Math.round(Math.random()*(1.5) + 1);
}