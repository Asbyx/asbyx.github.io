newCanvas(1000, 700);
var allImagesLoaded = false;

//var----------------------------------
//generals
var state = "menu";
var bkg = 175;
var timer = 0;
var timerPause = 0;
var j;
var sens = 8;
var str = [];
str[0] = "What a nightmare....             ";
str[1] = "I'm glad to have a water pistol in my desk.";
str[2] = "In this nightmare, I survived "+0+" waves and killed about "+0+" flames."
str[3] = "Anyway, let's get back to bed...";
var i;
//---------------------------

//gameplay-------------------
var waveTimer = -1;
var nbWave = 0;
var endWave = true;
var isShopOpen = false;
var bonus = 0;
var kills = 0;

var yOnMenu = 1;
var xInShop = 1, yInShop = 1, canGo = true;


var flames = [];
var imgFlame = newImage("img/flame.png");

var eau = [];
var eauUsed = 0;
var imgEau = newImage("img/water.png"); //je vais pas recharger l'image de l'eau à chaque fois
//---------------------------

//images--------------------- 	pour la publication, ne pas oublier "LogNightmare/"+src dans newImage de libyx !
var wood = [];
wood[1] = newImage("img/wood.png"); wood[2] = newImage("img/wood2.png"); wood[3] = newImage("img/wood3.png"); wood[4] = newImage("img/wood4.png");
var end = newImage("img/end.png");
//On pourrait oprimiser en créant un objet Pistol mais j'ai plus le temps T_T
var pistol1 = newImage("img/pistol1.png"), pistol2 = newImage("img/pistol2.png"), pistol3 = newImage("img/pistol3.png"), pistol4 = newImage("img/pistol4.png"), pistol5 = newImage("img/pistol5.png"), pistol6 = newImage("img/pistol6.png");
var pistol1IsSell, pistol2IsSell, pistol3IsSell, pistol4IsSell, pistol5IsSell, pistol6IsSell;
pistol1IsSell = pistol2IsSell = pistol3IsSell = pistol4IsSell = pistol5IsSell = pistol6IsSell = false;
var prize = []; prize[1] = 10; prize[2] = 85;  prize[3] = 200; prize[4] = 500;  prize[5] = 5000;  prize[6] = 15000;

var platforme = newImage("img/platform.png");
var lance = newImage("img/lanceFlammes.png");
var openShop = newImage("img/openShop.png");
var closedShop = newImage("img/closedShop.png");
closedShop.onload = allImagesLoaded = true;
var taille = 10;
//---------------------------
//-------------------------------------
if (allImagesLoaded) draw();


function draw(){
	requestAnimationFrame(draw);
	background(bkg, 0, 0);

	timer ++;

	switch(state){
    case"menu":
    timer++;
  		fill(0);
  		textSize = 15;
  		text("Use the arrow keys to move (or zqsd)", 0, height-75);
  		text("Spacebar to shoot", 0, height-50);
  		text("Shift to enter the shop", 0, height-25);
  		textSize = 30;
  		text("Fall asleep", width/2, height - height/3+10);
  		text("Credits / Options", width/2, height - height/6+10);
  		textSize = 64;
  		text("LOG NIGHTMARE", 225, height/6);
  		if(yOnMenu == 1){
  			drawImage(wood[1], width/2 - wood[1].width*taille/2 - 10, height - height/3 - 15, taille/2, taille/2);
  			if(isKeyDown("Down")) yOnMenu = 2;
  		} else {
  			drawImage(wood[1], width/2 - wood[1].width*taille/2 - 10, height - height/6 - 15, taille/2, taille/2);
  			if(isKeyDown("Up")) yOnMenu = 1;
  		}

  		if(isKeyDown("Space") && timer > 100){
  			timer = 0;
  			if (yOnMenu == 1) state = "initGame";
  			else state = "credits";
  		}
  		break;

  	case "credits":
  		timer ++;
  		textSize = 30;
  		fill(0);
  		text("Menu", width/2, height - height/3+10 - 250);
  		textSize = 20;
  		text("Concept, programmation, graphism, etc...", width/2 - 200, height - height/3+10);
  		text("Asbyx", width/2 - 50, height - height/3+10 + 20, "bold Arial");
  		text("^_^ Thanks for playing ! ^_^", width/2 - 150, height - height/3+100);

  		text("Adjust your speed (default : 8)", width/2 + 150, height/3 - 15);
  		text(sens, width/2 + 150, height/3+15);

  		if (isKeyDown("1") || isKeyDown("&")) sens = 1;
  		if (isKeyDown("2") || isKeyDown("é")) sens = 2;
  		if (isKeyDown("3") || isKeyDown("\"")) sens = 3;
  		if (isKeyDown("4") || isKeyDown("'")) sens = 4;
  		if (isKeyDown("5") || isKeyDown("(")) sens = 5;
  		if (isKeyDown("6") || isKeyDown("-")) sens = 6;
  		if (isKeyDown("7") || isKeyDown("è")) sens = 7;
  		if (isKeyDown("8") || isKeyDown("_")) sens = 8;
  		if (isKeyDown("9") || isKeyDown("ç")) sens = 9;

  		drawImage(wood[1], width/2 - wood[1].width*taille/2 - 10, height - height/3 - 15 - 250, taille/2, taille/2);
  		if(isKeyDown("Space") && timer > 100) {timer = 0; state = "menu";}
  		break;

  	case"initGame":
  		if(timer > 175) { 
  			if(timer >= 300) {
  				timer = 0;
  				waveTimer = 200;
          		bkg = 175;
          		j = new Player(sens);
          		bonus = 0;
          		nbWave = kills = 0;
          		flames = [];
          		xInShop = yInShop = 1;
          		pistol1IsSell = pistol2IsSell = pistol3IsSell = pistol4IsSell = pistol5IsSell = pistol6IsSell = false;
  				state = "game"; 
  			}
  		} else bkg --;
  		break;

  	case"game":
      timerPause++;
        if(isKeyDown("p") && timerPause > 100) {timerPause = 0; state = "pause";}
      	drawImage(platforme, 0, height-225, taille, taille/2);
      	drawImage(platforme, width - platforme.width*taille, height-225, taille, taille/2);
      	drawImage(platforme, width/2 - platforme.width*taille/2, height-450, taille, taille/2);
      	drawImage(lance, 0, 50, taille, taille);
      	drawImage(lance, width-lance.width*taille, 50, taille, taille, Math.PI);
      	if(isShopOpen === false) drawImage(closedShop, width-250, height-150, taille, taille); else drawImage(openShop, width-250, height-150, taille, taille);
  		fill(0);
  		textSize = 16;
  		text(j.gold + " $", width - 60, 15);

      	j.show();
      	eau.forEach(e => e.show(e));
      	
  		
  		//wave
  		if (endWave){
  			if (waveTimer < timer) waveTimer = timer + 200;
  			if (timer >= waveTimer){
  				nbWave++;
  				endWave = false;
  				waveTimer = (timer) + nbWave * 4
  				isShopOpen = false;
  			}
  		} else {
  			if(waveTimer >= timer && timer % 2 == 0) {
  				flames[flames.length] = new Flame(); 
  				flames[flames.length - 1].pv = nbWave*15;
  				if(nbWave*15 > 1000) flames[flames.length - 1].pv = 1000;
  			}
  			if(waveTimer == timer){
  				bonus = (nbWave* 15 * 4 * 1/j.pistol)*2; 
  				eauUsed = 0;
  			}
  			var nbMort = 0; 
  			for (i = flames.length - 1; i >= 0; i--) {
  				if (flames[i].pv > 10) flames[i].show(); else {if(!flames[i].deathCounted){kills++; flames[i].deathCounted = true;};nbMort++;}
  			}
  			if (nbMort == flames.length && flames.length != 0) {
  				j.gold += nbMort * j.pistol;
  				j.totalGold += nbMort;
  				if(eauUsed < bonus) {j.gold += (bonus - eauUsed)*1.5;
  				console.log("bonus reçu: "+ (bonus - eauUsed)*1.5);}
  				flames = []; 
  				endWave = true; 
  				isShopOpen = true;
  			}
  		}
  		//shop
  		if(isShopOpen){
  			fill(0);
  			if(j.x > 700 && isKeyDown('Shift')) state = "shop";
  		}

  		if(j.pv <= 0) {
  			bkg --;
  			if (bkg == 0) {
  				timer = 0; 
  				state = "gameover";
  				str[2] = "In this nightmare, I survived "+nbWave+" waves and killed about "+kills+" flames.";
  				kongregate.stats.submit('Waves survived', nbWave);
  				kongregate.stats.submit('kills', kills);
  				kongregate.stats.submit('Pistol got', j.pistol);
  			}
  		}

  		break;


  	case "shop": 
  		background(0, 80, 0);

  		fill(0);
  		textSize = 75;
  		text("Shop", width/2 - textSize, height/10);
  		textSize = 25;
  		text(j.gold + " $", width - 100 - textSize, height/8);
  		textSize = 16;
  		text("Escape to go out", 0, height - 14);

  		fill(0, 150, 0);
  		textSize = 32;
  		for (var i = 0; i < 3; i++) {
  			for (var k = 0; k < 2; k++) {
  				rect(100 + 300*i, 150 + 300*k, 200, 150);
  				text(prize[i+k*3+1] +" $", 150 + 300*i + textSize, 350 + 300*k);
  			}
  		}
  		if(!pistol1IsSell)drawImage(pistol1, 200, 225, taille, taille, 0, true);
  		if(!pistol2IsSell)drawImage(pistol2, 200+300*1, 225, taille, taille, 0, true);
  		if(!pistol3IsSell)drawImage(pistol3, 200+300*2, 225, taille, taille, 0, true);
  		if(!pistol4IsSell)drawImage(pistol4, 200, 225+300, taille, taille, 0, true);
  		if(!pistol5IsSell)drawImage(pistol5, 200+300*1, 225+300, taille, taille, 0, true);
  		if(!pistol6IsSell)drawImage(pistol6, 200+300*2, 225+300, taille, taille, 0, true);

  		drawImage(wood[1], 215 + 300*(xInShop - 1), 375 + 300*(yInShop - 1), taille/2, taille/2, 0, true);
  		if((isKeyDown("Right") || isKeyDown("d")) && canGo && xInShop != 3) {
  			xInShop++;
  			canGo = false;
  		}
  		if((isKeyDown("Left") || isKeyDown("q"))&& canGo && xInShop != 1) {
  			xInShop--;
  			canGo = false;
  		}
  		if(!isKeyDown("Right") && !isKeyDown("Left") && !isKeyDown("q") && !isKeyDown("d")) canGo = true;
  		if((isKeyDown("Down") || isKeyDown("s")) && yInShop != 2) yInShop++;
  		if((isKeyDown("Up") || isKeyDown("z")) && yInShop != 1) yInShop--;

  		if(isKeyDown("Escape")) state = "game";

  		if(isKeyDown("Space")){ 
  			if (xInShop == 1 && yInShop == 1 && j.gold >= prize[1] && !pistol1IsSell){
  				pistol1IsSell = true;
  				j.gold -= prize[1];
  				j.pistol = 1;
  			}
  			if (xInShop == 2 && yInShop == 1 && j.gold >= prize[2] && !pistol2IsSell){
  				pistol2IsSell = true;
  				j.gold -= prize[2];
  				j.pistol = 2;
  			}
  			if (xInShop == 3 && yInShop == 1 && j.gold >= prize[3] && !pistol3IsSell){
  				pistol3IsSell = true;
  				j.gold -= prize[3];
  				j.pistol = 3;
  			}
  			if (xInShop == 1 && yInShop == 2 && j.gold >= prize[4] && !pistol4IsSell){
  				pistol4IsSell = true;
  				j.gold -= prize[4];
  				j.pistol = 4;
  			}
  			if (xInShop == 2 && yInShop == 2 && j.gold >= prize[5] && !pistol5IsSell){
  				pistol5IsSell = true;
  				j.gold -= prize[5];
  				j.pistol = 5;
  			}
  			if (xInShop == 3 && yInShop == 2 && j.gold >= prize[6] && !pistol6IsSell){
  				pistol6IsSell = true;
  				j.gold -= prize[6];
  				j.pistol = 6;
  			}
  		}

  		break;

  	case "gameover":
  		timer+=0.005;
  		drawImage(end, width/2, height/2, taille, taille, 0, true);
  		fill(255);
  		textSize = 16;
  		if(timer < str[0].length){
  			for (var i = 0; i < timer; i++) {
  				text(str[0][i], 10 + 8.75*i, 20, "Monospace");
  			}
  		} else text(str[0], 10, 20, "Monospace");

  		if(timer > str[0].length + 20 && timer < str[1].length + str[0].length + 20){
  			for (var i = 0; i < timer - str[0].length - 20; i++) {
  				text(str[1][i], 10 + 8.75*i, 40, "Monospace");
  			}
  		} else if(timer > str[1].length + str[0].length + 20)text(str[1], 10, 40, "Monospace");
  		
  		if(timer > str[0].length + str[1].length + 60 && timer < str[2].length + str[1].length + str[0].length + 60){
  			for (var i = 0; i < timer - str[1].length - str[0].length - 60; i++) {
  				text(str[2][i], 10 + 8.75*i, 60, "Monospace");
  			}
  		} else if(timer > str[2].length + str[1].length + str[0].length + 60)text(str[2], 10, 60, "Monospace");

  		if(timer > str[0].length + str[1].length + str[2].length + 200 && timer < str[3].length + str[2].length + str[1].length + str[0].length + 200){
  			for (var i = 0; i < timer - str[2].length - str[1].length - str[0].length - 200; i++) {
  				text(str[3][i], 10 + 8.75*i, 80, "Monospace");
  			}
  		} else if(timer > str[3].length + str[2].length + str[1].length + str[0].length + 200){text(str[3], 10, 80, "Monospace"); textSize = 10; text("Shift to return to the menu", 5, 695)};

  		if (timer > 200 && isKeyDown("Shift")) {state = "menu"; bkg = 175;}
  		break;


    case "pause":
      timerPause ++;
      background(0, 0, 0);
      textSize = 32;
      fill(127);
      text("Pause", 50, 50);
      text("Wave in progress : "+nbWave, 50, 75);
      if(isKeyDown("p") && timerPause > 100) {timerPause = 0;state = "game";}
      break;
  	}
}