function Player (sens) {
	this.x = width/2 - 115/2;
	this.y = height - 34;
	this.img = newImage("img/wood.png");
	this.direction = 0;
	
	this.pistol = 1;
	this.gold = 0;
	this.totalGold;

	this.speed = sens;
	this.canJump = true;
	this.inertie = 0;
	this.pv = 400;

	this.gravity = function(){
		if (this.inertie < 15) this.inertie ++;
		this.y += this.inertie;
	}

	this.platformsLeftSide = function(x, y1, y2){
		if (this.x <= x && this.x + this.speed > x && this.y >= y1 && this.y <= y2) {
				this.x = x;
				return true;
		}
		return false
	}
	this.platformsRightSide = function(x, y1, y2){
		if (this.x >= x && this.x - this.speed < x && this.y >= y1 && this.y <= y2) {
				this.x = x;
				return true;
		}
		return false
	}

	this.drawPistol = function(i){
		//c degueulasse mais j'ai la flemme.
		if(this.direction == Math.PI) {drawImage(i, this.x + 60, this.y, taille/2, taille/2, 0, true);} else {ctx.translate(this.x-60, this.y); ctx.scale(1, -1);drawImage(i, 0, 0, taille/2, taille/2, Math.PI, true); ctx.setTransform(1, 0, 0, 1, 0, 0)}
	}



	this.show = function(){
		if(this.pv < 300 && this.pv > 250) this.img = wood[2];
		if(this.pv < 200 && this.pv > 150) this.img = wood[3];
		if(this.pv < 100 && this.pv > 50) this.img = wood[4];
		drawImage(this.img, this.x, this.y, taille/1.5, taille/1.5, this.direction, true);
		switch(this.pistol){
		case 1:
			this.drawPistol(pistol1);
			break;
		
		case 2:
			this.drawPistol(pistol2);
			break;

		case 3:
			this.drawPistol(pistol3);
			break;

		case 4:
			this.drawPistol(pistol4);
			break;

		case 5:
			this.drawPistol(pistol5);
			break;

		case 6:
			this.drawPistol(pistol6);
			break;
		}

		//tir
		if(isKeyDown("Space")) {
		let x,y;
			switch(this.pistol){
			case 1:
			case 2:
			case 3:
			case 4:
				x = this.x + 80;
				y = this.y - 5 ;
				x1 = this.x - 80;
				break;

			case 5:
				x = this.x + 88;
				y = this.y - 5 ;
				x1 = this.x - 88;
				break;

			case 6:
				x = this.x + 90;
				y = this.y - 5 ;
				x1 = this.x - 90;
				break;
			}
			for (var k = this.pistol*2 - 1; k >= 0; k--) {
				if(this.direction == Math.PI) {var e = new Eau(x, y, true, this.pistol);} else {var e = new Eau(x1, y, false, this.pistol);}
			}
		}

//mouvements-----------------
		if(this.pv > 0){
			if((isKeyDown("Right") || isKeyDown("d")) && this.x + this.speed < width - this.img.width/2*taille/1.5) {
				if (!this.platformsLeftSide(627.5, 460, 544) && !this.platformsLeftSide(285, 200, 322)) {this.x += this.speed; this.direction = Math.PI;}
			}
			if((isKeyDown("Left") || isKeyDown("q")) && this.x - this.speed > 40 + this.img.height/2*taille/1.5) {
				if (!this.platformsRightSide(372.5, 460, 544) && !this.platformsRightSide(712.5, 200, 322)) {this.x -= this.speed; this.direction = 0;}
			}
			if ((this.y > 544 && this.y + this.inertie < 544 && this.x < 372.5) || (this.y > 544 && this.y + this.inertie < 544 && this.x > 627.5) || (this.y > 322 && this.y + this.inertie < 322 && this.x > 285 && this.x < 712.5)) 
				this.inertie = 1; //stoppe la montée si tu hit une platforme d'en bas
	
			// if(isKeyDown("Down")) {this.y -= 15;} //cheats codes
			// if(isKeyDown("Up")) {this.y -= 1;}
			
			if (this.y + this.inertie >= 233 && this.y < 322) { //plateforme haut
				if (this.x > 285 && this.x < 712.5){
					this.y = 233;
					this.inertie = 0;
					if(isKeyDown("Up") || isKeyDown("z")) { //flemme de faire qqch de propre
						this.inertie = -20; //on atteint jamais le haut de l'écran
						this.canJump = false;
					}
				}
			} {this.canJump = false;}
	
			if (this.y + this.inertie >= 460 && this.y < 544) { //plateformes bas
				if (this.x < 372.5 || this.x > 627.5){
					this.y = 460;
					this.canJump = true;
					this.inertie = 0;
				}
			} else {this.canJump = false;}
	
			
			if (!(this.y + this.inertie > height - this.img.height/2*taille/1.5)) { //sol
				this.gravity();
			} else {
				this.y = height - this.img.height/2*taille/1.5;
				this.canJump = true;
			}
	
			if(this.canJump){
				if(isKeyDown("Up") || isKeyDown("z")) {
					this.inertie = -25;
					this.canJump = false;
				}
			}
		}
//---------------------------
	};
};