newCanvas(800, 600);
var allImagesLoaded = false; //true si pas d'images.

//var
//generals
var taille = 2;
var lvl = 0;
var state = "game";

var camx = 0, camy = 0;

var j = 0; //mettre à cette valeur pour permettre l'initialisation du joueur dans le construct
//--------------------------- 

// /!\  NE PAS OUBLIER allImagesLoaded = true DANS LE DERNIER ONLOAD /!\
anim[0][0].onload = allImagesLoaded = true;
if (allImagesLoaded) draw();

function draw(){
	requestAnimationFrame(draw);
	clear();
	background(0, 100, 255); //fonctionne comme le fill();
	construct(lvl);
	j.update();
	kongregate.stats.submit('Levels done', lvl);

	switch(lvl){
	case 0:
		fill(0);
		textSize = 16;
		text("ZQSD or WASD to move", camx + 50, 200);
		text("This is a rebouncer :)", camx + 400, 375);
		text("Your goal is to send the letter ind the mailbox", camx + 50, 50);
		text("Press the spacebar to prepare the shoot, then aim with the arrow keys, then spacebar to shoot", camx + 50, 75);
		break;

	case 5:
		fill(0);
		textSize = 10;
		text("Most difficult jump =)", camx + 290, 150);
		break;

	case 6:
		fill(0);
		textSize = 10;
		text("R to reset :)", camx + 260, 150);
		break;

	case 10:
		fill(0);
		textSize = 10;
		text("Try to do a short jump by pressing against the block", camx + 1025, 400);
		text("to avoid the rebouncer, it will be easier =)", camx + 1025, 415);
		break;

	case 14:
		fill(0);
		textSize = 10;
		text("Good luck, even I have to tryhard to complete this level :)", camx, height - 10);
		break;

	case 15:
		fill(0);
		textSize = 13;
		text("Last level ! =P", camx, 13);
		break;

	case 16:
		fill(0);
		textSize = 16;
		text("THANKS FOR PLAYING !", camx + width/2 - 112, 100);
		text("I hope you had some fun =)", camx + 285, 125);
		textSize = 13;
		break;
	}
}

function isKeyPressed(key){
	if(state == "game"){
		if(key == "Space" && !j.hasShoot) {
			if(!j.isTir) {
				j.isTir = true; 
				j.NImg = 0;
			} else {
				j.isTir = false; 
				j.hasShoot = true; 
				anim["state"] = 0;
				if(j.direc == "left") j.f.x *=-1;
				l = new Lettre (j.x+15, j.y+14, j.f);
			}
		}
		if(key == "r"){
			j.respawn();
		}
	}
} 