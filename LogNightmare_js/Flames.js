function Flame (){
	if(Math.random() > 0.5) this.x = 0 + lance.width*taille; else this.x = width-lance.width*taille;
	this.y = 65;
	this.pv;
	this.direction = 0;
	this.v = new Vector(0, 0);
	this.deathCounted = false;

	this.show = function(){
		drawImage(imgFlame, this.x, this.y, this.pv/100, this.pv/100, this.direction, true);
		
		this.v = new Vector(j.x - this.x, j.y - j.img.height/2 - this.y);
		this.v.setMagnitude(3);

		this.delta = new Vector(Math.random()*2, Math.random()*2);
		if (this.delta.x > 1) this.delta.x *= -1;
		if (this.delta.y > 1) this.delta.y *= -1;

		this.x += this.v.x + this.delta.x;
		this.y += this.v.y + this.delta.y;

		for (var k = eau.length - 1; k >= 0; k--) {
			if (eau[k].timer >= 0){
				if(dist(this.x, this.y, eau[k].x, eau[k].y) < this.pv/3) this.pv -= (1/this.pv)*5;
			}
		}



		
		if (this.pv > 10 && areRectsColliding(this.x - this.pv/5, this.y - this.pv/5, this.x + this.pv/5, this.y + this.pv/5, j.x - j.img.width, j.y - j.img.height, j.x + j.img.width, j.y + j.img.height)) j.pv --; 
	}
}
