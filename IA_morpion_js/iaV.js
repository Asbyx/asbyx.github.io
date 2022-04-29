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
if (allImagesLoaded) draw();

function draw(){
	requestAnimationFrame(draw);
	background(127); //fonctionne comme le fill();
	clear();

	line(0, 100, 300, 100);
	line(0, 200, 300, 200);
	line(100, 0, 100, 300);
	line(200, 0, 200, 300);

	switch(state){
	case"initTrain":
		reset();
		state = "train" + prompt("Visible ou Hard ?");
		break;
	
	case"pause":
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
				ai[1].think(0);
				ai[2].think(0);
				break;

			case 1:
				ai[1].think(1);
				ai[2].think(-1);
				break;

			case 2:
				ai[1].think(-1);
				ai[2].think(1);
				break;
			}
			reset();
			win = false;
		}
		break;

	case"trainVisible":
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
				log("pas de gagnant");
				//thinks, reward 0;
				ai[1].think(0);
				ai[2].think(0);
				break;

			case 1:
				log("Le joueur 1 a gagné !");
				//thinks, reward 1 pour ai[1];
				ai[1].think(1);
				ai[2].think(-1);
				break;

			case 2:
				log("Le joueur 2 a gagné !");
				//thinks, reward 2 pour ai[2];
				ai[1].think(-1);
				ai[2].think(1);
				break;
			}
			reset();
			win = false;
		}
		break;

	case"initTest":
		log("C'est parti !");
		reset();
		ia = ai[2]; //ça doit être la 2 car elle sera joueur 2 lors du test.
		ia.eps = -0.1
		state = "test";
		break;

	case"test":
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
				//thinks, reward 0;
				ia.think(0);
				break;

			case 1:
				alert("Bravo, tu as gagné...");
				//thinks, reward 1 pour ai[1];
				ia.think(-1);
				break;

			case 2:
				alert("L'Intelligence Artificielle t'a battu !");
				//thinks, reward 2 pour ai[2];
				ia.think(1);
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
	this.eps = 0.6;
	this.picks = [];
	for(var i = 0; i < 10; i++){
		this.s[i] = [];
	}

	this.pickRandom = function(){
		let id = -1;
		while(id == -1){
			let r = random(1, 10, true);
			if(g[r] == 0) id = r;
		}
		return id;
	}

	this.pick = function() {
		//vérification si le state est connu.
		let id = -1;
		for(var i = 0; i < this.s[plays].length; i++){
			if(g == this.s[plays][i][0]) {id = i; break;}
		}
		if(id == -1){
			this.s[plays].push([g, 0]);
			id = this.s[plays].length - 1;
		}
		this.picks.push([plays, id]);

		if(Math.random() < this.eps){
			return this.pickRandom();
		} else {
			let id = -1;
			let max = -10000;
			for(var i = 0; i < this.s[plays + 1].length; i++){
				if(this.s[plays + 1][i][1] > max){
					id = i;
					max = this.s[plays + 1][i][1];
				}
			}
			if(id == -1) return this.pickRandom();
			
			for(var i = 1; i < this.s[plays + 1][id][0].length; i++){
				if(g[i] == "0" && g[i] != this.s[plays + 1][id][0][i]) {
					if(player == 2 && g[i] != "1"){
						return i;
					}
					if(player == 1 && g[i] != "5"){
						return i;
					}
				}
			}
			alert("Nothing returned, at ai.pick()");
		}


		/*
		algorithmique:
			tu associes chaque state au nb de plays deja joué

			si tu rencontres un state jamais rencontré:
				tu crées une nouvelle parcelle
					Parcourir la string, regarder à quels emplacements
					il est possible de jouer, créér un nb d'emplacement
					avec [n° de la case, esperance de récompense]

			si tu explores:
				tu joues à un endroit au hasard
			si tu exploites:
				tu parcours tte les actions possibles
				tu regardes la meilleure et tu joues à l'endroit indiqué
				par le n° de la case dans le tableau
		*/
	}

	this.think = function(r){
		try{
			for (var i = this.picks.length - 1; i >= 0; i--) {
				if(i == this.picks.length - 1)
				this.s[this.picks[i][0]][this.picks[i][1]][1] += lr*(r - this.s[this.picks[i][0]][this.picks[i][1]][1]);
				else this.s[ this.picks[i][0] ] [ this.picks[i][1] ] [ 1 ] += lr*(this.s[this.picks[i + 1][0]][this.picks[i + 1][1]][1] - this.s[this.picks[i][0]][this.picks[i][1]][1]);;
			}
			this.picks = [];
		} catch(e){
			alert("Error at ai.think(): " + e);
		}
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
