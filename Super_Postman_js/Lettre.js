function Lettre(x, y, v) {
	this.x = x;
	this.y = y;
	this.v = v;
	this.v.setNorme(5);
	this.img = newImage("img/Player/letter.png");


	this.show = function(){
		fill(255, 0, 0);
		try{
			if(this.v.x >= 0){
				if(lvls[lvl][Math.round((this.y - 10 - camy)/16/taille)][Math.round((this.x - 5 - camx)/16/taille)] >= 1 && lvls[lvl] [Math.round((this.y - 10 - camy)/16/taille)][Math.round((this.x - 5 - camx)/16/taille)] <= 4){
					this.destroy();
				}
				if(lvls[lvl][Math.round((this.y - 10 - camy)/16/taille)-1][Math.round((this.x - 5 - camx)/16/taille)] == 7 || lvls[lvl][Math.round((this.y - 10 - camy)/16/taille)-1][Math.round((this.x - 5 - camx)/16/taille)] == 8){
					if(isPointInRect(this.x, this.y, camx + (Math.round((this.x - 5 - camx)/16/taille))*16*taille, camy + (Math.round((this.y - 10 - camy)/16/taille))*16*taille, 32, 16)){
						this.win();
					}
				}

			} else {
				if(lvls[lvl][Math.round((this.y - 25 - camy)/16/taille)][Math.round((this.x - 15 - camx)/16/taille)] >= 1 && lvls[lvl] [Math.round((this.y - 25 - camy)/16/taille)][Math.round((this.x - 15 - camx)/16/taille)] <= 4){
					this.destroy();
				}
				if(lvls[lvl][Math.round((this.y - 10 - camy)/16/taille)-1][Math.round((this.x - 15 - camx)/16/taille)] == 7 || lvls[lvl][Math.round((this.y - 10 - camy)/16/taille)-1][Math.round((this.x - 15 - camx)/16/taille)] == 8){
					if(isPointInRect(this.x, this.y, camx + (Math.round((this.x - 15 - camx)/16/taille))*16*taille, camy + (Math.round((this.y - 10 - camy)/16/taille))*16*taille, 32, 16)){
						this.win();
					}
				}
			}
		} catch(e){this.destroy();};
				// fill(255, 0, 0);
				// rect(camx + (Math.round((this.x - 35 - camx)/16/taille))*16*taille, camy + (Math.round((this.y - 10 - camy)/16/taille))*16*taille, 32, 32);
		this.x += this.v.x;
		this.y += this.v.y;
		this.v.y += 0.05;
		this.v.setNorme(5);		
		drawImage(this.img, this.x, this.y, taille, taille, this.v.angle(), true);
		//si la lettre sort des length de lvls[lvl], lose
		//log("Place in table: lvls["+lvl+"]["+Math.round((this.y - camy)/16/taille)+"]["+Math.round((this.x - camx)/16/taille)+"]");
	}

	this.destroy = function(){
		j.respawn(); 
		l = 0; 
		return;
	}

	this.win = function(){
		j.win = true;
		c = [];
		for (var i = 0; i < 20; i++) {
			c[i] = new Confettis(this.x, this.y);
		}
		j.winTimer = 0;
	}
}