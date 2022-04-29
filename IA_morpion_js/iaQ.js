newCanvas(300, 300);
var allImagesLoaded = true; //true si pas d'images.

//var
var player = 1;
var state = "initTrain";
var plays = 0;
var win = false;
var g = "-00000000"; //grille: quand vide: 0, j1 met des 1 et j2 met des 5
var ai = [];
ai[1] = new IA();
ai[2] = new IA();
var lr = 0.1;
var attempt = 0;
//--------------------------- 

// /!\  NE PAS OUBLIER allImagesLoaded = true DANS LE DERNIER ONLOAD /!\
function play (hasLogs){
	if (player == 1){
			g = setChar(g, ai[1].pick(), "1");
			player = 2;
	} else {
		g = setChar(g, ai[2].pick(), "5");
		player = 1;
	}
	plays++;

	winner = isWin();
	if(win){
		switch(winner){
		case 0:			
			if(hasLogs)log("pas de gagnant");
			ai[1].think(-1);
			ai[2].think(-1);
			break;

		case 1:
			if(hasLogs)log("Le joueur 1 a gagné !");
			ai[1].think(2);
			ai[2].think(-2);
			break;

		case 2:
			if(hasLogs)log("Le joueur 2 a gagné !");
			ai[1].think(-2);
			ai[2].think(2);
			break;
		}
		reset();
		win = false;
	} else {
		if(player == 2) ai[1].think(0); else ai[2].think(0);
	}
}

if (allImagesLoaded) draw();

function draw(){
	requestAnimationFrame(draw);

	switch(state){
	case"initTrain":
		reset();
		state = "train"+prompt("Visible ou Hard ?");
		break;
	
	case"pause":
	background(127); //fonctionne comme le fill();
	clear();

	line(0, 100, 300, 100);
	line(0, 200, 300, 200);
	line(100, 0, 100, 300);
	line(200, 0, 200, 300);
		fill(0);
		rectCenter = "milieu";
		drawCase(g[1], 0, 2);
		drawCase(g[2], 1, 2);
		drawCase(g[3], 2, 2);
		drawCase(g[4], 0, 1);
		drawCase(g[5], 1, 1);
		drawCase(g[6], 2, 1);
		drawCase(g[7], 0, 0);
		drawCase(g[8], 1, 0);
		drawCase(g[9], 2, 0);
		break;

	case"trainHard":
		play(false);
		break;

	case"trainVisible":
	background(127); //fonctionne comme le fill();
	clear();

	line(0, 100, 300, 100);
	line(0, 200, 300, 200);
	line(100, 0, 100, 300);
	line(200, 0, 200, 300);
		fill(0);
		rectCenter = "milieu";
		drawCase(g[1], 0, 2);
		drawCase(g[2], 1, 2);
		drawCase(g[3], 2, 2);
		drawCase(g[4], 0, 1);
		drawCase(g[5], 1, 1);
		drawCase(g[6], 2, 1);
		drawCase(g[7], 0, 0);
		drawCase(g[8], 1, 0);
		drawCase(g[9], 2, 0);

		play(true);
		break;

	case"initTest":
		log("C'est parti !");
		reset();
		ia = ai[2]; //ça doit être la 2 car elle sera joueur 2 lors du test.
		ia.eps = -0.1
		state = "test";
		break;

	case"test":
	background(127); //fonctionne comme le fill();
	clear();

	line(0, 100, 300, 100);
	line(0, 200, 300, 200);
	line(100, 0, 100, 300);
	line(200, 0, 200, 300);
		fill(0);
		rectCenter = "milieu";
		drawCase(g[1], 0, 2);
		drawCase(g[2], 1, 2);
		drawCase(g[3], 2, 2);
		drawCase(g[4], 0, 1);
		drawCase(g[5], 1, 1);
		drawCase(g[6], 2, 1);
		drawCase(g[7], 0, 0);
		drawCase(g[8], 1, 0);
		drawCase(g[9], 2, 0);


		winner = isWin();
		if(win){
			switch(winner){
			case 0:
				alert("pas de gagnant");
				break;

			case 1:
				alert("Bravo, tu as gagné...");
				break;

			case 2:
				alert("L'Intelligence Artificielle t'a battu !");
				break;
			}
			reset();
			win = false;
		}
		
		if(player == 2){
			g = setChar(g, ia.pick(), "5");
			player = 1;
			plays++;
		}
		break;
	}
}

function drawCase (id, x, y){
	if(id == 1) rect(50 + 100*x, 50 + 100*y, 20, 20);
	else if(id == 5) circle(50 + 100*x, 50 + 100*y, 20);

}

function IA (){
	this.s = [];
	for (var i = 0; i < 10; i++) {
		this.s[i] = [];
	}
	this.eps = 0.5;


	//eps: 0.5;
	this.pick = function(){
		let id = -1;
		for(var i = 0; this.s[plays].length; i++){
			try{
				if(g == this.s[plays][i][0]){
					id = i;
					break;
				}
			} catch(e){
				break;
			}
		}
		if(id == -1){
			id = this.s[plays].length;
			this.s[plays].push([g, []]);
			for (var i = 0; i < g.length; i++) {
				if(g[i] == 0){
					this.s[plays][id][1].push([i, 0]);
				}
			}
		}

		if(Math.random() < this.eps){ //eps == 0.5
			return this.pickRandom(id);
		} else
		{
			//on prend la meilleure action
			let valueOfAction = -1000;
			let indexOfAction = -1; //dans g
			let indexOfActionInStates = -1; //dans le this.s
			for(var i = 0; i < this.s[plays][id][1].length; i++){
				if(this.s[plays][id][1][i][1] > valueOfAction){
					valueOfAction = this.s[plays][id][1][i][1];
					indexOfAction = this.s[plays][id][1][i][0];
					indexOfActionInStates = i;
				}
			}
			if(indexOfAction != -1) {
				this.picks = this.s[plays][id][1][indexOfActionInStates];
				return indexOfAction;
			} else alert("Error: indexOfAction == -1, at the end of IA.pick()");
		}

		alert("Error: random returned, at the end of IA.pick()");
		return this.pickRandom(id);
	}

	//gamma: 0.9;
	this.think = function(r){
		/*	là on est dans le S(t+1);
			on cherche donc à changer la derniere action qu'on a prise
			on a besoin de:
				OU un pointeur vers la valeur 

				valeur de la meilleure action mtn

			formule: Q(t) += 0.1*( 0.9*Q(t+1) - Q(t) )
		*/
		Q = this.getBestAction();
		this.picks[1] = 0.1*(r + 0.9*Q - this.picks[1] );
	}

	this.pickRandom = function(id){
		let i = 0;
		while(g[i] != 0){
			i = random(1, 10, true);
		}
		return i;
	}

	this.getBestAction = function(){
		let id = -1;
		for(var i = 0; this.s[plays].length; i++){
			try{
				if(g == this.s[plays][i][0]){
					id = i;
					break;
				}
			} catch(e){
				break;
			}
		}
		if(id == -1) {
			//log("situation non-existante");
			return 0;
		}
		//on prend la meilleure action
		let max = -1000;
		for(var i = 0; i < this.s[plays][id][1].length; i++){
			if(this.s[plays][id][1][i][1] > max){
				max = this.s[plays][id][1][i][1];
			}
		}
		if(max == -1000) alert("Error: max = -1000, in IA.getBestAction()");
		return max;
	}
}

function isKeyPressed (key){
	if(key == "Space") state = "trainVisible";
	if(key == "Shift") state = "trainHard";
	if(key == "Enter") state = "initTest";

	if(state == "test" && player == 1 && g[parseInt(key)] == 0){
		g = setChar(g, parseInt(key), "1");
		plays ++;
		player = 2;
	}

	if(key == "s") save();
}

function isWin(){
	if (g[1]+g[2]+g[3] == "111" ||
		g[4]+g[5]+g[6] == "111" ||
		g[7]+g[8]+g[9] == "111" ||
		g[1]+g[4]+g[7] == "111" ||
		g[2]+g[5]+g[8] == "111" ||
		g[3]+g[6]+g[9] == "111" ||
		g[1]+g[5]+g[9] == "111" ||
		g[3]+g[5]+g[7] == "111" 
		) {
		win = true;
		return 1;
	}

	if (g[1]+g[2]+g[3] == "555" ||
		g[4]+g[5]+g[6] == "555" ||
		g[7]+g[8]+g[9] == "555" ||
		g[1]+g[4]+g[7] == "555" ||
		g[2]+g[5]+g[8] == "555" ||
		g[3]+g[6]+g[9] == "555" ||
		g[1]+g[5]+g[9] == "555" ||
		g[3]+g[5]+g[7] == "555" 
		) {
		win = true;
		return 2;
	}
	if (plays == 9) win = true;
	return 0;
}

function reset(){
	win = false;
	g = "-000000000";
	player = random(1, 3, true);
	plays = 0;
	attempt++;
}

function setChar (str, index, char){
	return str.substring(0, index) + char + str.substring(index+1, str.length);
}
