newCanvas(300, 300);
var allImagesLoaded = true; //true si pas d'images.

//var
var tabl = [ //objectif: 5 || obstacle: --5
	[0 , 0 , 0 , 0 , 0 , 0 , 0 , 0 , 0, 0], 
	[0 , -5 , 0 , 0 , 0 , 0 , 0 , 0 , 0, 0],
	[0 , 0 , 0 , -5 , -5 , -5 , 0 , 0, 0, 0],
	[-5 , 0 , 0 , -5 , 0 , 0 , 0 , 0 , 0, 5],
	[0 , 0 , 0 , -5 , 5 , 0 , 0 , 0, 0, 0],
	[0 , 0 , 0 , -5 , -5 , -5 , 0 , 0, 0, 0],
	[0 , 0 , 0 , 0 , 0 , 0 , 0 , 0 , 0, 0],
	[0 , 0 , 0 , 0 , 0 , 0 , 0 , 0 , 0, 0],
	[0 , 0 , 0 , 0 , 0 , 0 , 0 , 0 , 0, 0],
	[0 , 0 , 0 , 0 , 0 , 0 , 0 , 0 , 0, 0],
];
var attempt = x = 0;
var y = 0;
var actions = [1, 2, 3, 4];

var ai = new IA();
//--------------------------- 

// /!\  NE PAS OUBLIER allImagesLoaded = true DANS LE DERNIER ONLOAD /!\

if (allImagesLoaded) draw();

function draw(){
	requestAnimationFrame(draw);
	background(127); //fonctionne comme le fill();
	clear();

	fill(0);

	rectCenter = "milieu";
	for(var i = 0; i < tabl.length; i++){
		for (var j = 0; j < tabl[i].length; j++) {
			if(tabl[i][j] == 5){
				fill(0, 255, 0);
				rect(5 + j*(30), 5 + i*30, 5, 5);
			}
			if(tabl[i][j] == -5){
				fill(255, 0, 0);
				rect(5 + j*(30), 5 + i*30, 5, 5);
			}
		}
	}
	fill(0);
	circle(5 + x * 30, 5 + y * 30, 5);
	let s = y * 10 + x;
	let a = ai.pick();
	if(a == 0) x++;
	if(a == 1) x--;
	if(a == 2) y++;
	if(a == 3) y--;
	ai.think(s, a);


	if(tabl[y][x] == 5){
		reset();
	}
	if (x < 0 || x >= 10 || y < 0 || y >= 10) reset();
}


function IA(){
	//init the s table------------------------------
	this.s = [];
	for (var i = 0; i < 100; i++) {
		this.s[i] = [0, 0, 0, 0];
	}
	
	//---------------------------------------------
	this.exploRate = 1;

	this.pick = function(){
		this.exploRate -= 0.00005;
		if(this.exploRate <= 0 && this.exploRate >= -0.00005) log("Number of attempts to find the optimal path :" + attempt);
		if(Math.random() < this.exploRate){
			return random(0, 4, true);
		} else{
			if (this.s[y * 10 + x][1] > this.s[y * 10 + x][2] && 
				this.s[y * 10 + x][1] > this.s[y * 10 + x][3] && 
				this.s[y * 10 + x][1] > this.s[y * 10 + x][0]) return 1;
			if (this.s[y * 10 + x][2] > this.s[y * 10 + x][1] && 
				this.s[y * 10 + x][2] > this.s[y * 10 + x][3] && 
				this.s[y * 10 + x][2] > this.s[y * 10 + x][0]) return 2;
			if (this.s[y * 10 + x][3] > this.s[y * 10 + x][2] && 
				this.s[y * 10 + x][3] > this.s[y * 10 + x][1] && 
				this.s[y * 10 + x][3] > this.s[y * 10 + x][0]) return 3;
			return 0; //Il ne reste qu'une possibilité 
		}

	}

	this.think = function(s, a){ //état d'avant + action qu'on A PRIS
		let r = getReward();
		let max = -10;
		for (var i = 0; i < this.s[y * 10 + x].length; i++) {
			if (this.s[y * 10 + x][i] > max) max = this.s[y * 10 + x][i];
		}
		if (max == -10) alert("Error 1: max = -10");
		this.s[s][a] += 0.1*(r + 0.2*(max - this.s[s][a]));
		//if(r == -5)reset();
	}
}


function isKeyPressed(key){
	switch(key){
		case"Right":
			x ++;
			break;
		case"Left":
			x --;
			break;
		case"Up":
			y --;
			break;
		case"Down":
			y ++;
			break;
	}
}

function reset(){
	x = 0;
	y = 0;
	attempt ++;
}

function getReward(){
	try{
		if(tabl[y][x] == undefined){
			reset();
			return -10;
		} else return tabl[y][x];
	} catch (e){
		reset();
		return -10;
	}
}