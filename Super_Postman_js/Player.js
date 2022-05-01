var l = "img/Player/";
var anim = [];
//1 = run
anim[1] = [];
anim[1][0] = newImage(l+"run/postman_run0.png");
anim[1][1] = newImage(l+"run/postman_run1.png");
anim[1][2] = newImage(l+"run/postman_run2.png");
anim[1][3] = newImage(l+"run/postman_run3.png");
anim[1][4] = newImage(l+"run/postman_run4.png");
anim[1][5] = newImage(l+"run/postman_run5.png");
anim[1][6] = newImage(l+"run/postman_run6.png");

//2 = jump
anim[2] = [];
anim[2][0] = newImage(l+"jump/postman_jump0.png");
anim[2][1] = newImage(l+"jump/postman_jump1.png");
anim[2][2] = newImage(l+"jump/postman_jump2.png");

//3 = Prepare shoot
anim[3] = [];
anim[3][0] = newImage(l+"prepareShoot/postman_prepareShoot0.png");
anim[3][1] = newImage(l+"prepareShoot/postman_prepareShoot1.png");
anim[3][2] = newImage(l+"prepareShoot/postman_prepareShoot2.png");
anim[3][3] = newImage(l+"prepareShoot/postman_prepareShoot3.png");

//4 = inAir
anim[4] = [];
anim[4][0] = newImage(l+"postman_inAir.png");

//0 = stand
anim[0] = [];
anim[0][0] = newImage(l+"postman_stand.png");


function Player(x, y){
	anim["state"] = 0;
	this.x = x*16*taille;
	this.y = y*16*taille;
	this.NImg = 0; //numéro de l'image
	this.speed = 2;
	this.direc = "right";
	this.inertie = 0;

	this.f = new Vector(5, 0);
	
	this.isTir = false;
	this.timerTir = 0;
	this.hasShoot = false;
	this.win = false;
	this.winTimer = 0;

	this.update = function(){
		//tir
		if(this.isTir){
			anim["state"] = 3;
			this.timerTir ++;

			let Nimg = this.NImg;
			this.show();
			
			if(isKeyDown("Up")) this.f.setAngle(this.f.angle() - Math.PI/64);
			if(isKeyDown("Down")) this.f.setAngle(this.f.angle() + Math.PI/64);

			fill(127, 0, 0);
			if(this.direc == "right") line(this.x+15, this.y+14, this.x + 15 + this.f.x*12, this.y + 14 + this.f.y*12);
			else line(this.x+15, this.y+14, this.x+15 + -this.f.x*12, this.y +14 + this.f.y*12);;

			if(this.timerTir < 30) {this.NImg = Nimg; return} else this.timerTir = 0;
		}

		if (this.hasShoot && !this.win){
			try{this.gravite();} catch(e) {this.y += this.inertie;}
			anim["state"] = 0; 
			this.show();
			l.show();
			return;
		}

		if(this.win){
			this.winTimer ++;
			try{this.gravite();} catch(e) {this.y += this.inertie;}
			anim["state"] = 0; 
			this.show();
			for (var i = c.length - 1; i >= 0; i--) {
				if(c[i].timer < 30)c[i].show();
			}
			if (this.winTimer > 200) {lvl++; j.respawn();}
			return;
		}

		//respawn
		if(Math.round((this.y + 15 - camy)/16/taille) >= lvls[lvl].length) {this.respawn();}
		

		//gauche droite
		if(isKeyDown("d") || isKeyDown("q") || isKeyDown("a")) {
			if(isKeyDown("d") && this.canGoRight()){
					if(this.x < width/2 || camx < lvls[lvl]["minX"]) this.x += this.speed; else camx -= this.speed;
					this.direc = "right";
			} 
			if((isKeyDown("q") || isKeyDown("a"))&& this.canGoLeft()){
					if(this.x > width/2 || camx > lvls[lvl]["maxX"]) this.x -= this.speed; else camx += this.speed;
					this.direc = "left";
			} 
			if(anim["state"] != 3) anim["state"] = 1;
		} else if(anim["state"] != 3) anim["state"] = 0;

		//gravité et tt le reste
		this.gravite();

		//log("Place in table: lvls["+lvl+"]["+Math.round((this.y - camy)/16/taille)+"]["+Math.round((this.x - camx)/16/taille)+"]");
		this.show();
	}


	this.gravite = function(){
		if(this.canGoDown()){
			if(!this.canGoUp()) this.inertie = 0;
				if(this.inertie < 7.5) this.inertie += 0.5;
				this.y += this.inertie;
				if(anim["state"] == 1)anim["state"] = 0;
				if(this.inertie > 0 && anim["state"] != 3) anim["state"] = 4;
		} else {
			if(isKeyDown("z") || isKeyDown("w")){
				this.inertie = -7.5;
				this.y -= 2;
				if(anim["state"] != 3) anim["state"] = 2;
			}
		}
	}

	this.show = function(){
		if(this.direc == "left") drawImage(this.getImg(), this.x+32, this.y, taille, taille, 0, true);
		else drawImage(this.getImg(), this.x, this.y, taille, taille, "invert", true);
	}
	this.respawn = function(){
		j = 0; 
		camx = 0; 
		return;
	}


	this.canGoDown = function (){
		try{
			if ((lvls[lvl][Math.round((this.y + 16 - camy)/16/taille)][Math.round((this.x + 15 - camx)/16/taille)] >= 1 && lvls[lvl][Math.round((this.y + 16 - camy)/16/taille)][Math.round((this.x + 15 - camx)/16/taille)] <= 4) || lvls[lvl][Math.round((this.y + 16 - camy)/16/taille)][Math.round((this.x - 16 - camx)/16/taille)] >= 1 && lvls[lvl][Math.round((this.y + 16 - camy)/16/taille)][Math.round((this.x - 16 - camx)/16/taille)] <= 4) {
				this.y = camy + Math.round((this.y - camy)/16/taille)*16*taille;
				return false;
			}
			if ((lvls[lvl][Math.round((this.y + 16 - camy)/16/taille)][Math.round((this.x + 15 - camx)/16/taille)] == 5) || lvls[lvl][Math.round((this.y + 16 - camy)/16/taille)][Math.round((this.x - 16 - camx)/16/taille)] == 5) {
				this.inertie = -15;
				return true;
			}
			return true;
		} catch (e) {
			if(!this.hasShoot)this.respawn(); else return true;
			//log("Error: "+e);
		}
	}

	this.canGoUp = function (){
		try{
			if ((lvls[lvl][Math.round((this.y - 16 - camy)/16/taille)][Math.round((this.x + 15 - camx)/16/taille)] >= 1 && lvls[lvl][Math.round((this.y - 16 - camy)/16/taille)][Math.round((this.x + 15 - camx)/16/taille)] <= 4) || lvls[lvl][Math.round((this.y - 16 - camy)/16/taille)][Math.round((this.x - 16 - camx)/16/taille)] >= 1 && lvls[lvl][Math.round((this.y - 16 - camy)/16/taille)][Math.round((this.x - 16 - camx)/16/taille)] <= 4) {
				this.inertie = 0;
				return false;
			}
			return true;
		} catch(e){
			return true;
		}
	}

	this.canGoRight = function () {
		try{
			if(lvls[lvl][Math.round((this.y + 15 - camy)/16/taille)][Math.round((this.x + 32 - camx)/16/taille)] >= 1 && lvls[lvl][Math.round((this.y + 15 - camy)/16/taille)][Math.round((this.x + 32 - camx)/16/taille)] <= 4){
				if(this.x + 32 + this.speed > camx + Math.round((this.x + 32 - camx)/16/taille)*16*taille){
					return false;
				}
			}
			if(lvls[lvl][Math.round((this.y - 15 - camy)/16/taille)][Math.round((this.x + 32 - camx)/16/taille)] >= 1 && lvls[lvl][Math.round((this.y - 15 - camy)/16/taille)][Math.round((this.x + 32 - camx)/16/taille)] <= 4){
				if(this.x + 32 + this.speed > camx + Math.round((this.x + 32 - camx)/16/taille)*16*taille){
					return false;
				}
			}
			return true;
		} catch(e){
			return true;
		}
	}
	
	this.canGoLeft = function () {
		try{
			if(lvls[lvl][Math.round((this.y + 15 - camy)/16/taille)][Math.round((this.x - 32 - camx)/16/taille)] >= 1 && lvls[lvl][Math.round((this.y + 15 - camy)/16/taille)][Math.round((this.x - 32 - camx)/16/taille)] <= 4){
				if(this.x - 32 - this.speed < camx + Math.round((this.x - 32 - camx)/16/taille)*16*taille){
					return false;
				}
			}
			if(lvls[lvl][Math.round((this.y - 15 - camy)/16/taille)][Math.round((this.x - 32 - camx)/16/taille)] >= 1 && lvls[lvl][Math.round((this.y - 15 - camy)/16/taille)][Math.round((this.x - 32 - camx)/16/taille)] <= 4){
				if(this.x - 32 - this.speed < camx + Math.round((this.x - 32 - camx)/16/taille)*16*taille){
					return false;
				}
			}
			return true;
		} catch (e){
			return true;
		}
	}

	this.getImg = function() {
		let img;
		switch(anim["state"]){
		case 0:
			img = anim[0][0];
			this.NImg = 0;
			break;

		case 1:
			this.NImg += 0.3;
			if(this.NImg >= 6.5) this.NImg = 0;
			img = anim[1][Math.round(this.NImg)];
			break;

		case 2:
			this.NImg += 0.1;
			if(this.NImg >= 2.5) {
				anim["state"] = 0;
				this.NImg = 2;
			}
			img = anim[2][Math.round(this.NImg)];
			break;

		case 3:
			if(this.NImg < 3) this.NImg += 1;
			img = anim[3][Math.round(this.NImg)];
			break;
		
		case 4:
			img = anim[4][0];
			this.NImg = 0;
			break;
		}
		return img;
	}
}