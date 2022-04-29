newCanvas(500, 500);
var allImagesLoaded = true; //true si pas d'images.

//var
var tab = []; //tableau 9x9
var nbBilles;
resetTab();

var direction = ["UP", "DOWN", "LEFT", "RIGHT"];

var adn = [];
var play = true;
var attempt = 0;
var display = true;
var moyennes = 0;

var ia = new IA();
//--------------------------- 

// /!\  NE PAS OUBLIER allImagesLoaded = true DANS LE DERNIER ONLOAD /!\

if (allImagesLoaded) draw();

function draw(){
	requestAnimationFrame(draw);
	background(127); //fonctionne comme le fill();

	if(display) displayTab();

	if(play){
		let possibleActions = check();
		let choosedAction = ia.pick(possibleActions); //possibleActions[random(0, possibleActions.length, true)];

		try{
			if(action(choosedAction[0], choosedAction[1], choosedAction[2])) adn.push([choosedAction[0], choosedAction[1], choosedAction[2]]);
		} catch(e){};
	}
}







function IA(){
	this.eps = 0.75;
	this.states = []; //[nombre de billes][tab][action spécifique], la Qvalue est stockée dans: [nbBilles][id de la tab][1][id de l'action][3]
	for (var i = 1; i < 33; i++) {
		this.states[i] = [];
	}


	this.picks = []; //prend juste les coordonnées dans le tab de l'action prise


	this.pick = function(pa){ //Possible actions
		let id = this.findTab();
		

		if(id == -1){
			this.createSituation(pa);
			id = this.states[nbBilles].length-1;
		}

		this.picks.push(this.takeBest(id));

		let length = this.picks.length-1;
		return this.states[this.picks[length][0]][[this.picks[length][1]]][1][[this.picks[length][2]]];
	}

	this.think = function(){
		let reward = this.computeReward();
		//Q(t) += 0.1*( 0.9*Q(t+1) - Q(t) )

		firstPick = this.picks[this.picks.length-1];
		Q = this.states[firstPick[0]][firstPick[1]][1][firstPick[2]][3];
		this.states[firstPick[0]][firstPick[1]][1][firstPick[2]][3] += 0.1*(0.9*reward - Q);

		for (var i = this.picks.length-2; i >= 0; i--) {
			this.states[this.picks[i][0]][this.picks[i][1]][1][this.picks[i][2]][3] += 0.1*(0.9*this.states[this.picks[i+1][0]][this.picks[i+1][1]][1][this.picks[i+1][2]][3] - this.states[this.picks[i][0]][this.picks[i][1]][1][this.picks[i][2]][3]);	
		}

	}



	this.createSituation = function(pa){
		id = this.states[nbBilles].length;
		this.states[nbBilles].push([_.cloneDeep(tab), _.cloneDeep(pa)]);

		for (var i = 0; i < this.states[nbBilles][id][1].length; i++) {
			this.states[nbBilles][id][1][i][3] = 0;
		}
	}

	this.findTab = function(){
		for (var i = 0; i < this.states[nbBilles].length; i++) {
			let ok = true;
			for (var j = 0; j < tab.length; j++) {
				for (var k = 0; k < tab[j].length; k++) {
					if(tab[j][k] != this.states[nbBilles][i][0][j][k]) {
						ok = false;
						break;
					}
				}
			}

			if(ok) return i;
		}
		return -1;
	}

	this.takeBest = function(id){
		let bestVal = -99999;
		let act = -1;

		for (var i = 0; i < this.states[nbBilles][id][1].length; i++) {
			if(this.states[nbBilles][id][1][i][3] > bestVal){
				bestVal = this.states[nbBilles][id][1][i][3];
				act = i;
			}
		}

		if(act == -1) alert("wtf");
		return [nbBilles, id, act];
	}

	this.computeReward = function(){
		/*  - nbBilles
			- distance entre les billes
		*/

		let billes = [];
		for (var i = 0; i < tab.length; i++) {
			for(var j = 0; j < tab[i].length; j++){
				if(tab[i][j] == 1){
					billes.push([i, j]);
				}
			}
		}

		let distance = 0;
		for (var i = 0; i < billes.length; i++) {
			for (var j = i; j < billes.length; j++) {
				distance += dist(billes[i][0], billes[i][1], billes[j][0], billes[j][1]);
			}
		}

		distance /= nbBilles; //on divise par le nombre de billes pour avoir une moyenne

		return -nbBilles - distance/8; //le nombre de billes prévaut largement sur la distance entre les billes 
	}
}








function action(x, y, direction){
	switch(direction){
		case"UP":
			tab[x][y] = tab[x][y-1] = 0;
			tab[x][y-2] = 1;
			break;

		case"DOWN":
			tab[x][y] = tab[x][y+1] = 0;
			tab[x][y+2] = 1;
			break;

		case"LEFT":
			tab[x][y] = tab[x-1][y] = 0;
			tab[x-2][y] = 1;
			break;

		case"RIGHT":
			tab[x][y] = tab[x+1][y] = 0;
			tab[x+2][y] = 1;
			break;
	}

	nbBilles--;
	return true;
}



function resetTab(){
	for (var i = 0; i < 7; i++) {
		tab[i] = [];
		for (var j = 0; j < 7; j++) {
			tab[i][j] = 1;
			if(i == 3 && j == 3) tab[i][j] = 0;

			if (i < 2 && j < 2 ||
				i < 2 && j > 4 ||
				i > 4 && j < 2 ||
				i > 4 && j > 4
				) tab[i][j] = -1;
		}	
	}

	moyennes += nbBilles
	if(ia != undefined) ia.think();
	nbBilles = 32;
	adn = [];
	attempt++;
}

function check(){ //sert à vérifier si y'a encore des coups possibles
	let possibleActions = [];
	for (var i = 0; i < tab.length; i++) {
		for (var j = 0; j < tab[i].length; j++) {
			if (isActionPossible(i, j, "UP")) {
				possibleActions.push([i, j, "UP"]);
			}

			if (isActionPossible(i, j, "DOWN")) {
				possibleActions.push([i, j, "DOWN"]);
			}

			if (isActionPossible(i, j, "RIGHT")) {
				possibleActions.push([i, j, "RIGHT"]);
			}

			if (isActionPossible(i, j, "LEFT")) {
				possibleActions.push([i, j, "LEFT"]);
			}
		}
	}

	if(possibleActions.length != 0) return possibleActions;

	if(display) log("Essai " + attempt + ", nombre de billes restantes: " + nbBilles);
	if(nbBilles == 1) {
		play = false;
		log(adn);
	}
	resetTab();

	return check();
}

function isActionPossible(x, y, direction){
	//is the tab and the 
	if(x < 0 && x > 7 && y < 0 && y > 7) return false;
	
	//is in the game
	if(tab[x][y] == -1 || tab[x][y] == 0) return false;

	try{
		switch(direction){
			case"UP":
				if(tab[x][y-1] == 1 && tab[x][y-2] == 0) return true;
				break;

			case"DOWN":
				if(tab[x][y+1] == 1 && tab[x][y+2] == 0) return true;
				break;

			case"LEFT":
				if(tab[x-1][y] == 1 && tab[x-2][y] == 0) return true;
				break;

			case"RIGHT":
				if(tab[x+1][y] == 1 && tab[x+2][y] == 0) return true;
				break;
		}
	}catch(e){}
	return false;
}

function displayTab(){
	for (var i = 0; i < 7; i++) {
		for (var j = 0; j < 7; j++) {
			if(tab[i][j] == 1) fill(0);
			else if(tab[i][j] == 0) fill(200);
			else fill(127);

			circle(width/9 + i*width/11, height/9 + j*height/11, 10)
		}	
	}
}


function moyenne(){
	return moyennes/attempt;
}